package api.goraebab.domain.remote.database.mapper;

import api.goraebab.domain.remote.database.dto.StorageReqDto;
import api.goraebab.domain.remote.database.dto.StorageResDto;
import api.goraebab.domain.remote.database.entity.Storage;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface StorageMapper {

  StorageMapper INSTANCE = Mappers.getMapper(StorageMapper.class);

  Storage reqDtoToEntity(StorageReqDto storageReqDto);

  @Mapping(source = "id", target = "storageId")
  StorageResDto entityToResDto(Storage storage);

  List<StorageResDto> entityListToResDtoList(List<Storage> storageList);

}
