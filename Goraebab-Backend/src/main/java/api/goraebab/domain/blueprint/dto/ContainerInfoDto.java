package api.goraebab.domain.blueprint.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

import java.util.List;

@Getter
public class ContainerInfoDto {

    @Schema(description = "The name of the container.", example = "myContainer")
    private String containerName;

    @Schema(description = "The IP address of the container.", example = "172.17.0.2")
    private String containerIpAddress;

    @Schema(description = "The current status of the container.", example = "Running or Stopped")
    private String containerStatus;

    @Schema(description = "The image used by the container.", example = "nginx:latest")
    private String image;

    @Schema(description = "List of volumes mounted to the container.")
    private List<String> volumes;

    public ContainerInfoDto(String containerName, String containerIpAddress, String containerStatus, String image, List<String> volumes) {
        this.containerName = containerName;
        this.containerIpAddress = containerIpAddress;
        this.containerStatus = containerStatus;
        this.image = image;
        this.volumes = volumes;
    }

}