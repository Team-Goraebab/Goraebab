package api.goraebab.domain.blueprint.dockerObject;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ProcessedData {

  @JsonProperty("host")
  private List<CustomHost> customHost;


  @Builder
  public ProcessedData(List<CustomHost> customHost) {
    this.customHost = customHost;
  }

}
