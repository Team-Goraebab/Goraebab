package api.goraebab.domain.remote.database.entity;


import api.goraebab.global.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "storage")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Storage extends BaseEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String host;

  @Column(nullable = false)
  private Integer port;

  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private DBMS dbms;

  @Column(nullable = false)
  private String name;

  @Column(nullable = false)
  private String username;

  @Column(nullable = false)
  private String password;

  @Builder
  public Storage(String host, Integer port, DBMS dbms, String name, String username,
      String password) {
    this.host = host;
    this.port = port;
    this.dbms = dbms;
    this.name = name;
    this.username = username;
    this.password = password;
  }

}

