package api.goraebab.domain.blueprint.service;

import api.goraebab.domain.blueprint.dockerObject.ProcessedData;

import java.util.List;
import java.util.Map;

public interface DockerSyncService {

    List<Map<String, Object>> syncDockerWithBlueprintData(ProcessedData processedData);

}