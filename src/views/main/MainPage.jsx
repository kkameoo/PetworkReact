import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

export const PageContainer = styled.div`
  margin-left: 120px;
  max-width: 1500px;
  padding: 2rem;
  background-color: #fffefc;
`;

export const Section = styled.section`
  margin-bottom: 3rem;
`;

export const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
  color: #7b4f1d;
  margin-bottom: 1rem;
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
`;

export const HomeCard = styled.div`
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

export const TextGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); // 항상 2열
  gap: 1rem;
`;

export const TextCard = styled.div`
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

export const ImageRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-start;
`;

export const PetImage = styled.img`
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

const MainPage = () => {
  const API_POST_URL = "http://localhost:8087/api/board";
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [homePosts, setHomePosts] = useState([]);
  const [tradePosts, setTradePosts] = useState([]);
  const [jobPosts, setJobPosts] = useState([]);

  useEffect(() => {
    fetch(API_POST_URL)
      .then((res) => res.json())
      .then((data) => {
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
          image: item.image || "/no-image.png",
        }));
        setPosts(postData);
        setHomePosts(postData.filter((p) => p.type === 1));
        setTradePosts(postData.filter((p) => p.type === 2));
        setJobPosts(postData.filter((p) => p.type === 3));
      })
      .catch((err) => console.error("게시글 불러오기 오류:", err));
  }, []);

  const goToDetail = (postId) => navigate(`/${postId}`);

  return (
    <PageContainer>
      <Section>
        <SectionTitle onClick={() => navigate("/walk")}>
          🏠 산책 게시판
        </SectionTitle>
        <CardGrid>
          {homePosts.map((post) => (
            <HomeCard key={post.id} onClick={() => goToDetail(post.id)}>
              <img src={post.image} alt={post.title} />
              <h4>{post.title}</h4>
            </HomeCard>
          ))}
        </CardGrid>
      </Section>

      <Section>
        <SectionTitle onClick={() => navigate("/sell")}>
          💰 나눔 게시판
        </SectionTitle>
        <CardGrid>
          {tradePosts.map((post) => (
            <HomeCard key={post.id} onClick={() => goToDetail(post.id)}>
              <img src={post.image} alt={post.title} />
              <h4>{post.title}</h4>
            </HomeCard>
          ))}
        </CardGrid>
      </Section>

      <Section>
        <SectionTitle onClick={() => navigate("/hire")}>
          📋 알바 게시판
        </SectionTitle>
        <TextGrid>
          {jobPosts.map((post) => (
            <TextCard key={post.id} onClick={() => goToDetail(post.id)}>
              <h4>{post.title}</h4>
              {/* <p>{post.content}</p> */}
            </TextCard>
          ))}
        </TextGrid>
      </Section>

      <Section>
        <SectionTitle onClick={() => navigate("/petshow")}>
          🐶 Pet Showcase
        </SectionTitle>
        <ImageRow>
          {homePosts.slice(0, 10).map((post) => (
            <PetImage key={post.id} src={post.image} alt={post.title} />
          ))}
        </ImageRow>
      </Section>
    </PageContainer>
  );
};

export default MainPage;
