package api.goraebab.domain.blueprint.controller;

import api.goraebab.domain.blueprint.dto.BlueprintReqDto;
import api.goraebab.domain.blueprint.dto.BlueprintResDto;
import api.goraebab.domain.blueprint.dto.BlueprintsResDto;
import api.goraebab.domain.blueprint.service.BlueprintServiceImpl;
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
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Blueprint API")
@RequestMapping("/blueprints")
@RequiredArgsConstructor
public class BlueprintController {

    private final BlueprintServiceImpl blueprintService;

    @Operation(summary = "Retrieve the list of blueprints",
        description = "Fetches a list of blueprints associated with a specific storage ID.")
    @GetMapping
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Success"
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
    public ResponseEntity<List<BlueprintsResDto>> getBlueprints(@RequestParam(required = false) @Schema(description = "The unique identifier of the storage. If null, the blueprint is considered to be in the local storage.") Long storageId) {
        List<BlueprintsResDto> blueprints = blueprintService.getBlueprints(storageId);
        return ResponseEntity.ok(blueprints);
    }

    @Operation(summary = "Retrieve a single blueprint",
        description = "Fetches the details of a single blueprint based on the provided blueprint ID.")
    @GetMapping("/{blueprintId}/detail")
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
            responseCode = "404",
            description = "The requested resource could not be found.",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class),
                examples =
                @ExampleObject(
                    value =
                        "{\"status\": \"NOT_FOUND_VALUE\", \"code\": 404, \"message\": \"The requested resource could not be found.\", \"errors\": []}"))
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
    public ResponseEntity<BlueprintResDto> getBlueprint(@RequestParam(required = false) @Schema(description = "The unique identifier of the storage. If null, the blueprint is considered to be in the local storage.") Long storageId,
                                                        @PathVariable @Schema(description = "The unique identifier of the blueprint.") Long blueprintId) {
        BlueprintResDto blueprint = blueprintService.getBlueprintById(storageId, blueprintId);
        return ResponseEntity.ok(blueprint);
    }

    @Operation(summary = "Save the blueprint to the local database",
        description = "Saves a new blueprint associated with the specified storage ID to the local database.")
    @PostMapping
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
            responseCode = "404",
            description = "The requested resource could not be found.",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class),
                examples =
                @ExampleObject(
                    value =
                        "{\"status\": \"NOT_FOUND_VALUE\", \"code\": 404, \"message\": \"The requested resource could not be found.\", \"errors\": []}"))
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Failed to save blueprint.",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class),
                examples =
                @ExampleObject(
                    value =
                        "{\"status\": \"SAVE_FAILED\", \"code\": 500, \"message\": \"Failed to save blueprint.\", \"errors\": []}"))
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Failed to synchronize Docker with the specified blueprint.",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class),
                examples =
                @ExampleObject(
                    value =
                        "{\"status\": \"DOCKER_SYNC_FAILED\", \"code\": 500, \"message\": \"Failed to synchronize Docker with the specified blueprint.\", \"errors\": []}"))
        ),
        @ApiResponse(
            responseCode = "500",
            description = "An error occurred during the container synchronization process.",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class),
                examples =
                @ExampleObject(
                    value =
                        "{\"status\": \"CONTAINER_SYNC_FAILED\", \"code\": 500, \"message\": \"An error occurred during the container synchronization process.\", \"errors\": []}"))
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Failed to stop or remove the specified container.",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class),
                examples =
                @ExampleObject(
                    value =
                        "{\"status\": \"CONTAINER_REMOVAL_FAILED\", \"code\": 500, \"message\": \"Failed to stop or remove the specified container.\", \"errors\": []}"))
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Failed to create the specified Docker container.",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class),
                examples =
                @ExampleObject(
                    value =
                        "{\"status\": \"CONTAINER_CREATION_FAILED\", \"code\": 500, \"message\": \"Failed to create the specified Docker container.\", \"errors\": []}"))
        )
    })
    public ResponseEntity<Void> saveBlueprint(@RequestParam(required = false) @Schema(description = "The unique identifier of the storage. If null, the blueprint is considered to be in the local storage.") Long storageId,
                                              @RequestBody @Valid BlueprintReqDto blueprintReqDto) {
        blueprintService.saveBlueprint(storageId, blueprintReqDto);

        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Modify the blueprint",
        description = "Updates the details of an existing blueprint in the local database.")
    @PatchMapping("/{blueprintId}")
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
            responseCode = "404",
            description = "The requested resource could not be found.",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class),
                examples =
                @ExampleObject(
                    value =
                        "{\"status\": \"NOT_FOUND_VALUE\", \"code\": 404, \"message\": \"The requested resource could not be found.\", \"errors\": []}"))
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Failed to modify blueprint",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class),
                examples =
                @ExampleObject(
                    value =
                        "{\"status\": \"MODIFY_FAILED\", \"code\": 500, \"message\": \"Failed to modify blueprint.\", \"errors\": []}"))
        )
    })
    public ResponseEntity<Void> modifyBlueprint(@RequestParam(required = false) @Schema(description = "The unique identifier of the storage. If null, the blueprint is considered to be in the local storage.") Long storageId,
                                                @PathVariable @Schema(description = "The unique identifier of the blueprint.") Long blueprintId,
                                                @RequestBody @Valid BlueprintReqDto blueprintReqDto) {
        blueprintService.modifyBlueprint(storageId, blueprintId, blueprintReqDto);

        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Delete the blueprint",
        description = "Deletes the specified blueprint from the local database based on the blueprint ID.")
    @DeleteMapping("/{storageId}/{blueprintId}")
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
            responseCode = "404",
            description = "The requested resource could not be found.",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class),
                examples =
                @ExampleObject(
                    value =
                        "{\"status\": \"NOT_FOUND_VALUE\", \"code\": 404, \"message\": \"The requested resource could not be found.\", \"errors\": []}"))
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
    public ResponseEntity<Void> deleteBlueprint(@RequestParam(required = false) @Schema(description = "The unique identifier of the storage. If null, the blueprint is considered to be in the local storage.") Long storageId,
                                                @PathVariable @Schema(description = "The unique identifier of the blueprint.") Long blueprintId) {
        blueprintService.deleteBlueprint(storageId, blueprintId);

        return ResponseEntity.ok().build();
    }

}
