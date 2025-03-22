import { useState, useEffect } from "react";
import styled from "styled-components";

const UserDetailPage = () => {
  const [user] = useState({
    nickname: "멍멍이아빠",
    email: "doglover@example.com",
    profileImage:
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2F20121114_263%2Fbarun28_1352881028492HBIhF_JPEG%2F%25BF%25B9%25BB%25DB%25B0%25AD%25BE%25C6%25C1%25F6%25C0%25CC%25B9%25CC%25C1%25F6_%25284%2529.jpg&type=sc960_832",
  });

  const [selectedBoard, setSelectedBoard] = useState("community");
  const [posts, setPosts] = useState([]);

  const API_POST_URL = "http://localhost:8087/api/board";

  useEffect(() => {
    fetch(API_POST_URL)
      .then((res) => res.json())
      .then((data) => {
        const formattedData = Object.values(data).map((item) => ({
          id: item.boardId,
          title: item.title,
          content: item.content,
          type: item.boardType, // 1: 산책, 2: 나눔, 3: 알바, 4: 펫
        }));
        setPosts(formattedData);
      })
      .catch((err) => console.error("게시글 불러오기 오류:", err));
  }, []);

  const filteredPosts = posts.filter((post) => {
    if (selectedBoard === "community") return post.type === 1;
    if (selectedBoard === "adoption") return post.type === 2;
    if (selectedBoard === "lost") return post.type === 3;
    if (selectedBoard === "pet") return post.type === 4;
    return [];
  });

  return (
    <Container>
      <ProfileSection>
        <img src={user.profileImage} alt="프로필" />
        <h2>{user.nickname}</h2>
        <p>{user.email}</p>
      </ProfileSection>

      <BoardNav>
        {["community", "adoption", "lost", "pet"].map((key) => (
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
              : "펫 게시판"}
          </BoardButton>
        ))}
      </BoardNav>

      <BoardContent>
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostCard key={post.id}>
              <h4>{post.title}</h4>
              <p>{post.content}</p>
            </PostCard>
          ))
        ) : (
          <p>게시글이 없습니다.</p>
        )}
      </BoardContent>
    </Container>
  );
};

export default UserDetailPage;

const Container = styled.div`
  max-width: 600px;
  margin: 20px auto;
  text-align: center;
`;

const ProfileSection = styled.div`
  img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
  }
  h2 {
    margin: 10px 0 5px;
  }
  p {
    color: gray;
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
