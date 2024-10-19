package api.goraebab.controller;

import static org.mockito.BDDMockito.any;
import static org.mockito.BDDMockito.anyLong;
import static org.mockito.BDDMockito.doNothing;
import static org.mockito.BDDMockito.doThrow;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import api.goraebab.domain.blueprint.controller.BlueprintController;
import api.goraebab.domain.blueprint.dto.BlueprintReqDto;
import api.goraebab.domain.blueprint.dto.BlueprintResDto;
import api.goraebab.domain.blueprint.dto.BlueprintsResDto;
import api.goraebab.domain.blueprint.service.BlueprintServiceImpl;
import api.goraebab.domain.remote.database.dto.StorageResDto;
import api.goraebab.domain.remote.database.entity.DBMS;
import api.goraebab.global.exception.CustomException;
import api.goraebab.global.exception.ErrorCode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(BlueprintController.class)
public class BlueprintControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @MockBean
  private BlueprintServiceImpl blueprintService;

  @Autowired
  private ObjectMapper objectMapper;

  private Long storageId;
  private Long blueprintId;
  private BlueprintResDto blueprintResDto;
  private BlueprintsResDto blueprintsResDto;
  private BlueprintReqDto blueprintReqDto;

  @BeforeEach
  void setUp() {
    storageId = 1L;
    blueprintId = 1L;
    StorageResDto storageResDto = StorageResDto.builder()
        .storageId(storageId)
        .host("123.123.123.123")
        .port(8080)
        .dbms(DBMS.MYSQL)
        .name("Storage1")
        .username("root")
        .build();
    blueprintResDto = new BlueprintResDto(blueprintId, "Blueprint1", "Data1", false,
        LocalDateTime.now(), LocalDateTime.now(), storageResDto);
    blueprintsResDto = new BlueprintsResDto(blueprintId, "Blueprint1", "Data1", false,
        LocalDateTime.now(), LocalDateTime.now());
    blueprintReqDto = new BlueprintReqDto("Blueprint2", "Data2");
  }

  @Test
  @DisplayName("설계도 전체 목록 조회")
  void getBlueprints() throws Exception {
    List<BlueprintsResDto> blueprints = List.of(blueprintsResDto);
    given(blueprintService.getBlueprints(storageId)).willReturn(blueprints);

    mockMvc.perform(get("/storage/{storageId}/blueprints", storageId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(1))
        .andExpect(jsonPath("$[0].name").value("Blueprint1"))
        .andDo(print());
  }

  @Test
  @DisplayName("설계도 전체 목록 조회 실패")
  void getBlueprints_fail() throws Exception {
    List<BlueprintsResDto> blueprints = List.of(blueprintsResDto);
    doThrow(new CustomException(ErrorCode.NOT_FOUND_VALUE)).when(blueprintService)
        .getBlueprints(anyLong());

    mockMvc.perform(get("/storage/{storageId}/blueprints", storageId))
        .andExpect(status().isNotFound())
        .andDo(print());
  }

  @Test
  @DisplayName("설계도 단건 조회")
  void getBlueprint() throws Exception {
    given(blueprintService.getBlueprint(anyLong(), anyLong())).willReturn(blueprintResDto);

    mockMvc.perform(get("/storage/{storageId}/blueprint/{blueprintId}", storageId, blueprintId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.name").value("Blueprint1"))
        .andDo(print());
  }

  @Test
  @DisplayName("설계도 단건 조회 실패")
  void getBlueprint_fail() throws Exception {
    doThrow(new CustomException(ErrorCode.NOT_FOUND_VALUE)).when(blueprintService)
        .getBlueprint(anyLong(), anyLong());

    mockMvc.perform(get("/storage/{storageId}/blueprint/{blueprintId}", storageId, blueprintId))
        .andExpect(status().isNotFound())
        .andDo(print());
  }

  @Test
  @DisplayName("설계도 저장")
  void saveBlueprint() throws Exception {
    doNothing().when(blueprintService).saveBlueprint(anyLong(), any());

    mockMvc.perform(post("/storage/{storageId}/blueprint", storageId)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(blueprintReqDto)))
        .andExpect(status().isOk())
        .andDo(print());
  }

  @Test
  @DisplayName("설계도 저장 실패")
  void saveBlueprint_fail() throws Exception {
    doThrow(new CustomException(ErrorCode.NOT_FOUND_VALUE)).when(blueprintService)
        .saveBlueprint(anyLong(), any());

    mockMvc.perform(post("/storage/{storageId}/blueprint", storageId)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(blueprintReqDto)))
        .andExpect(status().isNotFound())
        .andDo(print());
  }

  @Test
  @DisplayName("설계도 수정")
  void modifyBlueprint() throws Exception {
    mockMvc.perform(patch("/storage/{storageId}/blueprint/{blueprintId}", storageId, blueprintId)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(blueprintReqDto)))
        .andExpect(status().isOk())
        .andDo(print());
  }

  @Test
  @DisplayName("설계도 수정 실패")
  void modifyBlueprint_fail() throws Exception {
    doThrow(new CustomException(ErrorCode.NOT_FOUND_VALUE)).when(blueprintService)
        .modifyBlueprint(anyLong(), anyLong(), any());

    mockMvc.perform(patch("/storage/{storageId}/blueprint/{blueprintId}", storageId, blueprintId)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(blueprintReqDto)))
        .andExpect(status().isNotFound())
        .andDo(print());
  }

  @Test
  @DisplayName("설계도 삭제")
  void deleteBlueprint() throws Exception {
    mockMvc.perform(delete("/storage/{storageId}/blueprint/{blueprintId}", storageId, blueprintId))
        .andExpect(status().isOk())
        .andDo(print());
  }

  @Test
  @DisplayName("설계도 삭제 실패")
  void deleteBlueprint_fail() throws Exception {
    doThrow(new CustomException(ErrorCode.NOT_FOUND_VALUE)).when(blueprintService)
        .getBlueprint(anyLong(), anyLong());

    mockMvc.perform(delete("/storage/{storageId}/blueprint/{blueprintId}", storageId, blueprintId))
        .andExpect(status().isOk())
        .andDo(print());
  }

}
