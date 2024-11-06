package api.goraebab.domain.blueprint.dockerObject;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CustomNetwork {

  private String id;

  private String name;

  private String driver;

  @JsonProperty("ipam")
  private CustomIpam customIpam;

  @JsonProperty("containers")
  private List<CustomContainer> customContainers;


  @Builder
  public CustomNetwork(String id, String name, String driver, CustomIpam customIpam,
      List<CustomContainer> customContainers) {
    this.id = id;
    this.name = name;
    this.driver = driver;
    this.customIpam = customIpam;
    this.customContainers = customContainers;
  }

}