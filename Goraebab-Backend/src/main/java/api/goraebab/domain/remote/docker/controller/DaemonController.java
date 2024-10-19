package api.goraebab.domain.remote.docker.controller;

import api.goraebab.domain.remote.docker.dto.DaemonReqDto;
import api.goraebab.domain.remote.docker.dto.DaemonResDto;
import api.goraebab.domain.remote.docker.service.DaemonService;
import api.goraebab.global.exception.ErrorResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Remote Docker API")
@RequiredArgsConstructor
public class DaemonController {

  private final DaemonService daemonService;

  @Operation(summary = "Load remote daemons info from database",
      description = "Retrieves a list of remote daemons stored in the database.")
  @GetMapping("/remote/daemons")
  @ApiResponses(value = {
      @ApiResponse(
          responseCode = "200",
          description = "Success",
          content = @Content(schema = @Schema(implementation = DaemonResDto.class))
      ),
      @ApiResponse(
          responseCode = "500",
          description = "Failed to retrieve data from the database.",
          content = @Content(schema = @Schema(implementation = ErrorResponse.class),
              examples =
              @ExampleObject(
                  value =
                      "{\"status\": \"RETRIEVAL_FAILED\", \"code\": 500, \"message\": \"Failed to retrieve data from the database.\", \"errors\": []}"))
      )
  })
  public ResponseEntity<List<DaemonResDto>> loadDaemons() {
    List<DaemonResDto> daemonList = daemonService.getDaemons();

    return ResponseEntity.ok(daemonList);
  }

  @Operation(summary = "Connect and save remote daemon in database",
      description = "Establishes a connection to a remote daemon and saves its details in the database.")
  @PostMapping("/remote/daemon/connect")
  @ApiResponses(value = {
      @ApiResponse(
          responseCode = "200",
          description = "Success"
      ),
      @ApiResponse(
          responseCode = "400",
          description = "The type of the provided input value does not match the expected type.",
          content = @Content(schema = @Schema(implementation = ErrorResponse.class),
              examples =
              @ExampleObject(
                  value =
                      "{\"status\": \"INVALID_TYPE_VALUE\", \"code\": 400, \"message\": \"The type of the provided input value does not match the expected type.\", \"errors\": []}"))
      ),
      @ApiResponse(
          responseCode = "500",
          description = "Failed to establish a connection to the external service or database.",
          content = @Content(schema = @Schema(implementation = ErrorResponse.class),
              examples =
              @ExampleObject(
                  value =
                      "{\"status\": \"CONNECTION_FAILED\", \"code\": 500, \"message\": \"Failed to establish a connection to the external service or database.\", \"errors\": []}"))
      )
  })
  public ResponseEntity<Void> connectDaemon(@RequestBody @Valid DaemonReqDto daemonReqDto) {
    daemonService.connectDaemon(daemonReqDto);

    return ResponseEntity.ok().build();
  }

  @Operation(summary = "Delete remote daemon in database",
      description = "Deletes the connection and stored information of a remote daemon from the database based on the provided daemon ID.")
  @DeleteMapping("/remote/daemon/{daemonId}")
  @ApiResponses(value = {
      @ApiResponse(
          responseCode = "200",
          description = "Success"
      ),
      @ApiResponse(
          responseCode = "400",
          description = "The type of the provided input value does not match the expected type.",
          content = @Content(schema = @Schema(implementation = ErrorResponse.class),
              examples =
              @ExampleObject(
                  value =
                      "{\"status\": \"INVALID_TYPE_VALUE\", \"code\": 400, \"message\": \"The type of the provided input value does not match the expected type.\", \"errors\": []}"))
      ),
      @ApiResponse(
          responseCode = "500",
          description = "Failed to delete the specified resource.",
          content = @Content(schema = @Schema(implementation = ErrorResponse.class),
              examples =
              @ExampleObject(
                  value =
                      "{\"status\": \"DELETE_FAILED\", \"code\": 500, \"message\": \"Failed to delete the specified resource.\", \"errors\": []}"))
      )
  })
  public ResponseEntity<Void> disconnectDaemon(
      @PathVariable @Schema(description = "The unique identifier of the Docker daemon to be deleted.") Long daemonId) {
    daemonService.deleteDaemon(daemonId);

    return ResponseEntity.ok().build();
  }

}
