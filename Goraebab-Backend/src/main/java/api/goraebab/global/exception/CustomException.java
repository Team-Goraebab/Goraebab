package api.goraebab.global.exception;

import lombok.Getter;

import java.util.List;
import java.util.Map;

@Getter
public class CustomException extends RuntimeException {

    private final ErrorCode errorCode;
    private List<Map<String, Object>> failedContainers;
    private List<Map<String, Object>> succeededContainers;

    public CustomException(String message, ErrorCode errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public CustomException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    public CustomException(ErrorCode errorCode, Throwable cause) {
        super(errorCode.getMessage(), cause);
        this.errorCode = errorCode;
    }

    public CustomException(ErrorCode errorCode, String message, List<Map<String, Object>> failedContainers, List<Map<String, Object>> succeededContainers) {
        super(message);
        this.errorCode = errorCode;
        this.failedContainers = failedContainers;
        this.succeededContainers = succeededContainers;
    }

}
