package api.goraebab.domain.blueprint.service;

import api.goraebab.domain.blueprint.dockerObject.ProcessedData;
import api.goraebab.domain.blueprint.dto.BlueprintReqDto;
import api.goraebab.domain.blueprint.dto.BlueprintResDto;
import api.goraebab.domain.blueprint.dto.BlueprintsResDto;
import api.goraebab.domain.blueprint.dto.SyncResultDto;
import api.goraebab.domain.blueprint.entity.Blueprint;
import api.goraebab.domain.blueprint.mapper.BlueprintMapper;
import api.goraebab.domain.blueprint.repository.BlueprintRepository;
import api.goraebab.domain.remote.database.entity.Storage;
import api.goraebab.domain.remote.database.repository.StorageRepository;
import api.goraebab.global.exception.CustomException;
import api.goraebab.global.exception.ErrorCode;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BlueprintServiceImpl implements BlueprintService {

    private final BlueprintRepository blueprintRepository;
    private final StorageRepository storageRepository;
    private final DockerSyncServiceImpl dockerSyncService;
    private final ObjectMapper objectMapper;
    private static final String CONTAINER_SUCCESS = "success";
    private static final String CONTAINER_FAILED = "failed";
    private static final String FAIL_TO_CREATE_MESSAGE = "Failed to create some containers";
    private static final String FAIL_TO_UPDATE_MESSAGE = "Failed to update some containers";
    private static final String STATUS_KEY = "status";


    @Override
    @Transactional(readOnly = true)
    public List<BlueprintsResDto> getBlueprints(Long storageId) {
        List<Blueprint> blueprints;

        try {
            if (storageId == null) {
                blueprints = blueprintRepository.findAll();
            } else {
                blueprints = blueprintRepository.findByStorageId(storageId);
            }
        } catch (Exception e) {
            throw new CustomException(ErrorCode.RETRIEVAL_FAILED);
        }
        return BlueprintMapper.INSTANCE.toBlueprintsResDtoList(blueprints);
    }

    @Override
    @Transactional(readOnly = true)
    public BlueprintResDto getBlueprintById(Long storageId, Long blueprintId) {
        Blueprint blueprint;

        try {
            if (storageId == null) {
                blueprint = blueprintRepository.findById(blueprintId)
                        .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND_VALUE));
            } else {
                blueprint = findBlueprintByStorageAndId(storageId, blueprintId);
            }
        } catch (Exception e) {
            throw new CustomException(ErrorCode.RETRIEVAL_FAILED);
        }
        return BlueprintMapper.INSTANCE.toBlueprintResDto(blueprint);
    }

    @Override
    @Transactional
    public SyncResultDto saveBlueprint(Long storageId, BlueprintReqDto blueprintReqDto) {
      Storage storage = null;

      if (storageId != null) {
          storage = storageRepository.findById(storageId)
                  .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND_VALUE));
      }

      String processedData = convertProcessedDataToJson(blueprintReqDto.getProcessedData());

      Blueprint blueprint = Blueprint.builder()
              .name(blueprintReqDto.getBlueprintName())
              .data(processedData)
              .isRemote(false)
              .storage(storage)
              .build();

      blueprintRepository.save(blueprint);

      List<Map<String, Object>> syncResults = dockerSyncService.syncDockerWithBlueprintData(blueprintReqDto.getProcessedData());

      List<Map<String, Object>> failedContainers = syncResults.stream()
              .filter(result -> CONTAINER_FAILED.equals(result.get(STATUS_KEY)))
              .collect(Collectors.toList());

      List<Map<String, Object>> succeededContainers = syncResults.stream()
              .filter(result -> CONTAINER_SUCCESS.equals(result.get(STATUS_KEY)))
              .collect(Collectors.toList());

      if (!failedContainers.isEmpty()) {
          throw new CustomException(ErrorCode.SAVE_FAILED, FAIL_TO_CREATE_MESSAGE,
              failedContainers, succeededContainers);
      } else {
          return SyncResultDto.builder()
              .failedContainers(failedContainers)
              .succeededContainers(succeededContainers)
              .build();
      }


    }

    @Override
    @Transactional
    public SyncResultDto modifyBlueprint(Long storageId, Long blueprintId, BlueprintReqDto blueprintReqDto) {
      Blueprint blueprint;

      if (storageId == null) {
          blueprint = blueprintRepository.findById(blueprintId)
                  .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND_VALUE));
      } else {
          blueprint = findBlueprintByStorageAndId(storageId, blueprintId);
      }

      String processedData = convertProcessedDataToJson(blueprintReqDto.getProcessedData());
      blueprint.modify(blueprintReqDto.getBlueprintName(), processedData);

      List<Map<String, Object>> syncResults = dockerSyncService.syncDockerWithBlueprintData(blueprintReqDto.getProcessedData());

      List<Map<String, Object>> failedContainers = syncResults.stream()
              .filter(result -> CONTAINER_FAILED.equals(result.get(STATUS_KEY)))
              .collect(Collectors.toList());

      List<Map<String, Object>> succeededContainers = syncResults.stream()
              .filter(result -> CONTAINER_SUCCESS.equals(result.get(STATUS_KEY)))
              .collect(Collectors.toList());

      if (!failedContainers.isEmpty()) {
          throw new CustomException(ErrorCode.MODIFY_FAILED,
              FAIL_TO_UPDATE_MESSAGE, failedContainers, succeededContainers);
      } else {
          return SyncResultDto.builder()
              .failedContainers(failedContainers)
              .succeededContainers(succeededContainers)
              .build();
      }

    }


    @Override
    @Transactional
    public void deleteBlueprint(Long storageId, Long blueprintId) {
        try {
            Blueprint blueprint;

            if (storageId == null) {
                blueprint = blueprintRepository.findById(blueprintId)
                        .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND_VALUE));
            } else {
                blueprint = findBlueprintByStorageAndId(storageId, blueprintId);
            }
            blueprintRepository.delete(blueprint);
        } catch (Exception e) {
            throw new CustomException(ErrorCode.DELETE_FAILED);
        }
    }

    private Blueprint findBlueprintByStorageAndId(Long storageId, Long blueprintId) {
        return blueprintRepository.findByStorageIdAndId(storageId, blueprintId);
    }

    private String convertProcessedDataToJson(ProcessedData processedData) {
        try {
            return objectMapper.writeValueAsString(processedData);
        } catch (Exception e) {
            throw new CustomException(ErrorCode.CONVERSION_FAILED);
        }
    }

}
