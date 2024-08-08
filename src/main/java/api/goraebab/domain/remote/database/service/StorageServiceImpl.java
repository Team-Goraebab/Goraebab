package api.goraebab.domain.remote.database.service;

import api.goraebab.domain.blueprint.entity.Blueprint;
import api.goraebab.domain.blueprint.mapper.BlueprintRowMapper;
import api.goraebab.domain.blueprint.repository.BlueprintRepository;
import api.goraebab.domain.remote.database.dto.StorageReqDto;
import api.goraebab.domain.remote.database.dto.StorageResDto;
import api.goraebab.domain.remote.database.entity.Storage;
import api.goraebab.domain.remote.database.mapper.StorageMapper;
import api.goraebab.domain.remote.database.repository.StorageRepository;
import api.goraebab.global.util.ConnectionUtil;
import java.util.List;
import javax.sql.DataSource;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.webjars.NotFoundException;

@Service
@RequiredArgsConstructor
public class StorageServiceImpl implements StorageService {

  private final StorageRepository storageRepository;
  private final BlueprintRepository blueprintRepository;

  private static final String SELECT_ALL_STORAGES = "SELECT * FROM goraebab.storage";
  private static final String SELECT_ALL_BLUEPRINTS = "SELECT * FROM goraebab.blueprint";

  @Override
  @Transactional(readOnly = true)
  public List<StorageResDto> getStorages() {
    List<Storage> storageList = storageRepository.findAll();
    return StorageMapper.INSTANCE.entityListToResDtoList(storageList);
  }

  @Override
  @Transactional
  public void connectStorage(StorageReqDto storageReqDto) {
    DataSource dataSource = ConnectionUtil.createDataSource(storageReqDto);
    JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
    jdbcTemplate.queryForList(SELECT_ALL_STORAGES);

    Storage storage = StorageMapper.INSTANCE.reqDtoToEntity(storageReqDto);
    storageRepository.save(storage);
  }

  @Override
  @Transactional
  public void deleteStorage(Long storageId) {
    storageRepository.deleteById(storageId);
  }

  @Override
  @Transactional
  public void copyStorage(Long storageId) {
    Storage storage = storageRepository.findById(storageId)
        .orElseThrow(() -> new NotFoundException("Storage not found"));

    DataSource dataSource = ConnectionUtil.createDataSource(storage);
    JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
    List<Blueprint> copiedData = jdbcTemplate.query(SELECT_ALL_BLUEPRINTS,
        new BlueprintRowMapper());

    copiedData.forEach(Blueprint::setAsRemote);

    blueprintRepository.saveAll(copiedData);
  }

}
