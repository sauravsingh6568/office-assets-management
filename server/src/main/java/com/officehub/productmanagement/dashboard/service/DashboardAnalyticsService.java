package com.officehub.productmanagement.dashboard.service;

import com.officehub.productmanagement.assignment.model.Assignment;
import com.officehub.productmanagement.assignment.repository.AssignmentRepository;
import com.officehub.productmanagement.dashboard.dto.DashboardAnalyticsResponse;
import com.officehub.productmanagement.employee.model.Employee;
import com.officehub.productmanagement.employee.repository.EmployeeRepository;
import com.officehub.productmanagement.product.model.Product;
import com.officehub.productmanagement.product.repository.ProductRepository;
import com.officehub.productmanagement.returnflow.repository.ReturnRecordRepository;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class DashboardAnalyticsService {

    private final EmployeeRepository employeeRepository;
    private final ProductRepository productRepository;
    private final AssignmentRepository assignmentRepository;
    private final ReturnRecordRepository returnRecordRepository;

    public DashboardAnalyticsService(
            EmployeeRepository employeeRepository,
            ProductRepository productRepository,
            AssignmentRepository assignmentRepository,
            ReturnRecordRepository returnRecordRepository) {
        this.employeeRepository = employeeRepository;
        this.productRepository = productRepository;
        this.assignmentRepository = assignmentRepository;
        this.returnRecordRepository = returnRecordRepository;
    }

    public DashboardAnalyticsResponse getDashboardAnalytics() {
        List<Employee> employees = employeeRepository.findAll();
        List<Product> products = productRepository.findAll();
        List<Assignment> assignments = assignmentRepository.findAll();

        long activeAssignments = assignments.stream()
                .filter(assignment -> hasStatus(assignment.getStatus(), "ASSIGNED"))
                .count();
        long returnedAssignments = assignments.stream()
                .filter(assignment -> hasStatus(assignment.getStatus(), "RETURNED"))
                .count();
        long assignedProducts = products.stream()
                .filter(product -> hasStatus(product.getStatus(), "ASSIGNED"))
                .count();
        long availableProducts = products.stream()
                .filter(product -> hasStatus(product.getStatus(), "AVAILABLE"))
                .count();

        return new DashboardAnalyticsResponse(
                employees.size(),
                products.size(),
                assignments.size(),
                activeAssignments,
                returnedAssignments,
                returnRecordRepository.count(),
                availableProducts,
                assignedProducts,
                groupBy(employees, Employee::getDepartment),
                groupBy(products, Product::getCategory));
    }

    private boolean hasStatus(String value, String expected) {
        return value != null && value.trim().equalsIgnoreCase(expected);
    }

    private <T> Map<String, Long> groupBy(List<T> records, Function<T, String> classifier) {
        return records.stream()
                .map(classifier)
                .filter(value -> value != null && !value.isBlank())
                .collect(Collectors.groupingBy(
                        value -> value.trim().toUpperCase(Locale.ROOT),
                        Collectors.counting()));
    }
}
