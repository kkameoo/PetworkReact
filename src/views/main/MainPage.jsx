import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const SectionWrapper = styled.div`
  margin: 50px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;
const PostsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;
const DefaultPostCard = styled.div`
  width: 200px;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background-color: #f9f9f9;
  }
`;
const HirePostCard = styled.div`
  width: 200px;
  border: 2px dashed #a2e4b8;
  padding: 12px;
  border-radius: 10px;
  background-color: #a2e4b8;
  cursor: pointer;
  &:hover {
    background-color: #a2e4b8;
  }
`;
const PetstarPostCard = styled.div`
  width: 120px;
  padding: 6px;
  border-radius: 12px;
  background-color: #fff;
  cursor: pointer;
  &:hover {
    transform: scale(1.05);
  }
`;
const Thumbnail = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 5px;
`;
const PetThumbnail = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 30px;
  object-fit: cover;
  border: 2px solid #a2e4b8;
`;

const Title = styled.h3`
  font-size: 16px;
  margin: 10px 0 5px;
`;
const Info = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
`;
const PageLayout = styled.div`
  display: flex;
  justify-content: space-between;
  min-height: 100vh; /* 페이지 높이를 100%로 설정 */
  padding: 2rem;
  background-color: #fffefc;
  margin-left: 120px;
`;

const ContentArea = styled.div`
  width: 75%; /* 게시판 섹션을 왼쪽에 75% */
  padding-right: 2rem;
`;

const UserInfoContainer = styled.div`
  background-color: #a2e4b8;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  height: 250px;
  margin-top: 115px; /* 위로 띄우기 */
  display: flex;
  flex-direction: column;
  justify-content: space-between; // 버튼을 아래로 정렬
`;

const UserTitle = styled.h3`
  font-size: 1.2rem; /* 제목 크기 줄이기 */
  color: #3b2e1a;
  margin-bottom: 0.8rem; /* 제목과 내용 사이 간격 */
`;

const UserInfo = styled.div`
  font-size: 0.9rem; /* 내용 글자 크기 줄이기 */
  color: #4b3d2a;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 10px; /* 내용들 간의 간격을 약간 늘려줌 */
`;

const Button = styled.button`
  font-family: "Ownglyph_meetme-Rg", sans-serif;
  background-color: #fdfdfd;
  border: none;
  padding: 6px 14px; /* 버튼 크기 줄이기 */
  border-radius: 8px;
  font-size: 0.9rem; /* 버튼 크기 줄이기 */
  color: #4b3d2a;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #6dbe92;
  }
`;

