package com.officehub.productmanagement.returnflow.service;

import com.officehub.productmanagement.assignment.model.Assignment;
import com.officehub.productmanagement.assignment.service.AssignmentService;
import com.officehub.productmanagement.common.exception.ResourceNotFoundException;
import com.officehub.productmanagement.returnflow.dto.ReturnRequest;
import com.officehub.productmanagement.returnflow.model.ReturnRecord;
import com.officehub.productmanagement.returnflow.repository.ReturnRecordRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ReturnRecordService {

    private final ReturnRecordRepository returnRecordRepository;
    private final AssignmentService assignmentService;

    public ReturnRecordService(
            ReturnRecordRepository returnRecordRepository,
            AssignmentService assignmentService) {
        this.returnRecordRepository = returnRecordRepository;
        this.assignmentService = assignmentService;
    }

    public List<ReturnRecord> getAllReturns() {
        return returnRecordRepository.findAll();
    }

    public ReturnRecord getReturnById(String id) {
        return returnRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Return record not found"));
    }

    public ReturnRecord createReturn(ReturnRequest request) {
        Assignment assignment = assignmentService.markAsReturned(request.getAssignmentId());

        ReturnRecord record = new ReturnRecord();
        record.setAssignmentId(assignment.getId());
        record.setEmployeeId(assignment.getEmployeeId());
        record.setProductId(assignment.getProductId());
        record.setReturnCondition(request.getReturnCondition());
        record.setInspectorNotes(request.getInspectorNotes());
        record.setReturnedDate(request.getReturnedDate());

        return returnRecordRepository.save(record);
    }
}
