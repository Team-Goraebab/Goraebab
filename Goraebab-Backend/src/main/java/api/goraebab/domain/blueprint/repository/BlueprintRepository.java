package api.goraebab.domain.blueprint.repository;

import api.goraebab.domain.blueprint.entity.Blueprint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlueprintRepository extends JpaRepository<Blueprint, Long> {

    List<Blueprint> findByStorageId(Long storageId);

    Blueprint findByStorageIdAndId(Long storageId, Long blueprintId);

}