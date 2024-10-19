package api.goraebab.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.BDDMockito.any;
import static org.mockito.BDDMockito.anyLong;
import static org.mockito.BDDMockito.argThat;
import static org.mockito.BDDMockito.doNothing;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.verify;
import static org.mockito.Mockito.times;

import api.goraebab.domain.blueprint.dto.BlueprintReqDto;
import api.goraebab.domain.blueprint.dto.BlueprintResDto;
import api.goraebab.domain.blueprint.dto.BlueprintsResDto;
import api.goraebab.domain.blueprint.entity.Blueprint;
import api.goraebab.domain.blueprint.mapper.BlueprintMapper;
import api.goraebab.domain.blueprint.repository.BlueprintRepository;
import api.goraebab.domain.blueprint.service.BlueprintServiceImpl;
import api.goraebab.domain.remote.database.dto.StorageResDto;
import api.goraebab.domain.remote.database.entity.DBMS;
import api.goraebab.domain.remote.database.entity.Storage;
import api.goraebab.domain.remote.database.repository.StorageRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
public class BlueprintServiceTest {

    @Mock
    private BlueprintRepository blueprintRepository;

    @Mock
    private StorageRepository storageRepository;

    @Spy
    private BlueprintMapper blueprintMapper = Mappers.getMapper(BlueprintMapper.class);

    @InjectMocks
    private BlueprintServiceImpl blueprintService;

    private Storage storage;
    private StorageResDto storageResDto;
    private Blueprint blueprint;
    private BlueprintReqDto blueprintReqDto;

    @BeforeEach
    void setUp() {
        storage = new Storage("123.123.123.123", 8080, DBMS.MYSQL, "Storage1", "root", "password");
        ReflectionTestUtils.setField(storage, "id", 1L);
        storageResDto = new StorageResDto(storage.getId(), storage.getHost(), storage.getPort(),
            storage.getDbms(), storage.getName(), storage.getUsername());
        blueprint = new Blueprint("Blueprint1", "Data1", storage);
        ReflectionTestUtils.setField(blueprint, "id", 1L);
        blueprintReqDto = new BlueprintReqDto("Blueprint1", "Data1");

    }

    @Test
    @DisplayName("설계도 전체 목록 조회")
    void getBlueprints() {
        // given
        List<Blueprint> blueprints = List.of(blueprint);
        given(blueprintRepository.findByStorageId(anyLong())).willReturn(blueprints);

        // when
        List<BlueprintsResDto> result = blueprintService.getBlueprints(storage.getId());

        // then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(blueprint.getName(), result.get(0).getName());
    }

    @Test
    @DisplayName("설계도 단건 조회")
    void getBlueprint() {
        // given
        given(blueprintRepository.findByStorageIdAndId(anyLong(), anyLong())).willReturn(Optional.of(blueprint));

        // when
        BlueprintResDto result = blueprintService.getBlueprint(1L, 1L);

        // then
        assertNotNull(result);
        assertEquals(blueprint.getId(), result.getBlueprintId());
        assertEquals(blueprint.getName(), result.getName());
        assertEquals(blueprint.getStorage().getId(), result.getStorageInfo().getStorageId());
        assertEquals(blueprint.getStorage().getHost(), result.getStorageInfo().getHost());
    }

    @Test
    @DisplayName("설계도 저장")
    void saveBlueprint() {
        // given
        given(storageRepository.findById(anyLong())).willReturn(Optional.ofNullable(storage));

        // when
        blueprintService.saveBlueprint(1L, blueprintReqDto);

        // then
        verify(blueprintRepository, times(1)).save(argThat(bp ->
                "Blueprint1".equals(bp.getName())
                        && "Data1".equals(bp.getData())
                        && storage.equals(bp.getStorage())
                        && !bp.getIsRemote()
        ));
    }

    @Test
    @DisplayName("설계도 삭제")
    void deleteBlueprint() {
        // given
        given(blueprintRepository.findByStorageIdAndId(anyLong(), anyLong())).willReturn(
            Optional.ofNullable(blueprint));
        doNothing().when(blueprintRepository).delete(any());

        // when
        blueprintService.deleteBlueprint(1L, 1L);

        // then
        verify(blueprintRepository).delete(blueprint);
    }

}
