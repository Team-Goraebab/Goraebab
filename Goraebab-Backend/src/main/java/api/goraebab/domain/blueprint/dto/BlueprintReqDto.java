package api.goraebab.domain.blueprint.dto;

import api.goraebab.domain.blueprint.dockerObject.ProcessedData;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class BlueprintReqDto {

    @NotBlank(message = "Name must not be blank")
    @Size(max = 255, message = "Name must be less than 255 characters")
    @Schema(description = "The name of the blueprint.", example = "Project1 blueprint")
    private String blueprintName;

    @NotNull(message = "ProcessedData must not be blank")
    @Schema(description = "Parsed data associated with the blueprint.")
    private ProcessedData processedData;


    @Builder
    public BlueprintReqDto(String blueprintName, ProcessedData processedData) {
        this.blueprintName = blueprintName;
        this.processedData = processedData;
    }

}