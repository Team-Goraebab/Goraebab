package api.goraebab.domain.remote.docker.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class DaemonReqDto {

  @NotBlank
  @Size(max = 255, message = "Host must be less than 255 characters")
  @Schema(description = "The host address of the Docker daemon.", example = "255.255.255.255")
  private String host;

  @NotNull
  @Positive
  @Max(value = 65535, message = "Port must be 1 ~ 65535")
  @Schema(description = "The port number used to connect to the Docker daemon.", example = "2375")
  private Integer port;

  @NotBlank
  @Size(max = 255, message = "Name must be less than 255 characters")
  @Schema(description = "The name of the Docker daemon.", example = "Gorae's Docker daemon")
  private String name;

  @Builder
  public DaemonReqDto(String host, Integer port, String name) {
    this.host = host;
    this.port = port;
    this.name = name;
  }
}
