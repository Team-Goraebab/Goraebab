package api.goraebab.domain.remote.database.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import java.util.Arrays;

public enum DBMS {
  MYSQL, POSTGRESQL, ORACLE, SQLSERVER;


  @JsonCreator
  public static DBMS fromDBMS(String val) {
    return Arrays.stream(values())
        .filter(type -> type.toString().equals(val))
        .findAny()
        .orElse(null);
  }

}
