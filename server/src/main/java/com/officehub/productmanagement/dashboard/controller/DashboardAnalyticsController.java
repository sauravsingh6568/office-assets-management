package com.officehub.productmanagement.dashboard.controller;

import com.officehub.productmanagement.common.ApiResponse;
import com.officehub.productmanagement.dashboard.dto.DashboardAnalyticsResponse;
import com.officehub.productmanagement.dashboard.service.DashboardAnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardAnalyticsController {

    private final DashboardAnalyticsService dashboardAnalyticsService;

    public DashboardAnalyticsController(DashboardAnalyticsService dashboardAnalyticsService) {
        this.dashboardAnalyticsService = dashboardAnalyticsService;
    }

    @GetMapping("/analytics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DashboardAnalyticsResponse>> getDashboardAnalytics() {
        return ResponseEntity.ok(ApiResponse.<DashboardAnalyticsResponse>builder()
                .message("Dashboard analytics fetched successfully")
                .data(dashboardAnalyticsService.getDashboardAnalytics())
                .build());
    }
}
