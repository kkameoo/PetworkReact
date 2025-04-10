import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import styled from "styled-components";
import { getLocalCategory, getWalkCategory } from "../../services/dataService";
import Report from "../report/Report";
import OnlyViewMap from "../map/OnlyViewMap";
import styled, { keyframes } from "styled-components";

const fadeZoom = keyframes`
  0% {
    opacity: 0;
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

const ImageSliderWrapper = styled.div`
  position: relative;
  width: 750px;
  height: 750px;
  overflow: hidden;
  border-radius: 25px;
  margin-bottom: 30px;
`;

const SlideImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  z-index: 1;
  transition: opacity 0.5s ease-in-out;

  &.active {
    opacity: 1;
    z-index: 2;
    animation: ${fadeZoom} 0.5s ease-in-out;
  }
`;

const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.4);
  color: white;
  border: none;
  padding: 10px;
  font-size: 18px;
  cursor: pointer;
  z-index: 3;
  border-radius: 50%;

  &.left {
    left: 10px;
  }

  &.right {
    right: 10px;
  }
`;
const ImageCounter = styled.div`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 14px;
  z-index: 4;
`;

const DetailWrapper = styled.div`
  width: 1600px;
  margin-left: 100px;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
`;

const ProductBody = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ProductLeft = styled.div`
  width: 45%;
  margin-right: 20px;
  position: relative;
`;

const ProductImage = styled.img`
  border: 1px solid rgb(207, 207, 207);
  border-radius: 25px;
  width: 500px;
  height: auto;
  margin-bottom: 30px;
`;

const SellerInfo = styled.div`
  font-family: "Ownglyph_meetme-Rg", sans-serif;
  margin-bottom: 70px;
  font-size: 20px;
  text-align: left;
  position: relative;
  padding-bottom: 5px;
  letter-spacing: 2px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SellerLeft = styled.div`
  position: absolute;
  top: 0;
  display: flex;
  align-items: center;
`;

const SellerImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
`;

const Nickname = styled.p`
  font-family: "Ownglyph_meetme-Rg", sans-serif;
  font-weight: bold;
  line-height: 25px;
  margin: 0;
`;

const Location = styled.p`
  font-size: 14px;
  margin: 0;
`;

const ProductRight = styled.div`
  text-align: left;
  width: 50%;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const ProductTitle = styled.h2`
  font-family: "Ownglyph_meetme-Rg", sans-serif;
  font-size: 35px;
  font-weight: bold;
  margin-bottom: 3px;
`;

const ProductCategory = styled.p`
  font-family: "Ownglyph_meetme-Rg", sans-serif;
  font-size: 20px;
  color: #007acc;
  margin-bottom: 10px;
`;

const ProductDescription = styled.p`
  font-family: "Ownglyph_meetme-Rg", sans-serif;
  min-height: 240px;
  font-size: 22px;
  margin-bottom: 20px;
  background-color: #f3f3f3;
  border-radius: 10px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  justify-content: flex-end;
  position: absolute;
  right: 200px;
`;

const EditButton = styled.button`
  background-color: #ffd85a;
  color: white;
  border: none;
  padding: 8px 15px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
  width: 150px;

  &:hover {
    background-color: #f0ba09;
    color: white;
  }
`;

const DeleteButton = styled.button`
  width: 150px;
  background-color: red;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;

  &:hover {
    background-color: darkred;
  }
`;

const ChatButton = styled.button`
  position: absolute;
  right: 0;
  top: 20px;
  width: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px; /* 아이콘과 텍스트 간격 */
  background-color: #007acc;
  color: white;
  font-size: 16px;
  font-weight: bold;
  padding: 12px 20px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #005fa3;
    transform: translateY(-2px);
  }

  &:active {
    background-color: #004080;
    transform: translateY(0);
  }
`;

const ChatIcon = styled.span`
  font-size: 20px;
`;

const DetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [newPost, setNewPost] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [category, setCategory] = useState([]);
  const [imageBase64, setImageBase64] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);
  const DEFAULT_IMAGE = "/assets/TalkMedia_i_2a4ebc04392c.png.png";
  const [regionMap, setRegionMap] = useState([]);
  const [mapInfo, setMapInfo] = useState(null);

  const handlePrev = () => {
    setCurrentImage((prev) => (prev === 0 ? imageBase64.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImage((prev) => (prev === imageBase64.length - 1 ? 0 : prev + 1));
  };

  const fetchImageBase64 = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/photo/board/upload/${postId}`
      );
      if (response.ok) {
        const base64Data = await response.json(); // 서버가 JSON으로 배열 반환하는 경우
        if (Array.isArray(base64Data)) {
          const images = base64Data.map(
            (base64) => `data:image/jpeg;base64,${base64}`
          );
          setImageBase64(images);
        } else {
          const image = `data:image/jpeg;base64,${base64Data}`;
          setImageBase64([image]);
        }
      } else {
        console.error("이미지 로드 실패");
      }
    } catch (error) {
      console.error("이미지 로드 에러:", error);
    }
  };
  // 로그인 상태 확인
  // const checkLoginStatus = async () => {
  //   try {
  //     const response = await fetch(
  //       `${import.meta.env.VITE_API_URL}/api/user/session`,
  //       {
  //         method: "GET",
  //         credentials: "include",
  //       }
  //     );
  //     if (response.ok) {
  //       const data = await response.json();
  //       setIsLoggedIn(true);
  //       setUser(data);
  //     } else {
  //       setIsLoggedIn(false);
  //     }
  //   } catch (error) {
  //     console.error("로그인 상태 확인 실패:", error);
  //     setIsLoggedIn(false);
  //   }
  // };

  const checkLoginStatus = async () => {
    // console.log(localStorage.getItem("user"));
    if (localStorage.getItem("user") == null) {
      console.log("비로그인 상태");
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/token`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: localStorage.getItem("user"),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        // 기존 user와 값이 다를 때만 업데이트
        if (JSON.stringify(user) !== JSON.stringify(data)) {
          setUser(data);
        }
        console.log("세션 체크" + user);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error("로그인 상태 확인 중 오류 발생:", error);
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  const getMapInfo = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/map/${postId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setMapInfo(data);
      } else {
        console.error("응답 오류");
      }
    } catch (error) {
      console.error("데이터 받아오기 오류", error);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchPostDetail();
      fetchImageBase64();
      getMapInfo();
    }
  }, [postId]);

  useEffect(() => {
    checkLoginStatus();
    getLocalCategory()
      .then(setRegionMap)
      .catch((error) => console.error("Fetching error:", error));
    getWalkCategory()
      .then(setCategory)
      .catch((error) => console.error("Fetching error:", error));
  }, []);

  const fetchPostDetail = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/board/walk/${postId}`
      );
      const data = await response.json();

      const postData = {
        id: data.boardId,
        sellerUid: data.userId,
        regionSi: data.localSi,
        regionGu: data.localGu,
        title: data.title,
        content: data.content,
        category: data.walkCategory,
        type: data.boardType,
        clickCnt: data.clickCount,
        reportCnt: data.reportCount,
        updateTime: new Date(data.update).toLocaleString(),
        seller: data.nickname,
      };
      setNewPost(postData);
    } catch (error) {
      console.error("상세 데이터 불러오기 오류:", error);
    }
  };

  const increaseViewCount = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/board/count/${postId}`, {
        method: "PUT",
      });
    } catch (error) {
      console.error("조회수 증가 실패:", error);
    }
  };
  useEffect(() => {
    if (postId) {
      fetchPostDetail();
      increaseViewCount();
    }
  }, [postId]);

  const deletePost = async () => {
    if (!window.confirm("정말로 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/board/${postId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // 세션 인증이 필요할 경우
        }
      );

      if (response.ok) {
        alert("게시물이 삭제되었습니다.");
        navigate("/"); // 삭제 후 홈으로 이동
      } else {
        const errorData = await response.json();
        alert(`삭제 실패: ${errorData.message}`);
      }
    } catch (error) {
      console.error("게시물 삭제 오류:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  if (
    !newPost ||
    !regionMap ||
    Object.keys(regionMap).length === 0 ||
    !category ||
    Object.keys(category).length === 0
  )
    return <div>로딩 중...</div>;

  return (
    <DetailWrapper>
      <ProductBody>
        <ProductLeft>
          <SellerInfo>
            <SellerLeft>
              <SellerImage src="/assets/userimage.jpg" alt="판매자 이미지" />
              <div
                onClick={() => navigate(`/profile/${newPost.sellerUid}`)}
                style={{ cursor: "pointer" }}
              >
                작성자: {newPost.seller}
                <Location>
                  {regionMap[newPost.regionSi].name}{" "}
                  {regionMap[newPost.regionSi].gu[newPost.regionGu].name}
                </Location>
              </div>
              <Report postId={postId} />
            </SellerLeft>
          </SellerInfo>
          <ImageSliderWrapper>
            {imageBase64.map((image, index) => (
              <SlideImage
                key={index}
                src={image || DEFAULT_IMAGE}
                alt={newPost.title}
                className={index === currentImage ? "active" : ""}
              />
            ))}
            {imageBase64.length > 1 && (
              <>
                <ArrowButton className="left" onClick={handlePrev}>
                  &lt;
                </ArrowButton>
                <ArrowButton className="right" onClick={handleNext}>
                  &gt;
                </ArrowButton>
              </>
            )}
            {imageBase64.length > 1 && (
              <ImageCounter>
                // {currentImage + 1} / {imageBase64.length}
                //{" "}
              </ImageCounter>
            )}
          </ImageSliderWrapper>
        </ProductLeft>
        <ProductRight>
          <ProductTitle>{newPost.title}</ProductTitle>
          <ProductCategory>
            {category[newPost.category].name} | {newPost.updateTime} |👁
            {newPost.clickCnt}
          </ProductCategory>
          <ProductDescription>{newPost.content}</ProductDescription>
          <div
            style={{ cursor: "pointer" }}
            onClick={() =>
              navigate(
                `/viewmap/${postId}/${mapInfo.latitude}/${mapInfo.longitude}`
              )
            }
          >
            <OnlyViewMap mapInfo={mapInfo} setMapInfo={setMapInfo} />
          </div>
          {isLoggedIn && user?.userId !== newPost.sellerUid && (
            <ChatButton onClick={() => navigate(`/room/${postId}`)}>
              <ChatIcon>💬</ChatIcon> 채팅 시작
            </ChatButton>
          )}
        </ProductRight>
      </ProductBody>

      {isLoggedIn && user?.userId === newPost.sellerUid && (
        <ButtonWrapper>
          <EditButton onClick={() => navigate(`/editWalk/${postId}`)}>
            게시물 수정
          </EditButton>
          <DeleteButton onClick={deletePost}>게시물 삭제</DeleteButton>
        </ButtonWrapper>
      )}
    </DetailWrapper>
  );
};

export default DetailPage;
