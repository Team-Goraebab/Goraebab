package api.goraebab.domain.blueprint.dto;

import lombok.Getter;

import java.util.List;

@Getter
public class ParsedDataDto {

    private List<HostInfoDto> hosts;

    public ParsedDataDto(List<HostInfoDto> hosts) {
        this.hosts = hosts;
    }

}