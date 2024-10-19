package api.goraebab.controller;

import static org.mockito.BDDMockito.any;
import static org.mockito.BDDMockito.doThrow;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import api.goraebab.domain.remote.database.controller.StorageController;
import api.goraebab.domain.remote.database.dto.StorageResDto;
import api.goraebab.domain.remote.database.entity.DBMS;
import api.goraebab.domain.remote.database.service.StorageServiceImpl;
import api.goraebab.global.exception.CustomException;
import api.goraebab.global.exception.ErrorCode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(StorageController.class)
public class StorageControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private StorageServiceImpl storageService;

    @Autowired
    private ObjectMapper objectMapper;

    private StorageResDto storageResDto;

    @BeforeEach
    void setUp() {
        storageResDto = new StorageResDto(1L, "123.123.123.123", 8080, DBMS.MYSQL, "Storage1", "root");
    }

    @Test
    @DisplayName("원격 storage 목록 조회")
    void loadStorages()throws Exception {
        given(storageService.getStorages()).willReturn(List.of(storageResDto));

        mockMvc.perform(get("/remote/storages"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].name").value("Storage1"))
                .andDo(print());
    }

    @Test
    @DisplayName("원격 storage 복사")
    void copyStorage() throws Exception {
        mockMvc.perform(post("/remote/storage/{storageId}/copy", 1L))
                .andExpect(status().isOk())
                .andDo(print());
    }

    @Test
    @DisplayName("원격 storage 복사 실패")
    void copyStorage_fail() throws Exception {
        doThrow(new CustomException(ErrorCode.NOT_FOUND_VALUE)).when(storageService).copyStorage(any());

        mockMvc.perform(post("/remote/storage/{storageId}/copy", 111L))
            .andExpect(status().isNotFound())
            .andDo(print());
    }

    @Test
    @DisplayName("원격 storage 삭제")
    void disconnectStorage() throws Exception {
        mockMvc.perform(delete("/remote/storage/{storageId}", 1L))
                .andExpect(status().isOk())
                .andDo(print());
    }

}
