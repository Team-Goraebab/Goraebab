package api.goraebab.domain.blueprint.mapper;

import api.goraebab.domain.blueprint.entity.Blueprint;
import java.sql.ResultSet;
import java.sql.SQLException;
import org.springframework.jdbc.core.RowMapper;

public class BlueprintRowMapper implements RowMapper<Blueprint> {

  private static final String BLUEPRINT_DATA_COLUMN_NAME = "data";

  @Override
  public Blueprint mapRow(ResultSet rs, int rowNum) throws SQLException {
    Blueprint blueprint = Blueprint.builder()
        .data(rs.getString(BLUEPRINT_DATA_COLUMN_NAME))
        .build();

    return blueprint;
  }

}
