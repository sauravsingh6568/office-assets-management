package com.officehub.productmanagement.employee.service;

import com.officehub.productmanagement.common.exception.ResourceNotFoundException;
import com.officehub.productmanagement.employee.model.Employee;
import com.officehub.productmanagement.employee.repository.EmployeeRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Employee getEmployeeById(String id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
    }

    public Employee createEmployee(Employee employee) {
        employee.setId(null);
        return employeeRepository.save(employee);
    }

    public Employee updateEmployee(String id, Employee request) {
        Employee employee = getEmployeeById(id);
        employee.setName(request.getName());
        employee.setDepartment(request.getDepartment());
        employee.setEmail(request.getEmail());
        employee.setPhone(request.getPhone());
        return employeeRepository.save(employee);
    }

    public void deleteEmployee(String id) {
        Employee employee = getEmployeeById(id);
        employeeRepository.delete(employee);
    }
}
