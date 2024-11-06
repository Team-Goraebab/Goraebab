package api.goraebab.domain.blueprint.dto;

import java.util.List;
import java.util.Map;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class SyncResultDto {

  private List<Map<String, Object>> failedContainers;

  private List<Map<String, Object>> succeededContainers;


  @Builder
  public SyncResultDto(List<Map<String, Object>> failedContainers,
      List<Map<String, Object>> succeededContainers) {
    this.failedContainers = failedContainers;
    this.succeededContainers = succeededContainers;
  }
}
