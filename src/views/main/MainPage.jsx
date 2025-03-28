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

// 기본 카드 스타일 (산책/거래용)
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

// 알바 전용 카드
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

// 펫스타그램 전용 카드
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

function MainPage() {
  const navigate = useNavigate();
  const [homePosts, setHomePosts] = useState([]);
  const [tradePosts, setTradePosts] = useState([]);
  const [jobPosts, setJobPosts] = useState([]);
  const [petstarPosts, setPetstarPosts] = useState([]);
  const [imageMap, setImageMap] = useState({});
  const DEFAULT_IMAGE = "src/assets/TalkMedia_i_2a4ebc04392c.png.png";

  const fetchImageBase64 = async (boardId) => {
    try {
      const response = await fetch(
        `http://localhost:8087/api/photo/board/upload/${boardId}`
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
      console.error("이미지 로딩 에러:", error);
      return null;
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
    <div>
      <SectionWrapper>
        <SectionTitle>산책 게시판 인기글</SectionTitle>
        <PostsWrapper>
          {homePosts.map((post) =>
            renderPostCard(post, imageMap[post.boardId], "walk")
          )}
        </PostsWrapper>
      </SectionWrapper>

      <SectionWrapper>
        <SectionTitle>나눔 게시판 인기글</SectionTitle>
        <PostsWrapper>
          {tradePosts.map((post) =>
            renderPostCard(post, imageMap[post.boardId], "trade")
          )}
        </PostsWrapper>
      </SectionWrapper>

      <SectionWrapper>
        <SectionTitle>알바 게시판 인기글</SectionTitle>
        <PostsWrapper>
          {jobPosts.map((post) =>
            renderPostCard(post, imageMap[post.boardId], "hire")
          )}
        </PostsWrapper>
      </SectionWrapper>

      <SectionWrapper>
        <SectionTitle>펫스타그램 인기글</SectionTitle>
        <PostsWrapper>
          {petstarPosts.map((post) =>
            renderPostCard(post, imageMap[post.boardId], "petstar")
          )}
        </PostsWrapper>
      </SectionWrapper>
    </div>
  );
}

export default MainPage;
