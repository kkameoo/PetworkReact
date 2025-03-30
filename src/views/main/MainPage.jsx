import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const PageContainer = styled.div`
  margin-left: 120px;
  max-width: 1500px;
  padding: 2rem;
  background-color: #fffefc;
`;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
  color: #7b4f1d;
  margin-bottom: 1rem;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
`;

const HomeCard = styled.div`
  background-color: #fff2cf;
  border-radius: 16px;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  &:hover {
    transform: scale(1.1);
  }

  img {
    width: 100%;
    height: 140px;
    object-fit: cover;
    border-radius: 12px;
    margin-bottom: 0.5rem;
  }

  h4 {
    font-size: 1rem;
    color: #3b2e1a;
  }
`;

const TextGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); // 항상 2열
  gap: 1rem;
`;

const TextCard = styled.div`
  background-color: #fff6e0;
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);

  h4 {
    font-size: 1.1rem;
    font-weight: bold;
    color: #4b3d2a;
    margin-bottom: 0.5rem;
    &:hover {
      border-bottom: 1px solid steelblue;
    }
  }

  p {
    font-size: 0.95rem;
    color: #5c4a32;
  }
`;

const ImageRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-start;
`;

const PetImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 30px;
  object-fit: cover;
  border: 2px solid #ffd38b;
`;

const petImages = Array.from(
  { length: 10 },
  (_, i) => `https://place-puppy.com/100x100?pet${i}`
);

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
  const API_POST_URL = "http://localhost:8087/api/board";
  const API_IMAGE_URL = "http://localhost:8087/api/photo/board/upload";
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [homePosts, setHomePosts] = useState([]);
  const [tradePosts, setTradePosts] = useState([]);
  const [jobPosts, setJobPosts] = useState([]);
  const [petPosts, setPetPosts] = useState([]);
  const [imageMap, setImageMap] = useState({}); // postId -> base64 이미지
  const [userInfo, setUserInfo] = useState({
    email: "user@example.com",
    nickname: "username123",
  });

  const DEFAULT_IMAGE = "src/assets/TalkMedia_i_2a4ebc04392c.png.png";

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(API_POST_URL);
        const data = await res.json();
        const postData = Object.values(data).map((item) => ({
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
        }));

        setPosts(postData);
        setHomePosts(postData.filter((p) => p.type === 1));
        setTradePosts(postData.filter((p) => p.type === 2));
        setJobPosts(postData.filter((p) => p.type === 3));
        setPetPosts(postData.filter((p) => p.type === 4));

        // 이미지 병렬로 불러오기
        postData.forEach((post) => fetchImage(post.id));
      } catch (err) {
        console.error("게시글 불러오기 오류:", err);
      }
    };

    const fetchImage = async (postId) => {
      try {
        const res = await fetch(`${API_IMAGE_URL}/${postId}`);
        if (res.ok) {
          const base64Data = await res.json();
          const base64String = Array.isArray(base64Data)
            ? base64Data[0]
            : base64Data;
          const fullBase64 = `data:image/jpeg;base64,${base64String}`;
          setImageMap((prev) => ({ ...prev, [postId]: fullBase64 }));
        } else {
          console.warn(`이미지 불러오기 실패: ${postId}`);
        }
      } catch (e) {
        if (e.message.includes("404")) {
          console.warn("반환된 사진이 없습니다.");
        } else { 
          console.error(`이미지 요청 에러 (${postId}):`, e);
        }
      }
    };

    fetchPosts();
  }, []);

  const goToDetail = (postId) => navigate(`/${postId}`);

  return (
    <PageLayout>
      {/* 게시판 영역 */}
      <ContentArea>
        <Section>
          <SectionTitle onClick={() => navigate("/walk")}>🏠 산책 게시판</SectionTitle>
          <CardGrid>
            {homePosts.map((post) => (
              <HomeCard key={post.id} onClick={() => goToDetail(post.id)}>
                <img src={imageMap[post.id] || DEFAULT_IMAGE} alt={post.title} />
                <h4>{post.title}</h4>
              </HomeCard>
            ))}
          </CardGrid>
        </Section>

        <Section>
          <SectionTitle onClick={() => navigate("/sell")}>💰 나눔 게시판</SectionTitle>
          <CardGrid>
            {tradePosts.map((post) => (
              <HomeCard key={post.id} onClick={() => goToDetail(post.id)}>
                <img src={imageMap[post.id] || DEFAULT_IMAGE} alt={post.title} />
                <h4>{post.title}</h4>
              </HomeCard>
            ))}
          </CardGrid>
        </Section>

        <Section>
          <SectionTitle onClick={() => navigate("/hire")}>📋 알바 게시판</SectionTitle>
          <TextGrid>
            {jobPosts.map((post) => (
              <TextCard key={post.id} onClick={() => navigate(`/hire/${post.id}`)}>
                <h4>{post.title}</h4>
              </TextCard>
            ))}
          </TextGrid>
        </Section>

        <Section>
          <SectionTitle onClick={() => navigate("/petshow")}>🐶 Pet Showcase</SectionTitle>
          <ImageRow>
            {petPosts.slice(0, 10).map((post) => (
              <PetImage key={post.id} src={imageMap[post.id]} alt={post.title} />
            ))}
          </ImageRow>
        </Section>
      </ContentArea>

      {/* 유저 정보 영역 */}
      <UserInfoContainer>
        <UserTitle>📍 사용자 정보</UserTitle>
        <UserInfo>
          <div><strong>이메일:</strong> {userInfo.email}</div>
          <div><strong>닉네임:</strong> {userInfo.nickname}</div>
        </UserInfo>
        <Button>버어어ㅓㅓㅓ튼</Button>
      </UserInfoContainer>
    </PageLayout>
  );
}
export default MainPage;

