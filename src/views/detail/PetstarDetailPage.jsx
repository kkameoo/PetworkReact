import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";

const ProductDetailWrapper = styled.div`
  width: 100%;
  max-width: 800px; /* 칸을 좁게 만듦. 필요에 따라 크기를 더 줄일 수 있습니다 */
  margin: 0 auto; /* 화면 가운데 정렬 */
  padding: 20px; /* 약간의 내부 여백 추가 */
  border: 1px solid #ccc;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: transparent; /* 배경색 제거 */
  display: flex;
  flex-direction: column;
  align-items: center; /* 내용 가로 가운데 정렬 */
`;

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
  width: 100%;
  text-align: left; /* 상품 제목을 왼쪽 정렬 */
  margin-left: 0; /* 왼쪽 여백 없애기 */
`;

const ProductImage = styled.img`
  border: 1px solid rgb(207, 207, 207);
  border-radius: 25px;
  width: 700px;
  height: auto;
  margin-bottom: 30px;
`;

const SellerInfo = styled.div`
  margin-bottom: 20px;
  font-size: 20px;
  text-align: left; /* 판매자 정보 왼쪽 정렬 */
  padding-bottom: 5px;
  letter-spacing: 2px;
  display: flex;
  flex-direction: column; /* 세로로 배치 */
  margin-top: 10px;
  margin-left: 100px;
  width: 100%; /* div의 너비를 100%로 설정 */
  padding: 10px; /* 내부 여백 */
  /* border-bottom: 1px solid; */
`;

const SellerLeft = styled.div`
  display: flex;
  flex-direction: row; /* 사진과 텍스트가 가로로 배치되도록 수정 */
  align-items: center;
  margin-right: 20px;
  margin-left: 0; /* 왼쪽 여백 제거 */
`;

const SellerImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px; /* 사진과 텍스트 간의 간격을 추가 */
`;

const Nickname = styled.p`
  font-weight: bold;
  font-size: 18px;
  margin: 0;
`;

const Location = styled.p`
  font-size: 14px;
  color: #777;
  margin: 0;
`;

const ProductTitle = styled.h2`
  font-size: 35px;
  font-weight: bold;
  margin-bottom: 20px; /* 제목과 판매자 정보 사이의 간격을 조정 */
  text-align: left; /* 제목 왼쪽 정렬 */
  margin-left: 50px; /* 왼쪽 여백 없애기 */
`;

const ProductCategory = styled.p`
  font-size: 14px;
  color: #007acc;
  margin: 0;
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

function PetstarDetailPage({ onSubmitSuccess = () => {} }) {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [newPost, setNewPost] = useState(null); // 이거 다시 켜키
  const [newComment, setNewComment] = useState();

  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageBase64, setImageBase64] = useState("");
  const [description, setDescription] = useState("");
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
        updateTime: formattedDateTime,
        seller: data.nickname,
      };
      console.log("Data", data);
      setNewPost(postData);
    } catch (error) {
      console.error("상세 데이터 불러오기 오류:", error);
    }
  };

  const fetchComment = async () => {
    try {
      const response = await fetch(
        `http://localhost:8087/api/board/${postId}/comment`
      );
      const data = await response.json();
      console.log(data);

      const postData3 = {
        commentContent: data.commentContent,
        regDate: new Date(data.regDate).toLocaleString(),
        commentUser: data.commentUser,
      };
      console.log("Data", data);
      setNewComment(postData3);
    } catch (error) {
      console.error("상세 데이터 불러오기 오류:", error);
    }
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    const postData2 = {
      commentContent: description,
      regDate: new Date().toISOString(),
      commentUser: user.nickname,
    };
    console.log("postdata", postData2);
    try {
      const response = await fetch(
        `http://localhost:8087/api/board/${postId}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData2),
        }
      );

      if (response.ok) {
        alert("게시물이 성공적으로 등록되었습니다!");
        setNewComment(postData2);
        // onSubmitSuccess();
        // navigate("/");
      } else {
        alert("게시물 등록 실패. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("게시물 등록 중 오류 발생:", error);
      alert("오류가 발생했습니다.");
    }
  };

  const onBack = () => navigate("/");

  useEffect(() => {
    if (postId) {
      fetchPostDetail();
      fetchImageBase64();
      fetchComment();
    }
  }, [postId]);

  if (!newPost || !newComment) return <div>로딩 중...</div>;

  return (
    <DetailWrapper>
      <BackButton onClick={onBack}>← 뒤로</BackButton>

      <ProductDetailWrapper>
        {/* 상품 제목 */}
        <ProductBody>
          <ProductTitle>{newPost.title}</ProductTitle>
        </ProductBody>

        {/* 판매자 정보 */}
        <SellerInfo>
          <SellerLeft>
            <SellerImage
              src="../src/assets/userimage.jpg"
              alt="판매자 이미지"
            />
            <div>
              <Nickname>{newPost.seller}</Nickname>
              <ProductCategory>
                {newPost.category} | {newPost.updateTime}
              </ProductCategory>
              <Location>
                {newPost.regionSi} {newPost.regionGu}
              </Location>
            </div>
          </SellerLeft>
        </SellerInfo>
        <ProductImage src={imageBase64 || DEFAULT_IMAGE} alt={newPost.title} />
        <ProductDescription>{newPost.content}</ProductDescription>
      </ProductDetailWrapper>

      <ProductDescription>{newComment?.commentContent}</ProductDescription>
      <h2>댓글 등록</h2>
      <form onSubmit={handleCommentSubmit}>
        <div className="sell-product-row">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit">등록</button>
      </form>

      <EditButton onClick={() => navigate(`/editWalk/${postId}`)}>
        게시물 수정
      </EditButton>
    </DetailWrapper>
  );
}

export default PetstarDetailPage;
