import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCityCategory } from "../../services/dataService";
import styled from "styled-components";

// Styled Components 정의
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 800px;
`;

const Button = styled.button`
  padding: 10px;
  cursor: pointer;
  border: none;
  background-color: ${(props) => (props.active ? "#f44336" : "#007BFF")};
  color: white;
  border-radius: 5px;
  margin-right: ${(props) => (props.marginRight ? "10px" : "0")};

  &:hover {
    opacity: 0.8;
  }
`;

const ModeText = styled.div`
  font-weight: bold;
  color: ${(props) => (props.modifyMode ? "red" : "black")};
`;

const Content = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  width: 100%;
  max-width: 800px;
`;

const MapContainer = styled.div`
  width: 500px;
  height: 400px;
  border: 1px solid #ddd;
`;

const RegionList = styled.div`
  width: 200px;
  text-align: center;
`;

const RegionItem = styled.li`
  cursor: pointer;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  background: ${(props) => (props.selected ? "#f0f0f0" : "white")};

  &:hover {
    background-color: #e6e6e6;
  }
`;

const LatLngMessage = styled.div`
  margin-top: 10px;
  font-size: 14px;
  color: #333;
`;

const ViewMap = () => {
  const { lat, lng } = useParams();
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const [markerLatitude, setMarkerLatitude] = useState(lat);
  const [markerLongitude, setMarkerLongitude] = useState(lng);
  const [modifyMode, setModifyMode] = useState(false);
  const [latlngMessage, setLatlngMessage] = useState("");
  const [region, setRegion] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getCityCategory()
      .then(setRegion)
      .catch((error) => console.error("Fetching error:", error));

    const loadKakaoMapScript = () => {
      return new Promise((resolve, reject) => {
        if (window.kakao && window.kakao.maps) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src =
          "//dapi.kakao.com/v2/maps/sdk.js?appkey=144d2d61e948e38e61879a857c778d34&autoload=false";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("카카오 맵 API 로드 실패"));
        document.head.appendChild(script);
      });
    };

    const initMap = () => {
      if (!mapContainer.current) return;

      const options = {
        center: new window.kakao.maps.LatLng(markerLatitude, markerLongitude),
        level: 3,
      };

      mapInstance.current = new window.kakao.maps.Map(
        mapContainer.current,
        options
      );

      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(markerLatitude, markerLongitude),
      });

      marker.setMap(mapInstance.current);

      const handleMapClick = (mouseEvent) => {
        const latlng = mouseEvent.latLng;
        marker.setPosition(latlng);
        navigate(`/viewmap/${latlng.getLat()}/${latlng.getLng()}`);
        setMarkerLatitude(latlng.getLat());
        setMarkerLongitude(latlng.getLng());
        setLatlngMessage(
          `클릭한 위치: 위도 ${latlng.getLat()}, 경도 ${latlng.getLng()}`
        );
      };

      if (modifyMode) {
        window.kakao.maps.event.addListener(
          mapInstance.current,
          "click",
          handleMapClick
        );
      } else {
        window.kakao.maps.event.removeListener(
          mapInstance.current,
          "click",
          handleMapClick
        );
      }
    };

    loadKakaoMapScript()
      .then(() => window.kakao.maps.load(initMap))
      .catch((error) => console.error("Kakao Map error:", error));

    return () => {
      const scripts = document.head.getElementsByTagName("script");
      for (let script of scripts) {
        if (script.src.includes("sdk.js")) {
          document.head.removeChild(script);
        }
      }
    };
  }, [modifyMode]);

  const panTo = (data) => {
    setSelectedRegion(data);
    var moveLatLon = new window.kakao.maps.LatLng(
      data.latitude,
      data.longitude
    );
    mapInstance.current.panTo(moveLatLon);
  };

  return (
    <Container>
      <Header>
        <div>
          <Button active onClick={() => setModifyMode(true)} marginRight>
            수정 모드 ON
          </Button>
          <Button onClick={() => setModifyMode(false)}>수정 모드 OFF</Button>
        </div>
        <ModeText modifyMode={modifyMode}>
          {modifyMode ? "수정 모드 활성화" : "일반 모드"}
        </ModeText>
      </Header>

      <Content>
        {/* 지도 영역 */}
        <MapContainer ref={mapContainer}></MapContainer>

        {/* 지역 리스트 */}
        <RegionList>
          <h2>지역 선택</h2>
          <ul style={{ listStyle: "none", padding: "0" }}>
            {region.map((data) => (
              <RegionItem
                key={data.id}
                onClick={() => panTo(data)}
                selected={selectedRegion?.id === data.id}
              >
                {data.name}
              </RegionItem>
            ))}
          </ul>
        </RegionList>
      </Content>

      <LatLngMessage>{latlngMessage}</LatLngMessage>
    </Container>
  );
};

export default ViewMap;
