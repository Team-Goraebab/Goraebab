package api.goraebab.domain.blueprint.dto;

import api.goraebab.domain.remote.database.dto.StorageResDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class BlueprintResDto extends BlueprintsResDto {

    private StorageResDto storageInfo;

    public BlueprintResDto(Long blueprintId, String name, String data, Boolean isRemote, LocalDateTime dateCreated, LocalDateTime dateUpdated, StorageResDto storageInfo) {
        super(blueprintId, name, data, isRemote, dateCreated, dateUpdated);
        this.storageInfo = storageInfo;
    }

}
