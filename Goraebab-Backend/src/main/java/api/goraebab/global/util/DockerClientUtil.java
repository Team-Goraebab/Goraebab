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

    public DockerClient createLocalDockerClient() {
        String dockerHost = System.getProperty("os.name").toLowerCase().contains("win")
                ? "tcp://localhost:2375" // Window
                : "unix:///var/run/docker.sock"; // Unix 기반 시스템(Linux, macOS)

        DefaultDockerClientConfig config = DefaultDockerClientConfig.createDefaultConfigBuilder()
                .withDockerHost(dockerHost)
                .withApiVersion(RemoteApiVersion.VERSION_1_43)
                .build();

        DockerHttpClient httpClient = new OkDockerHttpClient.Builder()
                .dockerHost(config.getDockerHost())
                .build();

        return DockerClientBuilder.getInstance(config).withDockerHttpClient(httpClient).build();
    }

    public DockerClient createRemoteDockerClient(String remoteUrl) {
        DefaultDockerClientConfig config = DefaultDockerClientConfig.createDefaultConfigBuilder()
                .withDockerHost(remoteUrl)
                .withApiVersion(RemoteApiVersion.VERSION_1_43)
                .build();

        DockerHttpClient httpClient = new OkDockerHttpClient.Builder()
                .dockerHost(config.getDockerHost())
                .build();

        return DockerClientBuilder.getInstance(config).withDockerHttpClient(httpClient).build();
    }

}
