import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { getLocalCategory } from "../../services/dataService";

const PostsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;
const SectionWrapper = styled.div`
  margin: 50px 0;
  padding: 20px;
  background-color: ${(props) =>
    props.variant === "walk" // 색구분 게시판별로 가능하게 해뒀으니 바꾸고싶으면 variant prop값 주면 됩니당~~
      ? "#e6f9ec"
      : props.variant === "trade"
      ? "#fff8e1"
      : props.variant === "hire"
      ? "#e0f0ff"
      : "#fdfdfd"};
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #3b2e1a;
  border-left: 6px solid #a2e4b8;
  padding-left: 12px;
`;

const DefaultPostCard = styled.div`
  width: 160px;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
  background-color: #ffffff;
  transition: transform 0.2s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  }
`;

const HirePostCard = styled(DefaultPostCard)`
  background-color: #e0f0ff;
  border: 2px dashed #82c6ff;
`;

const PetstarPostCard = styled.div`
  width: 120px;
  padding: 6px;
  border-radius: 12px;
  background-color: #fff;
  &:hover {
    transform: scale(1.1);
  }
`;

const Adver = styled.div`
  margin-left: 50px;
  img {
    width: 1200px;
  }
`;

const SimpleList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 40px;
`;

const SimpleItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const SimpleTitle = styled.span`
  flex: 2;
  margin-left: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
`;

const SimplePrice = styled.span`
  flex: 1;
  font-size: 13px;
  color: #555;
  text-align: right;
`;

const SimpleNickname = styled.span`
  flex: 1;
  font-size: 13px;
  color: #888;
  text-align: right;
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
  min-height: 100vh;
  padding: 2rem;
  background-color: #fffefc;
  margin-left: 120px;
`;

const ContentArea = styled.div`
  width: 75%;
  padding-right: 2rem;
`;

const UserInfoContainer = styled.div`
  background-color: #a2e4b8;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  height: 250px;
  width: 185px;
  margin-top: 115px;
  margin-right: 35px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const UserTitle = styled.h3`
  font-size: 1.5rem;
  color: #3b2e1a;
  margin-bottom: 0.4rem;
`;

const UserInfo = styled.div`
  font-size: 1.1rem;
  color: #4b3d2a;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Button = styled.button`
  font-family: "Ownglyph_meetme-Rg", sans-serif;
  background-color: #fdfdfd;
  border: none;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 1.1rem;
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
  const DEFAULT_IMAGE = "/assets/TalkMedia_i_2a4ebc04392c.png.png";
  const [user, setUser] = useState(null);
  const [isLoggedin, setIsLoggedIn] = useState();
  const [regionMap, setRegionMap] = useState([]);

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
  //       console.log("유저", data);
  //       setIsLoggedIn(true);
  //       setUser(data);
  //       console.log(data + "세션정보");
  //     } else {
  //       setIsLoggedIn(false);
  //     }
  //   } catch (error) {
  //     console.error("로그인 상태 확인 실패:", error);
  //     setIsLoggedIn(false);
  //   }
  // };

  const checkLoginStatus = async () => {
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

  const fetchImageBase64 = async (boardId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/photo/board/upload/${boardId}`
      );
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
        price: item.hirePrice,
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
        `${import.meta.env.VITE_API_URL}/api/board/walk/popular`,
        setHomePosts
      );
      await fetchPostsWithImages(
        `${import.meta.env.VITE_API_URL}/api/board/trade/popular`,
        setTradePosts
      );
      await fetchPostsWithImages(
        `${import.meta.env.VITE_API_URL}/api/board/hire/popular`,
        setJobPosts
      );
      await fetchPostsWithImages(
        `${import.meta.env.VITE_API_URL}/api/board`,
        setPetstarPosts,
        4
      );
    };
    fetchAll();
    getLocalCategory()
      .then(setRegionMap)
      .catch((error) => console.error("Fetching error:", error));
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
          <Info>작성자 : {post.nickname}</Info>
          <Info>
            {regionMap[post.localSi].name}{" "}
            {regionMap[post.localSi].gu[post.localGu].name}
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
          <Info>작성자 : {post.nickname}</Info>
          <Info>
            {regionMap[post.localSi].name}{" "}
            {regionMap[post.localSi].gu[post.localGu].name}
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
        <Info>작성자 : {post.nickname}</Info>
        <Info>
          {regionMap[post.localSi]?.name}{" "}
          {regionMap[post.localSi]?.gu[post.localGu]?.name}
        </Info>
      </DefaultPostCard>
    );
  };

  if (!regionMap || Object.keys(regionMap).length === 0)
    return <div>로딩 중...</div>;

  return (
    <PageLayout>
      <ContentArea>
        <SectionWrapper>
          <SectionTitle>산책 게시판 인기글 🐾</SectionTitle>
          <PostsWrapper>
            {homePosts.map((post) =>
              renderPostCard(post, imageMap[post.boardId], "walk")
            )}
          </PostsWrapper>
        </SectionWrapper>

        <SectionWrapper>
          <SectionTitle>나눔 게시판 인기글 🎁</SectionTitle>
          <PostsWrapper>
            {tradePosts.map((post) =>
              renderPostCard(post, imageMap[post.boardId], "trade")
            )}
          </PostsWrapper>
        </SectionWrapper>
        <SectionWrapper>
          <SectionTitle>알바 게시판 인기글 🤝</SectionTitle>
          <SimpleList>
            {jobPosts.slice(0, 10).map((post, index) => (
              <SimpleItem key={post.boardId}>
                <span>{index + 1}.</span>
                <SimpleTitle onClick={() => navigate(`/hire/${post.boardId}`)}>
                  {post.title}
                </SimpleTitle>
                <SimplePrice>
                  {(post?.price ?? 0).toLocaleString()}원
                </SimplePrice>
                <SimpleNickname>{post.nickname}</SimpleNickname>
              </SimpleItem>
            ))}
          </SimpleList>
        </SectionWrapper>
        <Adver>
          <a
            href="https://smartstore.naver.com/dogrnd/products/10207565907"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/assets/advertisement.jpg"
              alt="광고 이미지"
              className="ad-image"
            />
          </a>
        </Adver>
        <SectionWrapper>
          <SectionTitle>펫스타그램 인기글 📸</SectionTitle>
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
                style={{
                  marginLeft: "20px",
                  color: "red",
                  fontWeight: "bold",
                }}
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
