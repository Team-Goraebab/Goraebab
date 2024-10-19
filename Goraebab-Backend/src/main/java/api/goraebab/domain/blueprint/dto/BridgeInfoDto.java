package api.goraebab.domain.blueprint.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

import java.util.List;

@Getter
public class BridgeInfoDto {

    @Schema(description = "The name of the bridge.", example = "MyBridge")
    private String bridgeName;

    @Schema(description = "The gateway address of the bridge.", example = "192.168.1.1")
    private String bridgeGateway;

    @Schema(description = "List of containers associated with the bridge.")
    private List<ContainerInfoDto> containers;

    @JsonIgnore
    public boolean isValid() {
        return !bridgeName.isEmpty() && !bridgeGateway.isEmpty();
    }

    public void setContainers(List<ContainerInfoDto> containers) {
        this.containers = containers;
    }

    public BridgeInfoDto(String bridgeName, String bridgeGateway) {
        this.bridgeName = bridgeName;
        this.bridgeGateway = bridgeGateway;
    }

}