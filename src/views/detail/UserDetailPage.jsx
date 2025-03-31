import { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "../../hooks/useAuth";
import defaultProfile from "../../assets/basic.jpg";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const ContentWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 50px;
  padding: 20px;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  gap: 20px;

  img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
  }
  div {
    text-align: left;
  }
  h2 {
    margin: 10px 0 5px;
  }
  p {
    color: gray;
  }
`;

const ButtonSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ActionButton = styled.button`
  padding: 10px 15px;
  border: none;
  background: #00bfff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #007acc;
  }
`;

const BoardNav = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
`;

const BoardButton = styled.button`
  padding: 10px 15px;
  border: none;
  background: ${(props) => (props.isActive ? "#00bfff" : "#ddd")};
  color: ${(props) => (props.isActive ? "white" : "black")};
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #00bfff;
    color: white;
  }
`;

const BoardContent = styled.div`
  margin-top: 20px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
`;

const PostCard = styled.div`
  background: #fff6e0;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }

  img {
    width: 100px;
    height: 100px;
    border-radius: 10px;
    object-fit: cover;
  }

  h4 {
    font-size: 1rem;
    margin-top: 0.5rem;
    color: #3b2e1a;
  }
`;

const UserDetailPage = () => {
  // const [user, setUser] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const [selectedBoard, setSelectedBoard] = useState("community");
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);

  const API_POST_URL = "http://localhost:8087/api/board";

  useEffect(() => {
    fetch(API_POST_URL)
      .then((res) => res.json())
      .then((data) => {
        const formattedData = Object.values(data).map((item) => ({
          id: item.boardId,
          title: item.title,
          content: item.content,
          type: item.boardType,
        }));
        setPosts(formattedData);
      })
      .catch((err) => console.error("게시글 불러오기 오류:", err));
  }, []);

  const filteredPosts =
    selectedBoard === "mypet"
      ? pets
      : posts.filter((post) => {
          if (selectedBoard === "community") return post.type === 1;
          if (selectedBoard === "adoption") return post.type === 2;
          if (selectedBoard === "lost") return post.type === 3;
          if (selectedBoard === "pet") return post.type === 4;
          return [];
        });

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch("http://localhost:8087/api/pet/list", {
          credentials: "include", // 세션 쿠키 유지
        });
        const data = await response.json();
        setPets(data);
      } catch (error) {
        console.error("펫 정보 불러오기 실패:", error);
      }
    };

    fetchPets();
  }, []);

  return (
    <Container>
      {user ? (
        <ContentWrapper>
          <ProfileSection>
            <img src={user.profileImage || defaultProfile} alt="프로필" />
            <h2>{user.nickname || "익명"}</h2>
            <p>{user.email}</p>
            <ButtonSection>
              <ActionButton>버튼 1</ActionButton>
              <ActionButton onClick={() => navigate("/postUserPet")}>
                나의 펫 등록
              </ActionButton>
              <ActionButton>버튼 3</ActionButton>
            </ButtonSection>
          </ProfileSection>
        </ContentWrapper>
      ) : (
        <p>로그인이 필요합니다.</p>
      )}

      <BoardNav>
        {["community", "adoption", "lost", "pet", "mypet"].map((key) => (
          <BoardButton
            key={key}
            isActive={selectedBoard === key}
            onClick={() => setSelectedBoard(key)}
          >
            {key === "community"
              ? "산책 게시판"
              : key === "adoption"
              ? "나눔 게시판"
              : key === "lost"
              ? "알바 게시판"
              : key === "pet"
              ? "펫스타그램"
              : "나의 펫"}
          </BoardButton>
        ))}
      </BoardNav>

      <BoardContent>
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) =>
            selectedBoard === "mypet" ? (
              <PostCard key={post.petId}>
                <h4>{post.petName}</h4>
                <p>
                  {post.petType} - {post.petCategory}
                </p>
                <p>{post.petIntroduce}</p>
              </PostCard>
            ) : (
              <PostCard
                key={post.id}
                onClick={() => navigate(`/board/${post.id}`)}
              >
                <h4>{post.title}</h4>
                <p>{post.content}</p>
              </PostCard>
            )
          )
        ) : (
          <p>게시글이 없습니다.</p>
        )}
      </BoardContent>
    </Container>
  );
};

export default UserDetailPage;
