package api.goraebab.domain.blueprint.dockerObject;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CustomConfig {

  private String subnet;

  @Builder
  public CustomConfig(String subnet) {
    this.subnet = subnet;
  }

}
