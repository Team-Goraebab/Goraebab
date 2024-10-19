package api.goraebab.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.times;
import static org.mockito.BDDMockito.verify;
import static org.mockito.Mockito.mock;

import api.goraebab.domain.blueprint.repository.BlueprintRepository;
import api.goraebab.domain.remote.database.dto.StorageReqDto;
import api.goraebab.domain.remote.database.dto.StorageResDto;
import api.goraebab.domain.remote.database.entity.DBMS;
import api.goraebab.domain.remote.database.entity.Storage;
import api.goraebab.domain.remote.database.mapper.StorageMapper;
import api.goraebab.domain.remote.database.repository.StorageRepository;
import api.goraebab.domain.remote.database.service.StorageServiceImpl;
import java.util.List;
import javax.sql.DataSource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
public class StorageServiceTest {

    @Mock
    private StorageRepository storageRepository;

    @Mock
    private BlueprintRepository blueprintRepository;

    @Mock
    private JdbcTemplate jdbcTemplate;

    @Spy
    private StorageMapper storageMapper = Mappers.getMapper(StorageMapper.class);

    @InjectMocks
    private StorageServiceImpl storageService;

    @Mock
    private DataSource dataSource;

    private Storage storage;
    private StorageReqDto storageReqDto;

    @BeforeEach
    void setUp() {
        storage = new Storage("123.123.123.123", 8080, DBMS.MYSQL, "Storage1", "root", "password");
        ReflectionTestUtils.setField(storage, "id", 1L);
        storageReqDto = new StorageReqDto("123.123.123.123", 8080, DBMS.MYSQL, "Storage1", "root", "password");
        jdbcTemplate = mock(JdbcTemplate.class);
    }

    @Test
    @DisplayName("원격 storage 목록 조회")
    void getStorages() {
        // given
        List<Storage> storages = List.of(storage);
        given(storageRepository.findAll()).willReturn(storages);

        // when
        List<StorageResDto> result = storageService.getStorages();

        // then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Storage1", result.get(0).getName());
    }

//    @Test
//    @DisplayName("원격 storage 연결")
//    void connectStorage() {
//        // given
//        given(storageRepository.save(any(Storage.class))).willReturn(storage);
//        given(jdbcTemplate.queryForList("SELECT * FROM goraebab.storage")).willReturn(List.of());
//
//        // when
//        storageService.connectStorage(storageReqDto);
//
//        // then
//        verify(storageRepository, times(1)).save(any(Storage.class));
//    }

//    @Test
//    @DisplayName("원격 storage 복사")
//    void copyStorage() {
//        // given
//        MockedStatic<ConnectionUtil> mockedStatic = Mockito.mockStatic(ConnectionUtil.class);
//        mockedStatic.when(() -> ConnectionUtil.createDataSource(any(Storage.class)))
//            .thenReturn(dataSource);
//        given(storageRepository.findById(anyLong())).willReturn(Optional.of(storage));
//        List<Blueprint> blueprints = List.of(new Blueprint());
//        given(jdbcTemplate.query(anyString(), any(BlueprintRowMapper.class))).willReturn(blueprints);
//
//        // when
//        storageService.copyStorage(1L);
//
//        // then
//        verify(blueprintRepository, times(1)).saveAll(blueprints);
//    }

    @Test
    @DisplayName("원격 storage 삭제")
    void deleteStorage() {
        // when
        storageService.deleteStorage(1L);

        // then
        verify(storageRepository, times(1)).deleteById(1L);
    }

}
