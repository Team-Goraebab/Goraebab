package api.goraebab.domain.blueprint.dockerObject;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CustomNetworkSettings {

  private String gateway;

  private String ipAddress;


  @Builder
  public CustomNetworkSettings(String gateway, String ipAddress) {
    this.gateway = gateway;
    this.ipAddress = ipAddress;
  }

}
