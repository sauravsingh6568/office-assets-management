package com.officehub.productmanagement.employee.controller;

import com.officehub.productmanagement.common.ApiResponse;
import com.officehub.productmanagement.employee.model.Employee;
import com.officehub.productmanagement.employee.service.EmployeeService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Employee>>> getAllEmployees() {
        return ResponseEntity.ok(ApiResponse.<List<Employee>>builder()
                .message("Employees fetched successfully")
                .data(employeeService.getAllEmployees())
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Employee>> getEmployeeById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.<Employee>builder()
                .message("Employee fetched successfully")
                .data(employeeService.getEmployeeById(id))
                .build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Employee>> createEmployee(@Valid @RequestBody Employee employee) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<Employee>builder()
                        .message("Employee created successfully")
                        .data(employeeService.createEmployee(employee))
                        .build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Employee>> updateEmployee(
            @PathVariable String id,
            @Valid @RequestBody Employee employee) {
        return ResponseEntity.ok(ApiResponse.<Employee>builder()
                .message("Employee updated successfully")
                .data(employeeService.updateEmployee(id, employee))
                .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEmployee(@PathVariable String id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .message("Employee deleted successfully")
                .build());
    }
}
