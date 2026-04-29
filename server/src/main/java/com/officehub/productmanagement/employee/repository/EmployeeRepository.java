package com.officehub.productmanagement.employee.repository;

import com.officehub.productmanagement.employee.model.Employee;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface EmployeeRepository extends MongoRepository<Employee, String> {
}
