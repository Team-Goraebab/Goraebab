package api.goraebab.domain.blueprint.dockerObject;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CustomPort {

  private Integer privatePort;

  private Integer publicPort;


  @Builder
  public CustomPort(int privatePort, int publicPort) {
    this.privatePort = privatePort;
    this.publicPort = publicPort;
  }

}