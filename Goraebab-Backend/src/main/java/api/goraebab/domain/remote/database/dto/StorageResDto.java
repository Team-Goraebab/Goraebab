package api.goraebab.domain.remote.database.dto;

import api.goraebab.domain.remote.database.entity.DBMS;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Schema(description = "Represents the storage info.")
public class StorageResDto {

  @Schema(description = "The unique identifier of the storage.", example = "1")
  private Long storageId;

  @Schema(description = "The host address of the storage.", example = "255.255.255.255")
  private String host;

  @Schema(description = "The port number used to connect to the storage.", example = "3306")
  private Integer port;

  @Schema(description = "The type of DBMS. Choose one from [MYSQL, POSTGRESQL, ORACLE, or SQLSERVER]."
      , example = "MYSQL")
  private DBMS dbms;

  @Schema(description = "The name of the storage.", example = "Gorae's DB")
  private String name;

  @Schema(description = "The username used to connect to DBMS.", example = "root")
  private String username;


  @Builder
  public StorageResDto(Long storageId, String host, Integer port, DBMS dbms, String name,
      String username) {
    this.storageId = storageId;
    this.host = host;
    this.port = port;
    this.dbms = dbms;
    this.name = name;
    this.username = username;
  }

}
