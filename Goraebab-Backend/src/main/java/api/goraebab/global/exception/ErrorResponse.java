package api.goraebab.global.exception;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ErrorResponse {

    private HttpStatus status;
    private int code;
    private String message;
    private List<String> errors;
    private List<Map<String, Object>> failedContainers;
    private List<Map<String, Object>> succeededContainers;

    private ErrorResponse(final ErrorCode code, final List<String> errors,
                          final List<Map<String, Object>> failedContainers,
                          final List<Map<String, Object>> succeededContainers) {
        this.status = code.getStatus();
        this.code = code.getCode();
        this.message = code.getMessage();
        this.errors = errors;
        this.failedContainers = failedContainers;
        this.succeededContainers = succeededContainers;
    }

    private ErrorResponse(final ErrorCode code) {
        this.status = code.getStatus();
        this.code = code.getCode();
        this.message = code.getMessage();
        this.errors = new ArrayList<>();
    }

    public static ErrorResponse of(final ErrorCode code) {
        return new ErrorResponse(code);
    }

    public static ErrorResponse of(final ErrorCode code, final String error) {
        return new ErrorResponse(code, List.of(error), null, null); // succeededContainers에 null 전달
    }

    public static ErrorResponse of(final ErrorCode code, final List<String> errors) {
        return new ErrorResponse(code, errors, null, null);
    }

    public static ErrorResponse ofFailedContainers(final ErrorCode code,
                                                   final List<Map<String, Object>> failedContainers,
                                                   final List<Map<String, Object>> succeededContainers) {
        return new ErrorResponse(code, new ArrayList<>(), failedContainers, succeededContainers);
    }

}
