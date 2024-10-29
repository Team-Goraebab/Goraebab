package api.goraebab.global.util;

import static api.goraebab.domain.remote.database.entity.DBMS.MARIADB;
import static api.goraebab.domain.remote.database.entity.DBMS.MYSQL;
import static api.goraebab.domain.remote.database.entity.DBMS.ORACLE;
import static api.goraebab.domain.remote.database.entity.DBMS.POSTGRESQL;
import static api.goraebab.domain.remote.database.entity.DBMS.SQLSERVER;

import api.goraebab.domain.remote.database.dto.StorageReqDto;
import api.goraebab.domain.remote.database.entity.DBMS;
import api.goraebab.domain.remote.database.entity.Storage;
import java.util.Map;
import java.util.Objects;
import javax.sql.DataSource;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

public class ConnectionUtil {

  private static final RestClient restClient = RestClient.create();

  private static final String DOCKER_PING_URL = "http://%s:%d/_ping";
  private static final String DOCKER_OK_RESPONSE_BODY = "OK";

  private static final String DEFAULT_DATABASE_NAME = "goraebab";
  private static final Map<DBMS, String> DBMS_DRIVERS = Map.of(
      MYSQL, "com.mysql.cj.jdbc.Driver",
      MARIADB, "org.mariadb.jdbc.Driver",
      POSTGRESQL, "org.postgresql.Driver",
      ORACLE, "oracle.jdbc.driver.OracleDriver",
      SQLSERVER, "com.microsoft.sqlserver.jdbc.SQLServerDriver"
  );

  private static final Map<DBMS, String> DBMS_URL_PREFIX = Map.of(
      MYSQL, "jdbc:mysql://",
      MARIADB, "jdbc:mariadb://",
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
      String response = restClient.get()
          .uri(requestUrl)
          .retrieve()
          .body(String.class);
      return Objects.equals(response, DOCKER_OK_RESPONSE_BODY);
    } catch (RestClientException e) {
      return false;
    }
  }

}
