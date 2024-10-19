package api.goraebab.domain.blueprint.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class BlueprintReqDto {

    @NotBlank(message = "Name must not be blank")
    @Size(max = 255, message = "Name must be less than 255 characters")
    @Schema(description = "The name of the blueprint.", example = "Project1 blueprint")
    private String name;

    @Schema(description = "The raw data associated with the blueprint.")
    private MultipartFile data;

    @NotBlank(message = "IsDockerRemote must not be blank")
    @Schema(description = "Indicates whether the blueprint is associated with a remote Docker repository.", example = "true or false")
    private Boolean isDockerRemote;

    @Schema(description = "The URL of the remote Docker repository if isDockerRemote is true.")
    private String remoteUrl;

    public void setData(MultipartFile data) {
        this.data = data;
    }

}
