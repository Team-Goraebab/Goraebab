package api.goraebab.domain.remote.docker.repository;

import api.goraebab.domain.remote.docker.entity.Daemon;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DaemonRepository extends JpaRepository<Daemon, Long> {
}
