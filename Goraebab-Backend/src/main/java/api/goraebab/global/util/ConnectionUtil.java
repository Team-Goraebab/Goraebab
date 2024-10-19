package api.goraebab.global.util;

import static api.goraebab.domain.remote.database.entity.DBMS.MYSQL;
import static api.goraebab.domain.remote.database.entity.DBMS.ORACLE;
import static api.goraebab.domain.remote.database.entity.DBMS.POSTGRESQL;
import static api.goraebab.domain.remote.database.entity.DBMS.SQLSERVER;

import api.goraebab.domain.remote.database.dto.StorageReqDto;
import api.goraebab.domain.remote.database.entity.DBMS;
import api.goraebab.domain.remote.database.entity.Storage;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Map;
import java.util.Objects;
import javax.sql.DataSource;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

public class ConnectionUtil {

  private static final RestTemplate restTemplate = new RestTemplate();

  private static final String DOCKER_PING_URL = "http://%s:%d/_ping";
  private static final String DOCKER_OK_RESPONSE_BODY = "OK";
  private static final String HARBOR_PING_URL = "http://%s:%d/api/v2.0/ping";
  private static final String HARBOR_OK_RESPONSE_BODY = "Pong";

  private static final String DEFAULT_DATABASE_NAME = "goraebab";
  private static final Map<DBMS, String> DBMS_DRIVERS = Map.of(
      MYSQL, "com.mysql.cj.jdbc.Driver",
      POSTGRESQL, "org.postgresql.Driver",
      ORACLE, "oracle.jdbc.driver.OracleDriver",
      SQLSERVER, "com.microsoft.sqlserver.jdbc.SQLServerDriver"
  );

  private static final Map<DBMS, String> DBMS_URL_PREFIX = Map.of(
      MYSQL, "jdbc:mysql://",
      POSTGRESQL, "jdbc:postgresql://",
      ORACLE, "jdbc:oracle:thin:@",
      SQLSERVER, "jdbc:sqlserver://"
  );

  public static DataSource createDataSource(StorageReqDto storageReqDto) {
    DriverManagerDataSource dataSource = new DriverManagerDataSource();
    String url = DBMS_URL_PREFIX.get(storageReqDto.getDbms()) +
        storageReqDto.getHost() + ":" + storageReqDto.getPort() + "/" + DEFAULT_DATABASE_NAME;

    dataSource.setDriverClassName(DBMS_DRIVERS.get(storageReqDto.getDbms()));
    dataSource.setUrl(url);
    dataSource.setUsername(storageReqDto.getUsername());
    dataSource.setPassword(storageReqDto.getPassword());

    return dataSource;
  }

  public static DataSource createDataSource(Storage storage) {
    DriverManagerDataSource dataSource = new DriverManagerDataSource();
    String url = DBMS_URL_PREFIX.get(storage.getDbms()) +
        storage.getHost() + ":" + storage.getPort() + "/" + DEFAULT_DATABASE_NAME;

    dataSource.setDriverClassName(DBMS_DRIVERS.get(storage.getDbms()));
    dataSource.setUrl(url);
    dataSource.setUsername(storage.getUsername());
    dataSource.setPassword(storage.getPassword());

    return dataSource;
  }

  public static boolean testDockerPing(String host, int port) {
    String requestUrl = String.format(DOCKER_PING_URL, host, port);
    try {
      String response = restTemplate.getForObject(requestUrl, String.class);
      return Objects.equals(response, DOCKER_OK_RESPONSE_BODY);
    } catch (RestClientException e) {
      return false;
    }
  }

  public static boolean testHarborPing(String host, int port) {
    String requestUrl = String.format(HARBOR_PING_URL, host, port);
    try {
      String response = restTemplate.getForObject(requestUrl, String.class);
      return Objects.equals(response, HARBOR_OK_RESPONSE_BODY);
    } catch (RestClientException e) {
      return false;
    }
  }

  public static void harborLogin(String host, int port, String username, String password) {
    final String[] command = {
        "docker", "login", host + ":" + port,
        "--username=" + username,
        "--password=" + password
    };
    try {
      ProcessBuilder processBuilder = new ProcessBuilder(command);
      processBuilder.redirectErrorStream(true);
      Process process = processBuilder.start();

      try (BufferedReader reader = new BufferedReader(
          new InputStreamReader(process.getInputStream()))) {
        String line;
        while ((line = reader.readLine()) != null) {
          System.out.println(line);
        }
      }

      int exitCode = process.waitFor();
      if (exitCode == 0) {
        System.out.println("Harbor login successful!");
      } else {
        System.out.println("Harbor login failed.");
        throw new RuntimeException("Harbor connection failed");
      }
    } catch (IOException | InterruptedException e) {
      throw new RuntimeException(e);
    }
  }

}
