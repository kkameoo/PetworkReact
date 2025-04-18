import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  margin-left: 130px;
  margin-right: 200px;
  max-width: 1600px;
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
  color: white;
  padding: 5px 10px;
  border-radius: 10px;
  font-size: 14px;
  img {
    width: 80px;
    height: 80px;
    border-radius: 30px;
    object-fit: cover;
    border: 2px solid #ffd38b;
    cursor: pointer;
  }
`;

const SortButtons = styled.div`
  display: flex;
  justify-content: flex-end; /* 오른쪽 정렬 */
  margin-bottom: 20px;
  gap: 10px; /* 버튼 사이 간격 */
`;

const SortButton = styled.button`
  background-color: ${(props) => (props.active ? "#a2e4b8" : "#a2e4b8")};
  color: ${(props) => (props.active ? "white" : "#333")};
  border: none;
  border-radius: 8px;
  padding: 10px 15px;
  font-size: 15px;
  cursor: pointer;
  &:hover {
    background-color: #6dbe92;
    color: white;
  }
`;

const CreateButton = styled.button`
  background-color: #a2e4b8;
  color: white;
  border: none;
  padding: 8px 15px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
  background-color: #a2e4b8;

  &:hover {
    background-color: #6dbe92;
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
  cursor: pointer;
`;

const PostTitle = styled.h4`
  margin: 10px 0 5px;
  font-size: 18px;
  color: #727d73;
`;

const PostViews = styled.p`
  font-size: 14px;
  color: #666;
`;
/* 페이지네이션 */
const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  position: relative;
`;

const PaginationButton = styled.button`
  font-family: "Ownglyph_meetme-Rg", sans-serif;
  background-color: #a2e4b8;
  color: white;
  border: none;
  padding: 8px 15px;
  margin: 0 5px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;

  &:disabled {
    background-color: #a2e4b8;
    color: #aaa;
    cursor: not-allowed;
  }
`;

const PageNumber = styled.span`
  font-family: "Ownglyph_meetme-Rg", sans-serif;
  font-size: 18px;
  font-weight: bold;
  color: #a2e4b8;
`;

const regionMap = {
  1: "서울시",
  2: "수원시",
  3: "성남시",
  4: "안양시",
  5: "부천시",
  6: "광명시",
  7: "평택시",
  8: "시흥시",
  9: "안산시",
  10: "고양시",
  11: "과천시",
  12: "구리시",
  13: "남양주시",
  14: "오산시",
  15: "화성시",
  16: "김포시",
  17: "광주시",
  18: "하남시",
  19: "이천시",
  20: "양평군",
  21: "동두천시",
  22: "연천군",
  23: "가평군",
  24: "포천시",
  25: "인천시",
};

const guMap = {
  1: "종로구",
  2: "중구",
  3: "용산구",
  4: "성동구",
  5: "광진구",
  6: "동대문구",
  7: "중랑구",
  8: "강북구",
  9: "도봉구",
  10: "노원구",
  11: "은평구",
  12: "서대문구",
  13: "마포구",
  14: "양천구",
  15: "강서구",
  16: "구로구",
  17: "금천구",
  18: "영등포구",
  19: "동작구",
  20: "관악구",
  21: "서초구",
  22: "강남구",
  23: "송파구",
  24: "강동구",
  25: "장안구",
  26: "권선구",
  27: "팔달구",
  28: "영통구",
  29: "수정구",
  30: "중원구",
  31: "분당구",
  32: "만안구",
  33: "동안구",
  34: "원미구",
  35: "소사구",
  36: "오정구",
  37: "광명구",
  38: "평택구",
  39: "시흥구",
  40: "단원구",
  41: "상록구",
  42: "덕양구",
  43: "일산동구",
  44: "일산서구",
  45: "과천구",
  46: "구리구",
  47: "남양주구",
  48: "오산구",
  49: "화성구",
  50: "중구(인천)",
  51: "동구(인천)",
  52: "미추홀구",
  53: "연수구",
  54: "남동구",
  55: "부평구",
  56: "계양구",
  57: "서구(인천)",
  58: "강화군",
  59: "옹진군",
};

const regionGuMap = {
  서울시: [
    "종로구",
    "중구",
    "용산구",
    "성동구",
    "광진구",
    "동대문구",
    "중랑구",
    "강북구",
    "도봉구",
    "노원구",
    "은평구",
    "서대문구",
    "마포구",
    "양천구",
    "강서구",
    "구로구",
    "금천구",
    "영등포구",
    "동작구",
    "관악구",
    "서초구",
    "강남구",
    "송파구",
    "강동구",
  ],
  수원시: ["장안구", "권선구", "팔달구", "영통구"],
  성남시: ["수정구", "중원구", "분당구"],
  안양시: ["만안구", "동안구"],
  부천시: ["원미구", "소사구", "오정구"],
  광명시: ["광명구"],
  평택시: ["평택구"],
  시흥시: ["시흥구"],
  안산시: ["단원구", "상록구"],
  고양시: ["덕양구", "일산동구", "일산서구"],
  과천시: ["과천구"],
  구리시: ["구리구"],
  남양주시: ["남양주구"],
  오산시: ["오산구"],
  화성시: ["화성구"],
  인천시: [
    "중구(인천)",
    "동구(인천)",
    "미추홀구",
    "연수구",
    "남동구",
    "부평구",
    "계양구",
    "서구(인천)",
    "강화군",
    "옹진군",
  ],
};
const ITEMS_PER_PAGE = 12;

const PetShowcasePage = () => {
  const [sortType, setSortType] = useState("latest");
  const API_POST_URL = `${import.meta.env.VITE_API_URL}/api/board`;
  const API_IMAGE_URL = `${
    import.meta.env.VITE_API_URL
  }/api/photo/board/upload`;
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState("전체");
  const [selectedGu, setSelectedGu] = useState("전체");
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [imageMap, setImageMap] = useState({});
  const [petPosts, setPetPosts] = useState([]);
  const DEFAULT_IMAGE = "/assets/TalkMedia_i_2a4ebc04392c.png.png";

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

  useEffect(() => {
    checkLoginStatus();
  }, []);

  useEffect(() => {
    fetch(API_POST_URL)
      .then((res) => res.json())
      .then((data) => {
        const postData = Object.values(data).map((item) => ({
          id: item.boardId,
          sellerUid: item.userId,
          regionSi: regionMap[item.localSi] || "알 수 없음",
          regionGu: guMap[item.localGu] || "알 수 없음",
          title: item.title,
          content: item.content,
          category: item.walkCategory,
          type: item.boardType,
          clickCnt: item.clickCount,
          reportCnt: item.reportCount,
          updateTime: new Date(data.update).toLocaleString(),
          regionDong: `${regionMap[item.localSi] || ""} ${
            guMap[item.localGu] || ""
          }`,
          image: item.image || "/no-image.png",
        }));

        const petOnlyPosts = postData.filter((p) => p.type === 4);
        setPetPosts(petOnlyPosts);
        setPosts(petOnlyPosts);
        setFilteredPosts(petOnlyPosts);

        petOnlyPosts.forEach((post) => fetchImage(post.id));
      })
      .catch((err) => console.error("게시글 불러오기 오류:", err));
  }, []);

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
      console.error(`이미지 요청 에러 (${postId}):`, e);
    }
  };

  useEffect(() => {
    const filtered = posts.filter((post) => {
      const matchesCategory =
        selectedCategory === 0 || post.category === selectedCategory;
      const matchesRegion =
        selectedRegion === "전체" || post.regionSi === selectedRegion;
      const matchesGu = selectedGu === "전체" || post.regionGu === selectedGu;
      const matchesSearch =
        post.title.includes(searchTerm) || post.content.includes(searchTerm);
      return matchesCategory && matchesRegion && matchesGu && matchesSearch;
    });

    setFilteredPosts(filtered);
  }, [selectedCategory, selectedRegion, selectedGu, searchTerm, posts]);

  const sortedFilteredPosts = [...filteredPosts].sort((a, b) => {
    if (sortType === "latest")
      return new Date(b.updateTime) - new Date(a.updateTime);
    if (sortType === "views") return b.clickCnt - a.clickCnt;
    return 0;
  });

  // 페이지네이션 적용
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedPosts = sortedFilteredPosts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);

  const topTenPosts = [...petPosts]
    .sort((a, b) => b.clickCnt - a.clickCnt)
    .slice(0, 10);

  const goToDetail = (postId) => navigate(`/petstarDetail/${postId}`);

  return (
    <Container>
      <TopTenContainer>
        <h3>🔥 조회수 TOP 10</h3>
        <TopTenList>
          {topTenPosts.map((post) => (
            <TopTenItem key={post.id}>
              <img
                src={imageMap[post.id] || DEFAULT_IMAGE}
                key={post.id}
                onClick={() => goToDetail(post.id)}
              />
            </TopTenItem>
          ))}
        </TopTenList>
      </TopTenContainer>
      <SortButtons>
        <CreateButton onClick={() => navigate("/postPet")}>
          게시물 작성
        </CreateButton>
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
        {displayedPosts.map((post) => (
          <PostCard key={post.id} onClick={() => goToDetail(post.id)}>
            <PostImage
              src={imageMap[post.id] || DEFAULT_IMAGE}
              alt={post.title}
            />
            <PostTitle>{post.title}</PostTitle>
            <PostViews>조회수: {post.clickCnt}</PostViews>
          </PostCard>
        ))}
      </PostGrid>
      {/* 페이지네이션 */}
      <PaginationWrapper>
        <PaginationButton
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          이전
        </PaginationButton>
        <PageNumber>
          {currentPage} / {totalPages}
        </PageNumber>
        <PaginationButton
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          다음
        </PaginationButton>
      </PaginationWrapper>
    </Container>
  );
};

export default PetShowcasePage;
