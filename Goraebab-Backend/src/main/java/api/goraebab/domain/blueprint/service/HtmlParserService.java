package api.goraebab.domain.blueprint.service;

import api.goraebab.domain.blueprint.dto.ParsedDataDto;

public interface HtmlParserService {

    ParsedDataDto parseHtml(String htmlContent);

}