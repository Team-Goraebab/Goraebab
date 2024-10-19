package api.goraebab.global.exception;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ErrorResponse {

    private HttpStatus status;
    private int code;
    private String message;
    private List<String> errors;

    private ErrorResponse(final ErrorCode code, final List<String> errors) {
        this.status = code.getStatus();
        this.code = code.getCode();
        this.message = code.getMessage();
        this.errors = errors;
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
        return new ErrorResponse(code, List.of(error));
    }

    public static ErrorResponse of(final ErrorCode code, final List<String> errors) {
        return new ErrorResponse(code, errors);
    }

}