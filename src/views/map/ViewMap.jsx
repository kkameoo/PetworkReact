import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getLocalCategory } from "../../services/dataService";
import styled from "styled-components";
import { useAuth } from "../../hooks/useAuth";

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
  max-width: 1500px;
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
  font-size: 30px;
  font-weight: bold;
  color: ${(props) => (props.modifyMode ? "red" : "black")};
`;

const Content = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  width: 100%;
  max-width: 1500px;
`;

const MapContainer = styled.div`
  width: 1500px;
  height: 700px;
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

const ViewMap = () => {
  const { user } = useAuth();
  const { postId, lat, lng } = useParams();
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const [markerLatitude, setMarkerLatitude] = useState(Number(lat));
  const [markerLongitude, setMarkerLongitude] = useState(Number(lng));
  const [modifyMode, setModifyMode] = useState(false);
  const [region, setRegion] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [newPost, setNewPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getLocalCategory()
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
        // navigate(`/viewmap/${postId}/${latlng.getLat()}/${latlng.getLng()}`);
        setMarkerLatitude(latlng.getLat());
        setMarkerLongitude(latlng.getLng());
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

  useEffect(() => {
    fetchPostDetail();
  }, [postId]);

  const fetchPostDetail = async () => {
    try {
      const response = await fetch(`http://localhost:8087/api/board/${postId}`);
      const data = await response.json();

      const postData = {
        id: data.boardId,
        sellerUid: data.userId,
        regionSi: data.localSi,
        regionGu: data.localGu,
        title: data.title,
        content: data.content,
        type: data.boardType,
        clickCnt: data.clickCount,
        reportCnt: data.reportCount,
        updateTime: new Date(data.update).toLocaleString(),
      };
      console.log("Data", postData);
      setNewPost(postData);
    } catch (error) {
      console.error("상세 데이터 불러오기 오류:", error);
    }
  };

  const updateMap = async () => {
    const updatedData = {
      latitude: markerLatitude,
      longitude: markerLongitude,
      boardId: postId,
    };
    try {
      const response = await fetch(`http://localhost:8087/api/map/${postId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (response.ok) {
        alert("좌표가 수정되었습니다.");
      } else {
        alert("수정 실패. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("수정 오류:", error);
    }
  };

  const panTo = (data) => {
    setSelectedRegion(data);
    var moveLatLon = new window.kakao.maps.LatLng(
      data.latitude,
      data.longitude
    );
    mapInstance.current.panTo(moveLatLon);
  };

  const saveRegion = () => {
    updateMap();
    navigate(`/viewmap/${postId}/${markerLatitude}/${markerLongitude}`);
  };

  const cancelRegion = () => {
    setMarkerLatitude(Number(lat));
    setMarkerLongitude(Number(lng));
  };

  const handleBack = () => {
    if (newPost.type == 1) {
      navigate(`/${postId}`);
    } else if (newPost.type == 2) {
      navigate(`/trade/${postId}`);
    } else if (newPost.type == 3) {
      navigate(`/hire/${postId}`);
    }
  };

  let context = null;

  if (newPost?.sellerUid == user?.userId) {
    context = (
      <Header>
        <div>
          {modifyMode ? (
            <>
              <Button
                active
                onClick={() => {
                  setModifyMode((prev) => !prev);
                  saveRegion();
                }}
                marginRight
              >
                저장하기
              </Button>
              <Button
                active={false}
                onClick={() => {
                  setModifyMode((prev) => !prev);
                  cancelRegion();
                }}
                marginRight
              >
                취소하기
              </Button>
            </>
          ) : (
            <Button
              active
              onClick={() => setModifyMode((prev) => !prev)}
              marginRight
            >
              수정하기
            </Button>
          )}
          <Button
            active={false}
            onClick={() => {
              handleBack();
            }}
            marginRight
          >
            뒤로가기
          </Button>
        </div>
        <ModeText modifyMode={modifyMode}>
          {modifyMode ? "수정중 ...." : ""}
        </ModeText>
      </Header>
    );
  }

  return (
    <Container>
      {context}

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
    </Container>
  );
};

export default ViewMap;
