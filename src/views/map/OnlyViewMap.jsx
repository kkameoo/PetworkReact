import { useEffect, useRef } from "react";
import styled from "styled-components";

const MapBox = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  flex-wrap: wrap;
`;

const MapContainer = styled.div`
  width: 800px;
  height: 400px;
  border: 2px solid grey;
`;

const MapTitle = styled.div`
  width: 800px;
  height: 50px;
  background: white;
  border: 2px solid grey;
  border-radius: 5px 5px 0 0;
  display: flex;
  align-items: center;
  font-size: 25px;
`;

function OnlyViewMap({ mapInfo, setMapInfo }) {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!mapInfo) return;
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
        center: new window.kakao.maps.LatLng(
          mapInfo.latitude,
          mapInfo.longitude
        ),
        level: 3,
      };

      mapInstance.current = new window.kakao.maps.Map(
        mapContainer.current,
        options
      );

      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(
          mapInfo.latitude,
          mapInfo.longitude
        ),
        text: " 약속 장소 ",
      });

      marker.setMap(mapInstance.current);
      mapInstance.current.setDraggable(false);
      mapInstance.current.setZoomable(false);
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
  }, [mapContainer.current, mapInfo]);
  return (
    <MapBox>
      <MapTitle>&nbsp;&nbsp;&nbsp;&nbsp;지정 장소</MapTitle>
      <MapContainer ref={mapContainer}></MapContainer>
    </MapBox>
  );
}
export default OnlyViewMap;
