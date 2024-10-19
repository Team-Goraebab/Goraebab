package api.goraebab.domain.blueprint.service;

import api.goraebab.domain.blueprint.dto.BridgeInfoDto;
import api.goraebab.domain.blueprint.dto.ContainerInfoDto;
import api.goraebab.domain.blueprint.dto.HostInfoDto;
import api.goraebab.domain.blueprint.dto.ParsedDataDto;
import lombok.RequiredArgsConstructor;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HtmlParserServiceImpl implements HtmlParserService {

    // 컨테이너 상태에 대한 상수
    public static final String CONTAINER_STATUS_RUNNING = "Running";
    public static final String CONTAINER_STATUS_STOPPED = "Stopped";
    public static final String CONTAINER_STATUS_UNKNOWN = "Unknown";

    // CSS 선택자에 대한 상수
    public static final String HOST_SELECTOR = ".flex.flex-col.items-center.react-draggable";
    public static final String HOST_NAME_SELECTOR = ".flex.items-center.justify-center.w-full.space-x-2 .text-sm.font-semibold";
    public static final String HOST_IP_SELECTOR = ".text-lg.font-semibold";
    public static final String HOST_TYPE_SELECTOR = ".absolute.text-xs.font-semibold";
    public static final String BRIDGE_SELECTOR = ".flex.flex-col.items-center.border.bg-white.rounded-lg";
    public static final String BRIDGE_INFO_SELECTOR = ".w-full.text-center.text-blue_2";
    public static final String CONTAINER_SELECTOR = ".flex.justify-between.items-center.p-2.mb-2";
    public static final String CONTAINER_INFO_SELECTOR = "span";
    public static final String CONTAINER_IMAGE_SELECTOR = "span.text-transparent";
    public static final String CONTAINER_VOLUMES_SELECTOR = "p.text-transparent";

    @Override
    public ParsedDataDto parseHtml(String htmlContent) {
        Document document = Jsoup.parse(htmlContent);

        // Host 정보 추출
        List<HostInfoDto> hosts = new ArrayList<>();
        Elements hostElements = document.select(HOST_SELECTOR);

        for(Element hostElement : hostElements) {
            String hostName = hostElement.selectFirst(HOST_NAME_SELECTOR).text();
            String hostIpAddress = hostElement.selectFirst(HOST_IP_SELECTOR).text();

            Element hostTypeElement = hostElement.selectFirst(HOST_TYPE_SELECTOR);
            String hostType = hostTypeElement != null ? hostTypeElement.text() : "";

            // Bridge 정보 추출
            List<BridgeInfoDto> bridges = new ArrayList<>();
            Elements bridgeElements = hostElement.select(BRIDGE_SELECTOR);

            for(Element bridgeElement : bridgeElements) {
                Element bridgeInfoElement = bridgeElement.selectFirst(BRIDGE_INFO_SELECTOR);
                String bridgeInfo = bridgeInfoElement != null ? bridgeInfoElement.text() : "";
                BridgeInfoDto bridgeInfoDto = extractBridgeInfo(bridgeInfo);

                if (bridgeInfoDto.isValid()) {
                    // Container 정보 추출
                    List<ContainerInfoDto> containers = new ArrayList<>();
                    Elements containerElements = bridgeElement.select(CONTAINER_SELECTOR);

                    for (Element containerElement : containerElements) {
                        String containerName = containerElement.selectFirst(CONTAINER_INFO_SELECTOR).text();
                        String containerIpAddress = containerElement.select(CONTAINER_INFO_SELECTOR).get(1).text();

                        String containerStatus = CONTAINER_STATUS_UNKNOWN;
                        Elements statusElements = containerElement.select(CONTAINER_INFO_SELECTOR);

                        for (Element statusElement : statusElements) {
                            if (statusElement.text().equals(CONTAINER_STATUS_RUNNING)) {
                                containerStatus = CONTAINER_STATUS_RUNNING;
                                break;
                            } else if (statusElement.text().equals(CONTAINER_STATUS_STOPPED)) {
                                containerStatus = CONTAINER_STATUS_STOPPED;
                                break;
                            }
                        }

                        String image = containerElement.select(CONTAINER_IMAGE_SELECTOR).get(0).text();

                        List<String> volumes = new ArrayList<>();
                        Elements volumeElements = containerElement.select(CONTAINER_VOLUMES_SELECTOR);
                        for (Element volumeElement : volumeElements) {
                            volumes.add(volumeElement.text());
                        }

                        containers.add(new ContainerInfoDto(containerName, containerIpAddress, containerStatus, image, volumes));
                    }

                    bridgeInfoDto.setContainers(containers);
                    bridges.add(bridgeInfoDto);
                }
            }

            hosts.add(new HostInfoDto(hostName, hostIpAddress, hostType, bridges));
        }

        return new ParsedDataDto(hosts);
    }

    private BridgeInfoDto extractBridgeInfo(String bridgeInfo) {
        String[] parts = bridgeInfo.split(":");

        if (parts.length == 2) {
            String bridgeName = parts[0].trim();
            String bridgeGateway = parts[1].trim();

            return new BridgeInfoDto(bridgeName, bridgeGateway);
        }
        return new BridgeInfoDto("", "");
    }

}