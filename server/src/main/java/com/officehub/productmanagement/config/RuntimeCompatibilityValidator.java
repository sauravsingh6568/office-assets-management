package com.officehub.productmanagement.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class RuntimeCompatibilityValidator implements ApplicationRunner {

    private final String mongoUri;

    public RuntimeCompatibilityValidator(@Value("${spring.data.mongodb.uri}") String mongoUri) {
        this.mongoUri = mongoUri;
    }

    @Override
    public void run(ApplicationArguments args) {
        int javaFeatureVersion = Runtime.version().feature();
        if (mongoUri.startsWith("mongodb+srv://") && javaFeatureVersion >= 25) {
            throw new IllegalStateException(
                    "MongoDB Atlas connectivity is not supported in this project on Java "
                            + javaFeatureVersion
                            + ". Please switch JAVA_HOME to Java 21 through 24 and restart the backend. "
                            + "Current runtime is Java "
                            + javaFeatureVersion
                            + ".");
        }
    }
}
