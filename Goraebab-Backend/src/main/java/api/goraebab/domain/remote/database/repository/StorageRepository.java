package api.goraebab.domain.remote.database.repository;

import api.goraebab.domain.remote.database.entity.Storage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StorageRepository extends JpaRepository<Storage, Long> {

}
