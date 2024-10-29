package api.goraebab.global.util;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.core.DefaultDockerClientConfig;
import com.github.dockerjava.core.DockerClientBuilder;
import com.github.dockerjava.core.RemoteApiVersion;
import com.github.dockerjava.okhttp.OkDockerHttpClient;
import com.github.dockerjava.transport.DockerHttpClient;
import org.springframework.stereotype.Component;

@Component
public class DockerClientUtil {

    private static final String LOCAL_DOCKER_URL = "host.docker.internal";
    private static final String DOCKER_HOST_FORMAT = "tcp://%s:2375";

    public DockerClient createLocalDockerClient() {
        String localHost = String.format(DOCKER_HOST_FORMAT, LOCAL_DOCKER_URL);
        DefaultDockerClientConfig config = DefaultDockerClientConfig.createDefaultConfigBuilder()
                .withDockerHost(localHost)
                .withApiVersion(RemoteApiVersion.VERSION_1_43)
                .build();

        DockerHttpClient httpClient = new OkDockerHttpClient.Builder()
                .dockerHost(config.getDockerHost())
                .build();

        return DockerClientBuilder.getInstance(config).withDockerHttpClient(httpClient).build();
    }

    public DockerClient createRemoteDockerClient(String remoteUrl) {
        String remoteHost = String.format(DOCKER_HOST_FORMAT, remoteUrl);
        DefaultDockerClientConfig config = DefaultDockerClientConfig.createDefaultConfigBuilder()
                .withDockerHost(remoteHost)
                .withApiVersion(RemoteApiVersion.VERSION_1_43)
                .build();

        DockerHttpClient httpClient = new OkDockerHttpClient.Builder()
                .dockerHost(config.getDockerHost())
                .build();

        return DockerClientBuilder.getInstance(config).withDockerHttpClient(httpClient).build();
    }

}
