package com.officehub.productmanagement.dashboard.dto;

import java.util.Map;

public class DashboardAnalyticsResponse {

    private final long totalEmployees;
    private final long totalProducts;
    private final long totalAssignments;
    private final long activeAssignments;
    private final long returnedAssignments;
    private final long totalReturns;
    private final long availableProducts;
    private final long assignedProducts;
    private final Map<String, Long> employeesByDepartment;
    private final Map<String, Long> productsByCategory;

    public DashboardAnalyticsResponse(
            long totalEmployees,
            long totalProducts,
            long totalAssignments,
            long activeAssignments,
            long returnedAssignments,
            long totalReturns,
            long availableProducts,
            long assignedProducts,
            Map<String, Long> employeesByDepartment,
            Map<String, Long> productsByCategory) {
        this.totalEmployees = totalEmployees;
        this.totalProducts = totalProducts;
        this.totalAssignments = totalAssignments;
        this.activeAssignments = activeAssignments;
        this.returnedAssignments = returnedAssignments;
        this.totalReturns = totalReturns;
        this.availableProducts = availableProducts;
        this.assignedProducts = assignedProducts;
        this.employeesByDepartment = employeesByDepartment;
        this.productsByCategory = productsByCategory;
    }

    public long getTotalEmployees() {
        return totalEmployees;
    }

    public long getTotalProducts() {
        return totalProducts;
    }

    public long getTotalAssignments() {
        return totalAssignments;
    }

    public long getActiveAssignments() {
        return activeAssignments;
    }

    public long getReturnedAssignments() {
        return returnedAssignments;
    }

    public long getTotalReturns() {
        return totalReturns;
    }

    public long getAvailableProducts() {
        return availableProducts;
    }

    public long getAssignedProducts() {
        return assignedProducts;
    }

    public Map<String, Long> getEmployeesByDepartment() {
        return employeesByDepartment;
    }

    public Map<String, Long> getProductsByCategory() {
        return productsByCategory;
    }
}
