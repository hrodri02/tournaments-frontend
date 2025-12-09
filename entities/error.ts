/**
 * Represents a single field validation failure, matching the backend's structure.
 * This is nested within the ApiErrorResponse.
 */
export interface ValidationErrorDetail {
  field: string;
  // This is the constraint name (e.g., "NotNull", "Size") used for translation.
  errorKey: string; 
  message: string; // Developer-friendly message
}

/**
 * Interface that mirrors the full structured error response from the backend.
 * This contains the status, general error key, and optionally, validation errors.
 */
export interface ErrorDetails {
  timestamp: string;
  status: number;
  errorKey: string; // General error key (e.g., "VALIDATION_FAILED", "USER_NOT_FOUND")
  validationErrors?: ValidationErrorDetail[];
}

/**
 * Custom Error class used for all failed HTTP requests.
 * Extends the built-in Error, allowing it to be correctly caught and typed,
 * while holding the full structured API response details.
 */
export class HttpError extends Error {
  public status: number;
  public details: ErrorDetails;

  constructor(status: number, details: ErrorDetails) {
    // Call the parent Error constructor with a concise message
    super(`HTTP Error ${status}: ${details.errorKey}`);
    
    this.name = 'HttpError';
    this.status = status;
    this.details = details;

    // Correctly set the prototype chain for subclasses
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}