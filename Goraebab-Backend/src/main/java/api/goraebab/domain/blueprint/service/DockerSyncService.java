package api.goraebab.domain.blueprint.service;

import api.goraebab.domain.blueprint.dockerObject.ProcessedData;

public interface DockerSyncService {

    void syncDockerWithBlueprintData(ProcessedData processedData);

}