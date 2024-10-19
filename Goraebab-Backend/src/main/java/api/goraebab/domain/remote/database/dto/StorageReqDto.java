package api.goraebab.domain.remote.database.dto;

import api.goraebab.domain.remote.database.entity.DBMS;
import api.goraebab.global.util.validator.ValidEnum;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class StorageReqDto {

  private static final String USERNAME_REGEX = "^[a-zA-Z0-9_]{1,32}$";
  private static final String PASSWORD_REGEX = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%^&*()_+])[A-Za-z\\d!@#$%^&*()_+]{8,128}$";

  @NotBlank
  @Size(max = 255, message = "Host must be less than 255 characters")
  @Schema(description = "The host address of the storage.", example = "255.255.255.255")
  private String host;

  @NotNull
  @Positive
  @Max(value = 65535, message = "Port must be 1 ~ 65535")
  @Schema(description = "The port number used to connect to the storage.", example = "3306")
  private Integer port;

  @ValidEnum(target = DBMS.class)
  @Schema(description = "The type of DBMS. Choose one from [MYSQL, POSTGRESQL, ORACLE, or SQLSERVER]."
  ,example = "MYSQL")
  private DBMS dbms;

  @NotBlank
  @Size(max = 255, message = "Name must be less than 255 characters")
  @Schema(description = "The name of the storage.", example = "Gorae's DB")
  private String name;

  @NotBlank
  @Pattern(regexp = USERNAME_REGEX,
      message = "Username must be 1-32 characters long and can only contain letters, numbers, and underscores")
  @Schema(description = "The username used to connect to DBMS.", example = "root")
  private String username;

  @NotBlank
  @Pattern(regexp = PASSWORD_REGEX,
      message = "Password must be 8-128 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.")
  @Schema(description = "The password used to connect to DBMS.", example = "root")
  private String password;


  @Builder
  public StorageReqDto(String host, Integer port, DBMS dbms, String name, String username,
      String password) {
    this.host = host;
    this.port = port;
    this.dbms = dbms;
    this.name = name;
    this.username = username;
    this.password = password;
  }

}
