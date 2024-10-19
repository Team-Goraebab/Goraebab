package api.goraebab.domain.remote.docker.service;

import api.goraebab.domain.remote.docker.dto.DaemonReqDto;
import api.goraebab.domain.remote.docker.dto.DaemonResDto;
import api.goraebab.domain.remote.docker.entity.Daemon;
import api.goraebab.domain.remote.docker.mapper.DaemonMapper;
import api.goraebab.domain.remote.docker.repository.DaemonRepository;
import api.goraebab.global.exception.CustomException;
import api.goraebab.global.exception.ErrorCode;
import api.goraebab.global.util.ConnectionUtil;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DaemonServiceImpl implements DaemonService {

  private final DaemonRepository daemonRepository;

  @Override
  public List<DaemonResDto> getDaemons() {
    try {
      List<Daemon> daemonList = daemonRepository.findAll();
      return DaemonMapper.INSTANCE.entityListToResDtoList(daemonList);
    } catch (Exception e) {
      throw new CustomException(ErrorCode.RETRIEVAL_FAILED);
    }
  }

  @Override
  public void connectDaemon(DaemonReqDto daemonReqDto) {
    boolean connected = ConnectionUtil.testDockerPing(daemonReqDto.getHost(), daemonReqDto.getPort());
    if (connected) {
      Daemon daemon = DaemonMapper.INSTANCE.reqDtoToEntity(daemonReqDto);
      daemonRepository.save(daemon);
    } else {
      throw new CustomException(ErrorCode.CONNECTION_FAILED);
    }
  }

  @Override
  public void deleteDaemon(Long daemonId) {
    try {
      daemonRepository.deleteById(daemonId);
    } catch (Exception e) {
      throw new CustomException(ErrorCode.DELETE_FAILED);
    }
  }

}
