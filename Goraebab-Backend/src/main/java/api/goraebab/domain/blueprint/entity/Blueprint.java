package api.goraebab.domain.blueprint.entity;

import api.goraebab.domain.remote.database.entity.Storage;
import api.goraebab.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Entity
@Table(name = "blueprint")
@NoArgsConstructor
public class Blueprint extends BaseEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String name;

  @Column(nullable = false, columnDefinition = "json")
  private String data;

  @Column
  private Boolean isRemote = false;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "storage_id")
  private Storage storage;

  public void setStorage(Storage storage) {
    this.storage = storage;
  }

  public void setAsRemote() {
    this.isRemote = true;
  }

  public void modify(String name, String data) {
    if (name != null) {
      this.name = name;
    }
    if (data != null) {
      this.data = data;
    }
  }

  @Builder
  public Blueprint(String name, String data, Boolean isRemote, Storage storage) {
    this.name = name;
    this.data = data;
    this.isRemote = isRemote;
    this.storage = storage;
  }
}
