import React, { useEffect, useState } from "react";
import { useParams, useNavigate, data } from "react-router-dom";
import styled from "styled-components";

const DetailWrapper = styled.div`
  width: 1600px;
  margin-left: 100px;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
`;

const BackButton = styled.button`
  align-self: flex-end;
  width: 80px;
  height: 60px;
  margin-top: 10px;
  background-color: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
  &:hover {
    border: 1px solid black;
    border-radius: 10px;
    background-color: #ccc;
  }
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
`;

const ProductTitle = styled.h2`
  font-size: 35px;
  font-weight: bold;
  margin-bottom: 3px;
`;

const ProductCategory = styled.p`
  font-size: 14px;
  color: #007acc;
  margin-bottom: 10px;
`;

const ProductDescription = styled.p`
  min-height: 240px;
  font-size: 18px;
  margin-bottom: 20px;
`;
const EditButton = styled.button`
  position: absolute;
  right: 150px;
  background-color: #007acc;

  &:hover {
    background-color: #005c99;
    color: white;
  }
`;

const DetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [newPost, setNewPost] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageBase64, setImageBase64] = useState("");
  const DEFAULT_IMAGE = "src/assets/TalkMedia_i_2a4ebc04392c.png.png";
  // const base64String = Array.isArray(base64Data) ? base64Data[0] : base64Data;

  const fetchImageBase64 = async () => {
    try {
      const response = await fetch(
        `http://localhost:8087/api/photo/board/upload/${postId}`
      );
      if (response.ok) {
        const base64Data = await response.json(); // ⚠ 서버가 JSON으로 배열 반환하는 경우
        const base64String = Array.isArray(base64Data)
          ? base64Data[0]
          : base64Data;

        const mimeType = "image/jpeg"; // 필요 시 서버에서 MIME 타입도 함께 받아올 수 있음
        const fullBase64 = `data:${mimeType};base64,${base64String}`;
        setImageBase64(fullBase64);
      } else {
        console.error("이미지 로드 실패");
      }
    } catch (error) {
      console.error("이미지 로드 에러:", error);
    }
  };

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  //   }, 5000);
  //   return () => clearInterval(interval);
  // }, []);

  //   로그인 상태 확인
  const checkLoginStatus = async () => {
    try {
      const response = await fetch("http://localhost:8087/api/user/session", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        setUser(data);
        console.log(data + "세션정보");
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("로그인 상태 확인 실패:", error);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const fetchPostDetail = async () => {
    try {
      const response = await fetch(`http://localhost:8087/api/board/${postId}`);
      const data = await response.json();
      const formattedDateTime = data.upd_date
        ? new Date(data.upd_date)
            .toISOString()
            .replace("T", " ")
            .substring(0, 19)
        : "날짜 없음";
      const postData = {
        id: data.boardId,
        sellerUid: data.userId,
        regionSi: data.localSi,
        regionGu: data.localGu,
        title: data.title,
        content: data.content,
        category: data.category,
        type: data.boardType,
        clickCnt: data.clickCount,
        reportCnt: data.reportCount,
        updateTime: data.update,
        seller: data.nickname,
      };
      console.log("Data", data);
      setNewPost(postData);
    } catch (error) {
      console.error("상세 데이터 불러오기 오류:", error);
    }
  };

  const onBack = () => navigate("/");

  useEffect(() => {
    if (postId) {
      fetchPostDetail();
      fetchImageBase64();
    }
  }, [postId]);

  if (!newPost) return <div>로딩 중...</div>;

  return (
    <DetailWrapper>
      <BackButton onClick={onBack}>← 뒤로</BackButton>
      <ProductBody>
        <ProductLeft>
          <ProductImage
            src={imageBase64 || DEFAULT_IMAGE}
            alt={newPost.title}
          />
          <SellerInfo>
            <SellerLeft>
              <SellerImage src="src/assets/userimage.jpg" alt="판매자 이미지" />
              <div>
                <Nickname>{newPost.seller}</Nickname>
                <Location>
                  {newPost.regionSi} {newPost.regionGu}
                </Location>
              </div>
            </SellerLeft>
          </SellerInfo>
        </ProductLeft>
        <ProductRight>
          <ProductTitle>{newPost.title}</ProductTitle>
          <ProductCategory>
            {newPost.category} | {newPost.updateTime}
          </ProductCategory>
          <ProductDescription>{newPost.content}</ProductDescription>
        </ProductRight>
      </ProductBody>
      <EditButton onClick={() => navigate(`/editWalk/${postId}`)}>
        게시물 수정
      </EditButton>
    </DetailWrapper>
  );
};

export default DetailPage;
