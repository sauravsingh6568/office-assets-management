package com.officehub.productmanagement.assignment.controller;

import com.officehub.productmanagement.assignment.dto.AssignmentRequest;
import com.officehub.productmanagement.assignment.model.Assignment;
import com.officehub.productmanagement.assignment.service.AssignmentService;
import com.officehub.productmanagement.common.ApiResponse;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    private final AssignmentService assignmentService;

    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Assignment>>> getAllAssignments() {
        return ResponseEntity.ok(ApiResponse.<List<Assignment>>builder()
                .message("Assignments fetched successfully")
                .data(assignmentService.getAllAssignments())
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Assignment>> getAssignmentById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.<Assignment>builder()
                .message("Assignment fetched successfully")
                .data(assignmentService.getAssignmentById(id))
                .build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Assignment>> createAssignment(
            @Valid @RequestBody AssignmentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<Assignment>builder()
                        .message("Product assigned successfully")
                        .data(assignmentService.createAssignment(request))
                        .build());
    }

    @PatchMapping("/{id}/return")
    public ResponseEntity<ApiResponse<Assignment>> markAsReturned(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.<Assignment>builder()
                .message("Product returned successfully")
                .data(assignmentService.markAsReturned(id))
                .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAssignment(@PathVariable String id) {
        assignmentService.deleteAssignment(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .message("Assignment deleted successfully")
                .build());
    }
}
