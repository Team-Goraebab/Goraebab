package api.goraebab.domain.blueprint.dockerObject;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CustomHost {

  @JsonProperty("network")
  private List<CustomNetwork> customNetwork;

  @JsonProperty("volume")
  private List<CustomVolume> customVolume;

  private Boolean isLocal;

  private String ip;

  @Builder
  public CustomHost(List<CustomNetwork> customNetwork, List<CustomVolume> customVolume, Boolean isLocal, String ip) {
    this.customNetwork = customNetwork;
    this.customVolume = customVolume;
    this.isLocal = isLocal;
    this.ip = ip;
  }

}
