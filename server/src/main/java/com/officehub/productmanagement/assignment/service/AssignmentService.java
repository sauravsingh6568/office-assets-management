package com.officehub.productmanagement.assignment.service;

import com.officehub.productmanagement.assignment.dto.AssignmentRequest;
import com.officehub.productmanagement.assignment.model.Assignment;
import com.officehub.productmanagement.assignment.repository.AssignmentRepository;
import com.officehub.productmanagement.common.exception.BadRequestException;
import com.officehub.productmanagement.common.exception.ResourceNotFoundException;
import com.officehub.productmanagement.employee.service.EmployeeService;
import com.officehub.productmanagement.product.model.Product;
import com.officehub.productmanagement.product.service.ProductService;
import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final EmployeeService employeeService;
    private final ProductService productService;

    public AssignmentService(
            AssignmentRepository assignmentRepository,
            EmployeeService employeeService,
            ProductService productService) {
        this.assignmentRepository = assignmentRepository;
        this.employeeService = employeeService;
        this.productService = productService;
    }

    public List<Assignment> getAllAssignments() {
        return assignmentRepository.findAll();
    }

    public Assignment getAssignmentById(String id) {
        return assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));
    }

    public Assignment createAssignment(AssignmentRequest request) {
        employeeService.getEmployeeById(request.getEmployeeId());
        Product product = productService.getProductById(request.getProductId());

        if ("ASSIGNED".equalsIgnoreCase(product.getStatus())) {
            throw new BadRequestException("Selected product is already assigned");
        }
        if (assignmentRepository.findByProductIdAndStatusIgnoreCase(request.getProductId(), "ASSIGNED").isPresent()) {
            throw new BadRequestException("Selected product already has an active assignment");
        }
        if (request.getReturnDate() != null && request.getReturnDate().isBefore(request.getAssignedDate())) {
            throw new BadRequestException("Return date cannot be before assigned date");
        }

        Assignment assignment = new Assignment();
        assignment.setEmployeeId(request.getEmployeeId());
        assignment.setProductId(request.getProductId());
        assignment.setAssignedDate(request.getAssignedDate());
        assignment.setReturnDate(request.getReturnDate());
        assignment.setStatus("ASSIGNED");

        product.setStatus("ASSIGNED");
        productService.updateProduct(product.getId(), product);

        return assignmentRepository.save(assignment);
    }

    public Assignment markAsReturned(String assignmentId) {
        Assignment assignment = getAssignmentById(assignmentId);
        if ("RETURNED".equalsIgnoreCase(assignment.getStatus())) {
            throw new BadRequestException("Assignment is already marked as returned");
        }

        Product product = productService.getProductById(assignment.getProductId());
        product.setStatus("AVAILABLE");
        productService.updateProduct(product.getId(), product);

        assignment.setReturnDate(LocalDate.now());
        assignment.setStatus("RETURNED");
        return assignmentRepository.save(assignment);
    }

    public void deleteAssignment(String id) {
        Assignment assignment = getAssignmentById(id);
        if ("ASSIGNED".equalsIgnoreCase(assignment.getStatus())) {
            Product product = productService.getProductById(assignment.getProductId());
            product.setStatus("AVAILABLE");
            productService.updateProduct(product.getId(), product);
        }
        assignmentRepository.delete(assignment);
    }
}
