package api.goraebab.global.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    /**
     * common error
     */

    INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, 400, "The provided input value is invalid."),
    INVALID_TYPE_VALUE(HttpStatus.BAD_REQUEST, 400, "The type of the provided input value does not match the expected type."),
    DATA_INTEGRITY_VIOLATION(HttpStatus.BAD_REQUEST, 400, "A data integrity violation occurred. This usually happens when trying to save or update data that violates database constraints (e.g., not-null, unique constraints)."),
    NOT_FOUND_VALUE(HttpStatus.NOT_FOUND, 404, "The requested resource could not be found."),
    METHOD_NOT_ALLOWED(HttpStatus.METHOD_NOT_ALLOWED, 405, "The HTTP method used is not allowed for the requested endpoint."),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, 500, "An unexpected error occurred on the server."),
    CONNECTION_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, 500, "Failed to establish a connection to the external service or database."),
    RETRIEVAL_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, 500, "Failed to retrieve data from the database."),
    DELETE_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, 500, "Failed to delete the specified resource."),


    /**
     * docker error
     */


    /**
     * storage error
     */

    COPY_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, 500, "Failed to copy data from remote storage to local storage."),


    /**
     * blueprint error
     */

    SAVE_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, 500, "Failed to save blueprint."),
    MODIFY_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, 500, "Failed to modify blueprint."),
    FILE_PROCESSING_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, 500, "Failed to process file content."),
    DOCKER_SYNC_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, 500, "Failed to synchronize Docker with the specified blueprint."),
    CONTAINER_SYNC_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, 500, "An error occurred during the container synchronization process."),
    CONTAINER_REMOVAL_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, 500, "Failed to stop or remove the specified container."),
    CONTAINER_CREATION_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, 500, "Failed to create the specified Docker container.");

    private final HttpStatus status;

    private final int code;

    private final String message;

}
