import React, { useEffect, useState } from "react";
import { useParams, useNavigate, data } from "react-router-dom";
import styled from "styled-components";
import { getCategory } from "../../services/dataService";
import Report from "../report/Report";

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
`;

const ProductTitle = styled.h2`
  font-family: "Ownglyph_meetme-Rg", sans-serif;
  font-size: 35px;
  font-weight: bold;
  margin-bottom: 3px;
`;

const ProductCategory = styled.p`
  font-family: "Ownglyph_meetme-Rg", sans-serif;
  font-size: 14px;
  color: #007acc;
  margin-bottom: 10px;
`;

const ProductDescription = styled.p`
  font-family: "Ownglyph_meetme-Rg", sans-serif;
  min-height: 240px;
  font-size: 18px;
  margin-bottom: 20px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 10px; /* 버튼 간 간격 설정. */
  margin-top: 20px; /* 버튼을 위로 올리기 */
  justify-content: flex-end; /* 오른쪽 정렬 */
  position: absolute;
  right: 78px; /* 오른쪽 끝으로 배치 */
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
    background-color: #005c99;
    color: white;
  }
`;

const DeleteButton = styled.button`
  font-family: "Ownglyph_meetme-Rg", sans-serif;
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
  const [category, setCategory] = useState(null);
  const [imageBase64, setImageBase64] = useState("");
  const DEFAULT_IMAGE = "src/assets/TalkMedia_i_2a4ebc04392c.png.png";

  // 로그인 상태 확인
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
    getCategory()
      .then(setCategory)
      .catch((error) => console.error("Fetching error:", error));
  }, []);

  const fetchPostDetail = async () => {
    try {
      const response = await fetch(
        `http://localhost:8087/api/board/walk/${postId}`
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

  useEffect(() => {
    if (postId) {
      fetchPostDetail();
    }
  }, [postId]);

  const deletePost = async () => {
    if (!window.confirm("정말로 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(
        `http://localhost:8087/api/board/${postId}`,
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

  if (!newPost || !category) return <div>로딩 중...</div>;

  return (
    <DetailWrapper>
      <ProductBody>
        <ProductLeft>
          <ProductImage
            src={imageBase64 || DEFAULT_IMAGE}
            alt={newPost.title}
          />
          <SellerInfo>
            <SellerLeft>
              <SellerImage src="src/assets/userimage.jpg" alt="판매자 이미지" />
              <div
                onClick={() => navigate(`/profile/${newPost.sellerUid}`)}
                style={{ cursor: "pointer" }}
              >
                작성자: {newPost.seller}
                <Location>
                  {newPost.regionSi} {newPost.regionGu}
                </Location>
              </div>
              <Report postId={postId} userId={user.userId} />
            </SellerLeft>
          </SellerInfo>
        </ProductLeft>
        <ProductRight>
          <ProductTitle>{newPost.title}</ProductTitle>
          <ProductCategory>
            {category[newPost.category].name} | {newPost.updateTime}
          </ProductCategory>
          <ProductDescription>{newPost.content}</ProductDescription>
          <ChatButton onClick={() => navigate(`/room/${postId}`)}>
            <ChatIcon>💬</ChatIcon> 채팅 시작
          </ChatButton>
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
