package com.officehub.productmanagement.config;

import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

public class EnvironmentSanitizingPostProcessor implements EnvironmentPostProcessor, Ordered {

    private static final String PROPERTY_SOURCE_NAME = "sanitizedEnvironmentVariables";

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        Map<String, Object> sanitizedProperties = new LinkedHashMap<>();
        sanitizeProperty(environment, sanitizedProperties, "MONGODB_URI", "spring.data.mongodb.uri");

        if (!sanitizedProperties.isEmpty()) {
            environment.getPropertySources().addFirst(new MapPropertySource(PROPERTY_SOURCE_NAME, sanitizedProperties));
        }
    }

    private void sanitizeProperty(
            ConfigurableEnvironment environment,
            Map<String, Object> sanitizedProperties,
            String environmentVariableName,
            String propertyName) {
        String rawValue = environment.getProperty(environmentVariableName);
        if (rawValue == null) {
            return;
        }

        String sanitizedValue = stripWrappingQuotes(rawValue.trim());
        if (!sanitizedValue.equals(rawValue)) {
            sanitizedProperties.put(environmentVariableName, sanitizedValue);
            sanitizedProperties.put(propertyName, sanitizedValue);
        }
    }

    private String stripWrappingQuotes(String value) {
        if (value.length() >= 2) {
            char first = value.charAt(0);
            char last = value.charAt(value.length() - 1);
            if ((first == '"' && last == '"') || (first == '\'' && last == '\'')) {
                return value.substring(1, value.length() - 1).trim();
            }
        }
        return value;
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE;
    }
}