function MainPage() {
  const navigate = useNavigate();
  const [homePosts, setHomePosts] = useState([]);
  const [tradePosts, setTradePosts] = useState([]);
  const [jobPosts, setJobPosts] = useState([]);
  const [petstarPosts, setPetstarPosts] = useState([]);
  const [imageMap, setImageMap] = useState({});
  const DEFAULT_IMAGE = "src/assets/TalkMedia_i_2a4ebc04392c.png.png";
  const [user, setUser] = useState(null);
  const [isLoggedin, setIsLoggedIn] = useState();

  const checkLoginStatus = async () => {
    try {
      const response = await fetch("http://localhost:8087/api/user/session", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        console.log("유저", data);
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

  const fetchImageBase64 = async (boardId) => {
    try {
      const response = await fetch(
        `http://localhost:8087/api/photo/board/upload/${boardId}`
      );
      // const responseText = await response.text();
      // console.log(responseText);
      if (response.ok) {
        const base64Data = await response.json();
        const base64String = Array.isArray(base64Data)
          ? base64Data[0]
          : base64Data;
        const mimeType = "image/jpeg";
        return `data:${mimeType};base64,${base64String}`;
      } else {
        return null;
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.log("JSON 파싱 오류: 사진이 존재하지 않습니다.");
      } else {
        console.error("네트워크 또는 서버 오류:", error.message);
      }
    }
  };
  const fetchPostsWithImages = async (url, setPosts, filterType = null) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("데이터 불러오기 실패");
      const data = await response.json();
      const filteredData =
        filterType !== null
          ? data.filter((item) => item.boardType === filterType)
          : data;

      const transformedData = filteredData.map((item) => ({
        id: item.boardId,
        sellerUid: item.userId,
        regionSi: item.localSi,
        regionGu: item.localGu,
        title: item.title,
        content: item.content,
        category: item.category,
        type: item.boardType,
        clickCnt: item.clickCount,
        reportCnt: item.reportCount,
        boardId: item.boardId,
        nickname: item.nickname,
        localSi: item.localSi,
        localGu: item.localGu,
      }));

      setPosts(transformedData);

      const imageMapTemp = {};
      for (const post of transformedData) {
        const img = await fetchImageBase64(post.boardId);
        if (img) imageMapTemp[post.boardId] = img;
      }
      setImageMap((prev) => ({ ...prev, ...imageMapTemp }));
    } catch (error) {
      console.error("게시글 불러오기 실패:", error);
    }
  };
  useEffect(() => {
    checkLoginStatus();
    const fetchAll = async () => {
      await fetchPostsWithImages(
        "http://localhost:8087/api/board/walk/popular",
        setHomePosts
      );
      await fetchPostsWithImages(
        "http://localhost:8087/api/board/trade/popular",
        setTradePosts
      );
      await fetchPostsWithImages(
        "http://localhost:8087/api/board/hire/popular",
        setJobPosts
      );
      await fetchPostsWithImages(
        "http://localhost:8087/api/board",
        setPetstarPosts,
        4
      );
    };
    fetchAll();
  }, []);
  const PopularPosts = [...petstarPosts]
    .sort((a, b) => b.clickCnt - a.clickCnt)
    .slice(0, 10);

  const renderPostCard = (post, image) => {
    if (post.type === 4) {
      return (
        <PetstarPostCard
          key={post.boardId}
          onClick={() => navigate(`/petstarDetail/${post.boardId}`)}
        >
          <PetThumbnail src={image} alt="펫스타그램 이미지" />
        </PetstarPostCard>
      );
    }
    if (post.type === 3) {
      return (
        <HirePostCard
          key={post.boardId}
          onClick={() => navigate(`/hire/${post.boardId}`)}
        >
          <Title>{post.title}</Title>
          <Info>{post.nickname}</Info>
          <Info>
            {post.localSi} {post.localGu}
          </Info>
        </HirePostCard>
      );
    }
    if (post.type === 2) {
      return (
        <DefaultPostCard
          key={post.boardId}
          onClick={() => navigate(`/trade/${post.boardId}`)}
        >
          <Thumbnail
            src={imageMap[post.id] || DEFAULT_IMAGE}
            alt={post.title}
          />
          <Title>{post.title}</Title>
          <Info>{post.nickname}</Info>
          <Info>
            {post.localSi} {post.localGu}
          </Info>
        </DefaultPostCard>
      );
    }
    return (
      <DefaultPostCard
        key={post.boardId}
        onClick={() => navigate(`/${post.boardId}`)}
      >
        <Thumbnail src={imageMap[post.id] || DEFAULT_IMAGE} alt={post.title} />
        <Title>{post.title}</Title>
        <Info>{post.nickname}</Info>
        <Info>
          {post.localSi} {post.localGu}
        </Info>
      </DefaultPostCard>
    );
  };

  return (
    <PageLayout>
      <ContentArea>
        <SectionWrapper>
          <SectionTitle>🐾산책 게시판 인기글🐾</SectionTitle>
          <PostsWrapper>
            {homePosts.map((post) =>
              renderPostCard(post, imageMap[post.boardId], "walk")
            )}
          </PostsWrapper>
        </SectionWrapper>

        <SectionWrapper>
          <SectionTitle>🎁나눔 게시판 인기글🎁</SectionTitle>
          <PostsWrapper>
            {tradePosts.map((post) =>
              renderPostCard(post, imageMap[post.boardId], "trade")
            )}
          </PostsWrapper>
        </SectionWrapper>

        <SectionWrapper>
          <SectionTitle>🤝알바 게시판 인기글🤝</SectionTitle>
          <PostsWrapper>
            {jobPosts.map((post) =>
              renderPostCard(post, imageMap[post.boardId], "hire")
            )}
          </PostsWrapper>
        </SectionWrapper>
        <SectionWrapper>
          <SectionTitle>📸펫스타그램 인기글📸</SectionTitle>
          <PostsWrapper>
            {PopularPosts.map((post) =>
              renderPostCard(post, imageMap[post.boardId], "petstar")
            )}
          </PostsWrapper>
        </SectionWrapper>
      </ContentArea>
      {isLoggedin && (
        <UserInfoContainer>
          <UserTitle>📍 사용자 정보</UserTitle>
          <UserInfo>
            <div>
              <strong>이메일:</strong> {user.email}
            </div>
            <div>
              <strong>닉네임:</strong> {user.nickname}
            </div>
            {/* 관리자 모드 알림 */}
            {user?.admin && (
              <div
                style={{ marginLeft: "20px", color: "red", fontWeight: "bold" }}
              >
                관리자 모드 활성화됨 ✅
              </div>
            )}
          </UserInfo>
          <Button onClick={() => navigate("/my")}>마이페이지</Button>
        </UserInfoContainer>
      )}
    </PageLayout>
  );
}

export default MainPage;
