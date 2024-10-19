package api.goraebab.domain.remote.database.controller;

import api.goraebab.domain.remote.database.dto.StorageReqDto;
import api.goraebab.domain.remote.database.dto.StorageResDto;
import api.goraebab.domain.remote.database.service.StorageServiceImpl;
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
@Tag(name = "Remote Database API")
@RequiredArgsConstructor
public class StorageController {

  private final StorageServiceImpl storageServiceImpl;

  @Operation(summary = "Load remote daemons info from database.",
      description = "This API fetches the info of remote storage daemons from the database "
          + "and returns a list of StorageResDto.")
  @GetMapping("/remote/storages")
  @ApiResponses(value = {
      @ApiResponse(
          responseCode = "200",
          description = "Success",
          content = @Content(schema = @Schema(implementation = StorageResDto.class))),
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
  public ResponseEntity<List<StorageResDto>> loadStorages() {
    List<StorageResDto> storageResDtoListList = storageServiceImpl.getStorages();

    return ResponseEntity.ok(storageResDtoListList);
  }

  @Operation(summary = "Connect and save remote storage in database.",
      description = "Establishes a connection to a remote storage and saves the connection details "
          + "in the local database.")
  @PostMapping("/remote/storage/connect")
  @ApiResponses(value = {
      @ApiResponse(
          responseCode = "200",
          description = "Success"),
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
  public ResponseEntity<Void> connectStorage(
      @RequestBody @Valid StorageReqDto storageReqDto) {
    storageServiceImpl.connectStorage(storageReqDto);

    return ResponseEntity.ok().build();
  }

  @Operation(summary = "Copy remote storage blueprints into database",
      description = "Copies the blueprints of a remote storage into the local database "
          + "based on the provided storage ID.")
  @PostMapping("/remote/storage/{storageId}/copy")
  @ApiResponses(value = {
      @ApiResponse(
          responseCode = "200",
          description = "Success"),
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
          description = "Failed to copy data from remote storage to local storage.",
          content = @Content(schema = @Schema(implementation = ErrorResponse.class),
              examples =
              @ExampleObject(
                  value =
                      "{\"status\": \"COPY_FAILED\", \"code\": 500, \"message\": \"Failed to copy data from remote storage to local storage.\", \"errors\": []}"))
      )
  })
  public ResponseEntity<Void> copyStorage(
      @PathVariable @Schema(description = "The unique identifier of the storage to be copied.") Long storageId) {
    storageServiceImpl.copyStorage(storageId);

    return ResponseEntity.ok().build();
  }

  @Operation(summary = "Delete remote storage in database",
      description = "Deletes the connection and stored info of a remote storage "
          + "from the database based on the provided storage ID.")
  @DeleteMapping("/remote/storage/{storageId}")
  @ApiResponses(value = {
      @ApiResponse(
          responseCode = "200",
          description = "Success"),
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
  public ResponseEntity<Void> disconnectStorage(
      @PathVariable @Schema(description = "The unique identifier of the storage to be deleted.") Long storageId) {
    storageServiceImpl.deleteStorage(storageId);

    return ResponseEntity.ok().build();
  }

}
