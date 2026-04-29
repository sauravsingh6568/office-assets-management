package com.officehub.productmanagement.returnflow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class ReturnRequest {

    @NotBlank(message = "Assignment ID is required")
    private String assignmentId;

    @NotBlank(message = "Return condition is required")
    private String returnCondition;

    private String inspectorNotes;

    @NotNull(message = "Returned date is required")
    private LocalDate returnedDate;

    public String getAssignmentId() {
        return assignmentId;
    }

    public void setAssignmentId(String assignmentId) {
        this.assignmentId = assignmentId;
    }

    public String getReturnCondition() {
        return returnCondition;
    }

    public void setReturnCondition(String returnCondition) {
        this.returnCondition = returnCondition;
    }

    public String getInspectorNotes() {
        return inspectorNotes;
    }

    public void setInspectorNotes(String inspectorNotes) {
        this.inspectorNotes = inspectorNotes;
    }

    public LocalDate getReturnedDate() {
        return returnedDate;
    }

    public void setReturnedDate(LocalDate returnedDate) {
        this.returnedDate = returnedDate;
    }
}
