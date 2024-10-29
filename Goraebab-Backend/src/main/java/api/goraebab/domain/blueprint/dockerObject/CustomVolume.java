package api.goraebab.domain.blueprint.dockerObject;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CustomVolume {

  private String name;

  private String driver;


  @Builder
  public CustomVolume(String name, String driver) {
    this.name = name;
    this.driver = driver;
  }

}
