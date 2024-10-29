package api.goraebab.domain.blueprint.service;

import static api.goraebab.global.util.ConnectionUtil.testDockerPing;

import api.goraebab.domain.blueprint.dockerObject.CustomConfig;
import api.goraebab.domain.blueprint.dockerObject.CustomContainer;
import api.goraebab.domain.blueprint.dockerObject.CustomHost;
import api.goraebab.domain.blueprint.dockerObject.CustomNetwork;
import api.goraebab.domain.blueprint.dockerObject.CustomVolume;
import api.goraebab.domain.blueprint.dockerObject.ProcessedData;
import api.goraebab.global.exception.CustomException;
import api.goraebab.global.exception.ErrorCode;
import api.goraebab.global.util.DockerClientUtil;
import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.command.CreateContainerResponse;
import com.github.dockerjava.api.command.InspectContainerResponse;
import com.github.dockerjava.api.command.InspectVolumeResponse;
import com.github.dockerjava.api.exception.DockerException;
import com.github.dockerjava.api.exception.NotFoundException;
import com.github.dockerjava.api.model.*;
import com.github.dockerjava.api.model.Network.Ipam;
import com.github.dockerjava.api.model.Network.Ipam.Config;

import java.util.*;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class DockerSyncServiceImpl implements DockerSyncService {

    private final DockerClientUtil dockerClientFactory;

    private static final String LOCAL_HOST_IP = "host.docker.internal";
    private static final int DOCKER_DAEMON_PORT = 2375;
    public static final Set<String> EXCLUDED_CONTAINER_NAME = new HashSet<>(
        Arrays.asList("/goraebab_spring", "/goraebab_mysql", "/goraebab_mariadb",
            "/goraebab_postgresql", "/goraebab_oracle"));
    private static final Set<String> EXCLUDED_NETWORK_SET = new HashSet<>(
        Arrays.asList("bridge", "host", "none", "goraebab_network"));
    private static final String MOUNT_BIND_TYPE = "bind";
    private static final String MOUNT_VOLUME_TYPE = "volume";
    private static final String CONTAINER_RUNNING_STATE = "running";


    @Override
    public void syncDockerWithBlueprintData(ProcessedData processedData) {

        try {
            // 1. host list 추출
            DockerClient dockerClient;
            List<CustomHost> customHosts = processedData.getCustomHost();

            for (CustomHost customHost : customHosts) {
                //    2. local, remote 연결 시도(`/_ping`), 확인
                if (customHost.getIsLocal()) {
                    testDockerPing(LOCAL_HOST_IP, DOCKER_DAEMON_PORT);
                    dockerClient = dockerClientFactory.createLocalDockerClient();
                } else {
                    testDockerPing(customHost.getIp(), DOCKER_DAEMON_PORT);
                    dockerClient = dockerClientFactory.createRemoteDockerClient(customHost.getIp());
                }

                // 3. default로 생성되는것들은 제외하고 local, remote의 모든 network, container, volume 삭제
                //  network - `none` , `bridge`, `customHost` , `goraebab_network`
                //  container - `goraebab-backend`
                removeAllContainers(dockerClient);
                removeAllNetworks(dockerClient);
                removeAllVolumes(dockerClient);

                // 4. network list 추출
                // default network`인지 확인하고 만약 아니라면 생성
                syncNetworks(dockerClient, customHost.getCustomNetwork());

                // 5. volume list 추출
                // volume 생성
                syncVolumes(dockerClient, customHost.getCustomVolume());

                // 6. container list 추출
                // 필요한 image를 확인하고 만약 image를 가지고 있지 않다면 image pull
                // 타겟 네트워크에 container 실행
                syncContainers(dockerClient, customHost.getCustomNetwork());

                log.debug(dockerClient.toString());
            }
        } catch (DockerException e) {
            throw new CustomException(ErrorCode.DOCKER_SYNC_FAILED, e);
        } catch (InterruptedException e) {
          throw new CustomException(ErrorCode.CONTAINER_SYNC_FAILED, e);
        }
    }

    private void syncNetworks(DockerClient dockerClient, List<CustomNetwork> customNetworkList) throws DockerException {

        List<Network> existingNetworks = dockerClient.listNetworksCmd().exec();

        for (CustomNetwork customNetwork : customNetworkList) {
            String customNetworkName = customNetwork.getName();
            boolean networkExists = existingNetworks.stream()
                .anyMatch(existingNetwork -> existingNetwork.getName().equals(customNetworkName));

            // default network 가 아닐 시 생성
            if (!networkExists) {
                List<Config> ipamConfigList = new ArrayList<>();

                for (CustomConfig config : customNetwork.getCustomIpam().getCustomConfig()) {
                    Config ipamConfig = new Config();
                    ipamConfig.withSubnet(config.getSubnet());
                    ipamConfigList.add(ipamConfig);
                }

                dockerClient.createNetworkCmd()
                    .withName(customNetworkName)
                    .withDriver(customNetwork.getDriver())
                    .withIpam(new Ipam().withConfig(ipamConfigList))
                    .exec();
            }
        }

    }

    private void syncVolumes(DockerClient dockerClient, List<CustomVolume> customVolumeList) throws DockerException {

        List<InspectVolumeResponse> existingVolumes = dockerClient.listVolumesCmd().exec().getVolumes();

        for (CustomVolume customVolume : customVolumeList) {
            String volumeName = customVolume.getName();

            // 볼륨이 이미 존재하는지 확인
            boolean volumeExists = existingVolumes.stream()
                .anyMatch(existingVolume -> existingVolume.getName().equals(volumeName));

            if (!volumeExists) {
                dockerClient.createVolumeCmd()
                    .withName(volumeName)
                    .withDriver(customVolume.getDriver())
                    .exec();
            }
        }

    }

    private void syncContainers(DockerClient dockerClient, List<CustomNetwork> customNetworkList)
        throws DockerException, InterruptedException {
        for (CustomNetwork customNetwork : customNetworkList) {
            for (CustomContainer customContainer : customNetwork.getCustomContainers()) {
                String containerName = customContainer.getContainerName();
                String imageName = customContainer.getCustomImage().getName();
                String tag = customContainer.getCustomImage().getTag();

                // 이미지가 존재하는지 확인
                try {
                    dockerClient.inspectImageCmd(imageName).exec();
                } catch (NotFoundException e) {
                    // 이미지가 없으면 pull
                    dockerClient.pullImageCmd(imageName).withTag(tag).start().awaitCompletion();
                }

                // 포트 바인딩 설정
                List<PortBinding> portBindings = customContainer.getCustomPorts().stream()
                    .map(customPort -> PortBinding.parse(customPort.getPublicPort() + ":" + customPort.getPrivatePort()))
                    .collect(Collectors.toList());

                // 마운트 설정
                List<Bind> binds = new ArrayList<>();
                List<Mount> mounts = new ArrayList<>();

                customContainer.getCustomMounts().forEach(customMount -> {
                    if (MOUNT_BIND_TYPE.equals(customMount.getType())) {
                        binds.add(new Bind(customMount.getSource(),
                                new Volume(customMount.getDestination())));
                    } else if (MOUNT_VOLUME_TYPE.equals(customMount.getType())) {
                        Mount mount = new Mount()
                            .withType(MountType.VOLUME)
                            .withSource(customMount.getName())
                            .withTarget(customMount.getDestination())
                            .withReadOnly("ro".equals(customMount.getMode()));

                        mounts.add(mount);
                    }
                });

                // 포트 바인딩 및 볼륨 바인딩 설정
                HostConfig hostConfig = HostConfig.newHostConfig()
                        .withPortBindings(portBindings)
                        .withBinds(binds)
                        .withMounts(mounts);

                // 컨테이너 생성
                CreateContainerResponse containerResponse = dockerClient.createContainerCmd(imageName)
                        .withName(containerName)
                        .withHostConfig(hostConfig)
                        .withEnv(customContainer.getCustomEnv())
                        .withCmd(customContainer.getCustomCmd())
                        .withNetworkMode(customNetwork.getName())
                        .exec();

                dockerClient.startContainerCmd(containerResponse.getId()).exec();
            }
        }

    }
    
    private void removeAllContainers(DockerClient dockerClient) throws DockerException{
        List<Container> containerList = dockerClient.listContainersCmd().withShowAll(true).exec();

        for (Container container : containerList) {
            String[] containerNames = container.getNames();
            boolean isContain = false;

            for (String name : containerNames) {
              if (EXCLUDED_CONTAINER_NAME.contains(name)) {
                isContain = true;
                break;
              }
            }

            if (!isContain) {
                if (container.getState().equals(CONTAINER_RUNNING_STATE)) {
                    dockerClient.stopContainerCmd(container.getId()).exec();
                }
                dockerClient.removeContainerCmd(container.getId()).exec();
            }
        }
    }

    private void removeAllNetworks(DockerClient dockerClient) throws DockerException{
        List<Network> networkList = dockerClient.listNetworksCmd().exec();

        for (Network network : networkList) {
            String networkName = network.getName();
            if (!EXCLUDED_NETWORK_SET.contains(networkName)) {
                dockerClient.removeNetworkCmd(network.getId()).exec();
            }
        }
    }

    private void removeAllVolumes(DockerClient dockerClient) throws DockerException{
        List<InspectVolumeResponse> volumeList = dockerClient.listVolumesCmd().exec().getVolumes();

        // 사용중인 볼륨 목록 가져오기 (컨테이너 -> 볼륨)
        List<Container> runningContainers = dockerClient.listContainersCmd().exec();
        Set<String> usedVolumes = runningContainers.stream()
            .map(Container::getId)
            .flatMap(containerId -> {
                InspectContainerResponse containerInfo = dockerClient.inspectContainerCmd(containerId).exec();
                return Objects.requireNonNull(containerInfo.getMounts()).stream()
                    .map(InspectContainerResponse.Mount::getName);
            })
            .collect(Collectors.toSet());

        // 사용중이지 않은 볼륨 삭제
        for (InspectVolumeResponse volume : volumeList) {
            String volumeName = volume.getName();
            if (!usedVolumes.contains(volumeName)) {
                dockerClient.removeVolumeCmd(volumeName).exec();
            }
        }
    }

}