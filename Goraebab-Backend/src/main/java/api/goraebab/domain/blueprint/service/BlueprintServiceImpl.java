package api.goraebab.domain.blueprint.service;

import api.goraebab.domain.blueprint.dto.BlueprintReqDto;
import api.goraebab.domain.blueprint.dto.BlueprintResDto;
import api.goraebab.domain.blueprint.dto.BlueprintsResDto;
import api.goraebab.domain.blueprint.entity.Blueprint;
import api.goraebab.domain.blueprint.mapper.BlueprintMapper;
import api.goraebab.domain.blueprint.repository.BlueprintRepository;
import api.goraebab.domain.remote.database.entity.Storage;
import api.goraebab.domain.remote.database.repository.StorageRepository;
import api.goraebab.global.exception.CustomException;
import api.goraebab.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BlueprintServiceImpl implements BlueprintService {

    private final BlueprintRepository blueprintRepository;
    private final StorageRepository storageRepository;
    private final DockerSyncServiceImpl dockerSyncService;

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
    public void saveBlueprint(Long storageId, BlueprintReqDto blueprintReqDto) {
        try {
            Storage storage = null;

            if (storageId != null) {
                storage = storageRepository.findById(storageId)
                        .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND_VALUE));
            }

            String dataAsString = convertDataToString(blueprintReqDto.getData());

            Blueprint blueprint = Blueprint.builder()
                    .name(blueprintReqDto.getName())
                    .data(dataAsString)
                    .storage(storage)
                    .isDockerRemote(blueprintReqDto.getIsDockerRemote())
                    .dockerRemoteUrl(blueprintReqDto.getRemoteUrl())
                    .build();

            blueprintRepository.save(blueprint);
            dockerSyncService.syncDockerWithBlueprint(blueprint.getId());
        } catch (Exception e) {
            throw new CustomException(ErrorCode.SAVE_FAILED);
        }
    }

    @Override
    @Transactional
    public void modifyBlueprint(Long storageId, Long blueprintId, BlueprintReqDto blueprintReqDto) {
        try {
            String dataAsString = convertDataToString(blueprintReqDto.getData());

            Blueprint blueprint;

            if (storageId == null) {
                blueprint = blueprintRepository.findById(blueprintId)
                        .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND_VALUE));
            } else {
                blueprint = findBlueprintByStorageAndId(storageId, blueprintId);
            }

            blueprint.modify(blueprintReqDto.getName(), dataAsString);

            blueprintRepository.save(blueprint);
            dockerSyncService.syncDockerWithBlueprint(blueprint.getId());
        } catch (Exception e) {
            throw new CustomException(ErrorCode.MODIFY_FAILED);
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

    private String convertDataToString(MultipartFile file) {
        try {
            return new String(file.getBytes(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new CustomException(ErrorCode.FILE_PROCESSING_ERROR);
        }
    }

}
