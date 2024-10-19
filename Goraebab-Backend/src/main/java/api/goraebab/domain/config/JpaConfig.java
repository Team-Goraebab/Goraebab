package api.goraebab.domain.config;

import static api.goraebab.domain.remote.database.entity.DBMS.*;

import api.goraebab.domain.remote.database.entity.DBMS;
import jakarta.annotation.PostConstruct;
import java.util.EnumMap;
import java.util.Map;
import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.orm.jpa.JpaProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@Configuration
@EnableJpaAuditing
public class JpaConfig {

  @Value("${spring.datasource.url}")
  private String datasourceUrl;

  @Value("${spring.datasource.username}")
  private String username;

  @Value("${spring.datasource.password}")
  private String password;

  @Value("${spring.datasource.driver-class-name}")
  private String driverClassName;

  private final JpaProperties jpaProperties;

  private static final String HIBERNATE_DIALECT = "hibernate.dialect";
  private static final String MYSQL_DIALECT = "org.hibernate.dialect.MySQL8Dialect";
  private static final String POSTGRESQL_DIALECT = "org.hibernate.dialect.PostgreSQLDialect";
  private static final String ORACLE_DIALECT = "org.hibernate.dialect.Oracle12cDialect";
  private static final String SQLSERVER_DIALECT = "org.hibernate.dialect.SQLServerDialect";

  private static final EnumMap<DBMS, String> DIALECT_MAP = new EnumMap<>(Map.of(
      MYSQL, MYSQL_DIALECT,
      POSTGRESQL, POSTGRESQL_DIALECT,
      ORACLE, ORACLE_DIALECT,
      SQLSERVER, SQLSERVER_DIALECT
  ));

  public JpaConfig(JpaProperties jpaProperties) {
    this.jpaProperties = jpaProperties;
  }

  @PostConstruct
  public void init() {
    configureJpaDialect();
  }

  private void configureJpaDialect() {
    DBMS datasourceType = getDatasourceType(datasourceUrl);
    String dialect = DIALECT_MAP.get(datasourceType);
    jpaProperties.getProperties().put(HIBERNATE_DIALECT, dialect);
  }

  private DBMS getDatasourceType(String datasourceUrl) {
    return DIALECT_MAP.keySet().stream()
        .filter(dbms -> datasourceUrl.toUpperCase().contains(dbms.name()))
        .findFirst()
        .orElseThrow(() -> new IllegalArgumentException("Unsupported Database Type: " + datasourceUrl));
  }

  @Bean
  public DataSource dataSource() {
    return DataSourceBuilder.create()
        .url(datasourceUrl)
        .username(username)
        .password(password)
        .driverClassName(driverClassName)
        .build();
  }

}
