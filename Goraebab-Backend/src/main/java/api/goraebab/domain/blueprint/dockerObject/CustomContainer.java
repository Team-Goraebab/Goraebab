package api.goraebab.domain.blueprint.dockerObject;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CustomContainer {

  private String containerId;

  private String containerName;

  @JsonProperty("image")
  private CustomImage customImage;

  @JsonProperty("networkSettings")
  private CustomNetworkSettings customNetworkSettings;

  @JsonProperty("ports")
  private List<CustomPort> customPorts;

  @JsonProperty("mounts")
  private List<CustomMount> customMounts;

  @JsonProperty("env")
  private List<String> customEnv;

  @JsonProperty("cmd")
  private List<String> customCmd;


  @Builder
  public CustomContainer(String containerId, String containerName, CustomImage customImage,
      CustomNetworkSettings customNetworkSettings, List<CustomPort> customPorts,
      List<CustomMount> customMounts, List<String> customEnv, List<String> customCmd) {
    this.containerId = containerId;
    this.containerName = containerName;
    this.customImage = customImage;
    this.customNetworkSettings = customNetworkSettings;
    this.customPorts = customPorts;
    this.customMounts = customMounts;
    this.customEnv = customEnv;
    this.customCmd = customCmd;
  }

}
