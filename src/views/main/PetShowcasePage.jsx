import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 1600px;
  padding: 40px;
  font-family: "Arial", sans-serif;
`;

const TopTenContainer = styled.div`
  margin-bottom: 30px;
`;

const TopTenList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  list-style: none;
  padding: 0;
`;

const TopTenItem = styled.li`
  background-color: #007acc;
  color: white;
  padding: 5px 10px;
  border-radius: 10px;
  font-size: 14px;
`;

const SortButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
`;

const SortButton = styled.button`
  background-color: ${(props) => (props.active ? "#00BFFF" : "#e0e0e0")};
  color: ${(props) => (props.active ? "white" : "#333")};
  border: none;
  border-radius: 8px;
  padding: 10px 15px;
  font-size: 15px;
  margin-left: 10px;
  cursor: pointer;
  &:hover {
    background-color: #00bfff;
    color: white;
  }
`;

const PostGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
`;

const PostCard = styled.div`
  background-color: #f9f9f9;
  border-radius: 12px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const PostImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
`;

const PostTitle = styled.h4`
  margin: 10px 0 5px;
  font-size: 18px;
  color: #007acc;
`;

const PostViews = styled.p`
  font-size: 14px;
  color: #666;
`;

export const petShowcaseData = [
  {
    id: 1,
    title: "귀염둥이 댕댕이 산책 중 💕",
    image: "/images/dog1.jpg",
    category: "산책",
    location: "서울 강남구",
    createdAt: "2025-03-20",
    views: 158,
  },
  {
    id: 2,
    title: "우리집 강아지 첫 미용✨",
    image: "/images/dog2.jpg",
    category: "미용",
    location: "부산 해운대구",
    createdAt: "2025-03-19",
    views: 230,
  },
  {
    id: 3,
    title: "개린이날 기념 사진📸",
    image: "/images/dog3.jpg",
    category: "기념일",
    location: "인천 연수구",
    createdAt: "2025-03-18",
    views: 142,
  },
  {
    id: 4,
    title: "아기 댕댕이 입양했어요🥺",
    image: "/images/dog4.jpg",
    category: "입양",
    location: "서울 마포구",
    createdAt: "2025-03-17",
    views: 315,
  },
  {
    id: 5,
    title: "눈 오는 날 산책🐾",
    image: "/images/dog5.jpg",
    category: "산책",
    location: "강원 춘천시",
    createdAt: "2025-03-16",
    views: 189,
  },
  {
    id: 6,
    title: "강아지 생일파티🎂",
    image: "/images/dog6.jpg",
    category: "기념일",
    location: "대전 서구",
    createdAt: "2025-03-15",
    views: 274,
  },
  {
    id: 7,
    title: "강아지랑 커플룩👕🐶",
    image: "/images/dog7.jpg",
    category: "패션",
    location: "경기 성남시",
    createdAt: "2025-03-14",
    views: 162,
  },
  {
    id: 8,
    title: "강아지 유치원 졸업했어요🎓",
    image: "/images/dog8.jpg",
    category: "교육",
    location: "광주 북구",
    createdAt: "2025-03-13",
    views: 220,
  },
  {
    id: 9,
    title: "간식 앞에서 기다리는 모습🥰",
    image: "/images/dog9.jpg",
    category: "훈련",
    location: "제주 서귀포시",
    createdAt: "2025-03-12",
    views: 137,
  },
  {
    id: 10,
    title: "강아지랑 벚꽃 구경🌸",
    image: "/images/dog10.jpg",
    category: "산책",
    location: "서울 송파구",
    createdAt: "2025-03-11",
    views: 298,
  },
  {
    id: 11,
    title: "잠자는 천사😴",
    image: "/images/dog11.jpg",
    category: "일상",
    location: "부산 수영구",
    createdAt: "2025-03-10",
    views: 199,
  },
  {
    id: 12,
    title: "강아지 수영 처음 도전💦",
    image: "/images/dog12.jpg",
    category: "놀이",
    location: "경남 창원시",
    createdAt: "2025-03-09",
    views: 251,
  },
];

const PetShowcasePage = () => {
  const [posts, setPosts] = useState([]);
  const [sortType, setSortType] = useState("latest");

  useEffect(() => {
    // 예시 데이터 불러오기 또는 API 연결
    const exampleData = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      title: `귀여운 강아지 ${i + 1}`,
      image: "/images/dog.jpg",
      views: Math.floor(Math.random() * 1000),
      date: new Date(Date.now() - i * 10000000),
    }));
    setPosts(exampleData);
  }, []);

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortType === "latest") return b.date - a.date;
    if (sortType === "views") return b.views - a.views;
    return 0;
  });

  const topTenPosts = [...posts].sort((a, b) => b.views - a.views).slice(0, 10);

  return (
    <Container>
      <TopTenContainer>
        <h3>🔥 조회수 TOP 10</h3>
        <TopTenList>
          {topTenPosts.map((post) => (
            <TopTenItem key={post.id}>{post.title}</TopTenItem>
          ))}
        </TopTenList>
      </TopTenContainer>

      <SortButtons>
        <SortButton
          active={sortType === "latest"}
          onClick={() => setSortType("latest")}
        >
          최신순
        </SortButton>
        <SortButton
          active={sortType === "views"}
          onClick={() => setSortType("views")}
        >
          조회순
        </SortButton>
      </SortButtons>

      <PostGrid>
        {sortedPosts.slice(0, 12).map((post) => (
          <PostCard key={post.id}>
            <PostImage src={post.image} alt={post.title} />
            <PostTitle>{post.title}</PostTitle>
            <PostViews>조회수: {post.views}</PostViews>
          </PostCard>
        ))}
      </PostGrid>
    </Container>
  );
};

export default PetShowcasePage;
