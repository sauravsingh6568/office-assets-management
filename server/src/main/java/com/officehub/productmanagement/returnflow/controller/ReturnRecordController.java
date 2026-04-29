package com.officehub.productmanagement.returnflow.controller;

import com.officehub.productmanagement.common.ApiResponse;
import com.officehub.productmanagement.returnflow.dto.ReturnRequest;
import com.officehub.productmanagement.returnflow.model.ReturnRecord;
import com.officehub.productmanagement.returnflow.service.ReturnRecordService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/returns")
public class ReturnRecordController {

    private final ReturnRecordService returnRecordService;

    public ReturnRecordController(ReturnRecordService returnRecordService) {
        this.returnRecordService = returnRecordService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ReturnRecord>>> getAllReturns() {
        return ResponseEntity.ok(ApiResponse.<List<ReturnRecord>>builder()
                .message("Return records fetched successfully")
                .data(returnRecordService.getAllReturns())
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ReturnRecord>> getReturnById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.<ReturnRecord>builder()
                .message("Return record fetched successfully")
                .data(returnRecordService.getReturnById(id))
                .build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ReturnRecord>> createReturn(@Valid @RequestBody ReturnRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<ReturnRecord>builder()
                        .message("Return record created successfully")
                        .data(returnRecordService.createReturn(request))
                        .build());
    }
}
