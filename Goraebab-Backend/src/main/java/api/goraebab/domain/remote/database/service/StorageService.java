package api.goraebab.domain.remote.database.service;

import api.goraebab.domain.remote.database.dto.StorageReqDto;
import api.goraebab.domain.remote.database.dto.StorageResDto;
import java.util.List;

public interface StorageService {

  List<StorageResDto> getStorages();

  void connectStorage(StorageReqDto storageReqDto);

  void deleteStorage(Long storageId);

  void copyStorage(Long storageId);

}
