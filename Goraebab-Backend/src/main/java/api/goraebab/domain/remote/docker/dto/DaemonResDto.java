package api.goraebab.domain.remote.docker.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class DaemonResDto {

  @Schema(description = "The unique identifier of the Docker daemon.", example = "1")
  private Long daemonId;

  @Schema(description = "The host address of the Docker daemon.", example = "255.255.255.255")
  private String host;

  @Schema(description = "The port number used to connect to the Docker daemon.", example = "2375")
  private Integer port;

  @Schema(description = "The name of the Docker daemon.", example = "Gorae's Docker daemon")
  private String name;


  @Builder
  public DaemonResDto(Long daemonId, String host, Integer port, String name) {
    this.daemonId = daemonId;
    this.host = host;
    this.port = port;
    this.name = name;
  }

}
