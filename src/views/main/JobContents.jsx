import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

/* 전체 컨테이너 */
export const ListContainer = styled.div`
  max-width: 1600px;
  margin: 20px auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f9fcff;
`;

/* 검색창 */
export const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 2px solid #00bfff;
  border-radius: 5px;
  outline: none;
  margin-bottom: 20px;
  background-color: #ffffff;
`;

/* 인기검색어 */
export const PopularKeywords = styled.div`
  font-size: 14px;
  display: flex;
  gap: 10px;
`;

export const KeywordButton = styled.button`
  background-color: white;
  border: 1px solid #00bfff;
  color: #00bfff;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: #00bfff;
    color: white;
  }
`;

/* 메인 콘텐츠 영역 */
export const ContentWrapper = styled.div`
  display: flex;
  gap: 20px;
`;

/* 카테고리 필터 사이드바 */
export const Sidebar = styled.div`
  width: 200px;
  padding: 10px;
  border-radius: 10px;
  background-color: #e0f7ff;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
`;

// 지역 선택 부분을 감싸는 div에 스타일 추가
export const RegionSection = styled.div`
  max-height: 300px; /* 원하는 최대 높이 */
  overflow-y: auto; /* 세로 스크롤 추가 */
`;

export const CategorySection = styled.div`
  margin-top: 20px;
`;
export const SidebarTitle = styled.h3`
  margin-left: 25px;
  text-align: left;
  margin-bottom: 10px;
  color: #007acc;
`;

export const SidebarLabel = styled.label`
  margin-left: 30px;
  text-align: left;
  display: block;
  margin-bottom: 8px;
  color: #007acc;
`;

export const SidebarInput = styled.input`
  margin-right: 5px;
`;

/* 상품 리스트 */
export const ProductList = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  flex-grow: 1;
`;

export const ProductCard = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  box-shadow: 0px 4px 6px rgba(0, 150, 255, 0.1);
  position: relative;
  overflow: hidden;
  transition: box-shadow 0.3s;

  &:hover {
    box-shadow: 0px 6px 10px rgba(0, 150, 255, 0.2);
  }
`;

export const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 5px;
`;

/* 신고 배경 오버레이 */
export const ReportOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  transition: background-color 0.3s ease-in-out;
`;

/* 신고 횟수 표시 */
export const ReportCount = styled.div`
  font-size: 14px;
  color: #ff3b3b;
  font-weight: bold;
  margin-top: 5px;
`;

/* 제목, 가격, 판매자 */
export const ProductTitle = styled.h4`
  font-size: 16px;
  margin: 10px 0;
  color: #333;
`;

export const Seller = styled.div`
  font-size: 14px;
  color: #777;
`;

/* 페이지네이션 */
export const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  position: relative;
`;

export const PaginationButton = styled.button`
  background-color: #00bfff;
  color: white;
  border: none;
  padding: 8px 15px;
  margin: 0 5px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;

  &:disabled {
    background-color: #ccefff;
    color: #aaa;
    cursor: not-allowed;
  }
`;

export const CreateButton = styled(PaginationButton)`
  position: absolute;
  right: 0;
  background-color: #007acc;

  &:hover {
    background-color: #005c99;
    color: white;
  }
`;

export const PageNumber = styled.span`
  font-size: 18px;
  font-weight: bold;
  color: #007acc;
`;

// 지역 및 카테고리 매핑
const CATEGORY_ID = {
  0: "전체",
  1: "소형견",
  2: "중형견",
  3: "대형견",
};

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

const JobContents = () => {
  const API_POST_URL = "http://localhost:8087/api/board/hire";
  const API_IMAGE_URL = "http://localhost:8087/api/photo/board/upload";
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
  const DEFAULT_IMAGE = "src/assets/TalkMedia_i_2a4ebc04392c.png.png";

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
          category: item.category,
          type: item.boardType,
          clickCnt: item.clickCount,
          reportCnt: item.reportCount,
          price: item.price || 0,
          seller: item.seller || "알 수 없음",
          regionDong: `${regionMap[item.localSi] || ""} ${
            guMap[item.localGu] || ""
          }`,
          image: item.image || "/no-image.png",
        }));
        console.log("데이터:", data);
        setPosts(postData);
        setFilteredPosts(postData);
        postData.forEach((post) => fetchImage(post.id));
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

  // 필터링 로직
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

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedPosts = filteredPosts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const goToDetail = (postId) => navigate(`/hire/${postId}`);

  return (
    <>
      <ListContainer>
        <ContentWrapper>
          {/* 사이드바 */}
          <Sidebar>
            <RegionSection>
              <SidebarTitle>지역 선택</SidebarTitle>
              {Object.values(regionMap).map((region) => (
                <SidebarLabel key={region}>
                  <SidebarInput
                    type="radio"
                    name="region"
                    value={region}
                    checked={selectedRegion === region}
                    onChange={() => {
                      setSelectedRegion(region);
                      setSelectedGu("전체");
                    }}
                  />
                  {region}
                </SidebarLabel>
              ))}
            </RegionSection>

            {selectedRegion !== "전체" && (
              <select
                value={selectedGu}
                onChange={(e) => setSelectedGu(e.target.value)}
                style={{
                  marginLeft: "25px",
                  marginBottom: "20px",
                  padding: "5px",
                }}
              >
                <option value="전체">-- 구 선택 --</option>
                {regionGuMap[selectedRegion]?.map((gu) => (
                  <option key={gu} value={gu}>
                    {gu}
                  </option>
                ))}
              </select>
            )}

            <CategorySection>
              <SidebarTitle>카테고리</SidebarTitle>
              {Object.entries(CATEGORY_ID).map(([key, category]) => (
                <SidebarLabel key={key}>
                  <SidebarInput
                    type="radio"
                    name="category"
                    value={key}
                    checked={selectedCategory === Number(key)}
                    onChange={() => {
                      setSelectedCategory(Number(key));
                      setCurrentPage(1);
                    }}
                  />
                  {category}
                </SidebarLabel>
              ))}
            </CategorySection>
          </Sidebar>

          {/* 관리자 모드 알림 */}
          {user?.is_admin && (
            <div
              style={{ marginLeft: "20px", color: "red", fontWeight: "bold" }}
            >
              관리자 모드 활성화됨 ✅
            </div>
          )}

          {/* 게시글 리스트 */}

          <ProductList>
            {displayedPosts.map((post) => {
              console.log(post);
              const opacity = user?.is_admin
                ? Math.min(post.reportCnt / 20, 1)
                : 0;
              const backgroundColor = `rgba(255, 0, 0, ${opacity})`;

              return (
                <ProductCard
                  key={post.id}
                  onClick={() => goToDetail(post.id)}
                  style={{ cursor: "pointer" }}
                >
                  <ReportOverlay style={{ backgroundColor }} />
                  <ProductImage
                    src={imageMap[post.id] || DEFAULT_IMAGE}
                    alt={post.title}
                  />
                  <ProductTitle>{post.title}</ProductTitle>
                  <Seller>판매자: {post.seller}</Seller>
                  <Seller>{post.regionDong}</Seller>
                  <Seller>{CATEGORY_ID[post.category]}</Seller>
                  {user?.is_admin && (
                    <ReportCount>신고: {post.reportCnt}회</ReportCount>
                  )}
                </ProductCard>
              );
            })}
          </ProductList>
        </ContentWrapper>

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
          <CreateButton onClick={() => navigate("/postHire")}>
            게시물 작성
          </CreateButton>
        </PaginationWrapper>
      </ListContainer>
    </>
  );
};

export default JobContents;
