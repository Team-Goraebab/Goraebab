package api.goraebab.domain.blueprint.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class HostInfoDto {

    @Schema(description = "The name of the host machine.", example = "host-name")
    private String hostName;

    @Schema(description = "The IP address of the host machine.", example = "192.168.1.100")
    private String hostIpAddress;

    @Schema(description = "Specifies whether the host is remote or local.", example = "remote or local")
    private String hostType;

    @Schema(description = "List of bridges associated with the host.")
    private List<BridgeInfoDto> bridges;

}