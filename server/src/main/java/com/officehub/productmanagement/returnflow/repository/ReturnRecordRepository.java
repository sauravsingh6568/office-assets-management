package com.officehub.productmanagement.returnflow.repository;

import com.officehub.productmanagement.returnflow.model.ReturnRecord;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ReturnRecordRepository extends MongoRepository<ReturnRecord, String> {
}
