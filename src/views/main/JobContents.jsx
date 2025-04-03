import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import SideFilter from "../../components/SideFilter";
import { getLocalCategory, getWalkCategory } from "../../services/dataService";
import SizeFilter from "../../components/SizeFilter";
import { useAuth } from "../../hooks/useAuth";

const ListContainer = styled.div`
  max-width: 1600px;
  margin: 20px auto;
  padding: 20px;
  font-family: "Ownglyph_meetme-Rg", sans-serif;
  background-color: #f9fcff;
`;

/* 메인 콘텐츠 영역 */
const ContentWrapper = styled.div`
  display: flex;
  gap: 20px;
`;

/* 카테고리 필터 사이드바 */
const Sidebar = styled.div`
  width: 200px;
  padding: 10px;
  border-radius: 10px;
  background-color: #a2e4b8;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
`;
// 구선택 드롭다운
const SelectBox = styled.select`
  width: 150px;
  padding: 10px;
  font-size: 16px;
  border: 2px solid #93c572;
  border-radius: 8px;
  background-color: #fff;
  appearance: none; /* 기본 화살표 제거 */
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='gray'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;
  cursor: pointer;
  transition: 0.3s ease-in-out;
  margin-bottom: 20px;

  &:hover {
    background-color: #ffeadb;
  }

  &:focus {
    border-color: #93c572;
    box-shadow: 0 0 5px rgba(255, 140, 0, 0.5);
    outline: none;
  }
`;
const Option = styled.option`
  font-size: 16px;
  padding: 10px;
  background-color: #fff;
  color: #333;

  &:hover {
    background-color: #93c572;
    color: white;
  }
`;

/* 상품 리스트 */
const ProductList = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  flex-grow: 1;
`;
const ProductCard = styled.div`
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

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 5px;
`;

/* 신고 배경 오버레이 */
const ReportOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  transition: background-color 0.3s ease-in-out;
`;

/* 신고 횟수 표시 */
const ReportCount = styled.div`
  font-size: 14px;
  color: #ff3b3b;
  font-weight: bold;
  margin-top: 5px;
`;

/* 제목, 가격, 판매자 */
const ProductTitle = styled.h4`
  font-size: 16px;
  margin: 10px 0;
  color: #333;
`;

const Seller = styled.div`
  font-size: 14px;
  color: #777;
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

const CreateButton = styled(PaginationButton)`
  font-family: "Ownglyph_meetme-Rg", sans-serif;
  position: absolute;
  right: 0;
  background-color: #a2e4b8;

  &:hover {
    background-color: #6dbe92;
    color: white;
  }
`;

const PageNumber = styled.span`
  font-family: "Ownglyph_meetme-Rg", sans-serif;
  font-size: 18px;
  font-weight: bold;
  color: #727d73;
`;

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
  const { user } = useAuth();
  const [imageMap, setImageMap] = useState({});
  const DEFAULT_IMAGE = "src/assets/TalkMedia_i_2a4ebc04392c.png.png";
  const [regionMap, setRegionMap] = useState([]);
  const [walkCategory, setWalkCategory] = useState([]);

  useEffect(() => {
    getLocalCategory()
      .then(setRegionMap)
      .catch((error) => console.error("Fetching error:", error));
    getWalkCategory()
      .then(setWalkCategory)
      .catch((error) => console.error("Fetching error:", error));
  }, []);

  useEffect(() => {
    console.log("발생");
    if (!regionMap || Object.keys(regionMap).length === 0) return;
    fetch(API_POST_URL)
      .then((res) => res.json())
      .then((data) => {
        const postData = Object.values(data).map((item) => ({
          id: item.boardId,
          sellerUid: item.userId,
          regionSi: regionMap[item.localSi].name || "알 수 없음",
          regionGu:
            regionMap[item.localSi].gu[item.localGu].name || "알 수 없음",
          title: item.title,
          content: item.content,
          category: item.category,
          type: item.boardType,
          clickCnt: item.clickCount,
          reportCnt: item.reportCount,
          price: item.price || 0,
          nickname: item.nickname,
          seller: item.seller || "알 수 없음",
          regionDong: `${regionMap[item.localSi].name || ""} ${
            regionMap[item.localSi].gu[item.localGu].name || ""
          }`,
          image: item.image || "/no-image.png",
        }));
        console.log("데이터:", data);
        setPosts(postData);
        setFilteredPosts(postData);
        postData.forEach((post) => fetchImage(post.id));
      })
      .catch((err) => console.error("게시글 불러오기 오류:", err));
  }, [regionMap]);
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
  if (!walkCategory) return <div>... 로딩중</div>;

  return (
    <>
      <ListContainer>
        <ContentWrapper>
          {/* 사이드바 */}
          <Sidebar>
            <SideFilter
              selectedRegion={selectedRegion}
              setSelectedRegion={setSelectedRegion}
              selectedGu={selectedGu}
              setSelectedGu={setSelectedGu}
            />
            <SizeFilter
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              setCurrentPage={setCurrentPage}
            />
          </Sidebar>
          {/* 게시글 리스트 */}

          <ProductList>
            {displayedPosts.map((post) => {
              console.log(post);
              const opacity = user?.admin
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
                  <Seller>판매자: {post.nickname}</Seller>
                  <Seller>{post.regionDong}</Seller>
                  <Seller>{walkCategory[post.category]?.name}</Seller>
                  {user?.admin && (
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
