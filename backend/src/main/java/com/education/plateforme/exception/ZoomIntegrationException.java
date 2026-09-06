package com.education.plateforme.exception;

public class ZoomIntegrationException extends RuntimeException {
    public ZoomIntegrationException(String message) {
        super(message);
    }

    public ZoomIntegrationException(String message, Throwable cause) {
        super(message, cause);
    }
}
