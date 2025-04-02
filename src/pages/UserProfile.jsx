import { useState, useEffect } from "react";
import styled from "styled-components";
import defaultProfile from "../assets/basic.jpg";
import { useNavigate, useParams } from "react-router-dom";

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
    font-family: "Ownglyph_meetme-Rg", sans-serif;
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
  font-family: "Ownglyph_meetme-Rg", sans-serif;
  padding: 10px 15px;
  border: none;
  background: ${(props) => (props.isActive ? "#a2e4b8" : "#a2e4b8")};
  color: ${(props) => (props.isActive ? "white" : "black")};
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #6dbe92;
    color: white;
  }
`;

const BoardContent = styled.div`
  margin-top: 20px;
  padding: 15px;
  background: #a2e4b8;
  border-radius: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
`;

const PostCard = styled.div`
  font-family: "Ownglyph_meetme-Rg", sans-serif;
  background: #ecebde;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }

  h4 {
    font-family: "Ownglyph_meetme-Rg", sans-serif;
    font-size: 1rem;
    margin-top: 0.5rem;
    color: #3b2e1a;
  }
`;

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState("community");
  const [posts, setPosts] = useState([]);

  const API_POST_URL = `http://localhost:8087/api/board/user/${userId}`;
  const API_USER_URL = `http://localhost:8087/api/user/info/${userId}`;

  useEffect(() => {
    fetch(API_USER_URL)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("유저 불러오기 실패:", err));

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
      .catch((err) => console.error("게시글 불러오기 실패:", err));
  }, [userId]);

  const filteredPosts = posts.filter((post) => {
    if (selectedBoard === "community") return post.type === 1;
    if (selectedBoard === "adoption") return post.type === 2;
    if (selectedBoard === "lost") return post.type === 3;
    if (selectedBoard === "pet") return post.type === 4;
    return [];
  });

  const getBoardPath = (type, id) => {
    switch (type) {
      case 1:
        return `/${id}`;
      case 2:
        return `/trade/${id}`;
      case 3:
        return `/hire/${id}`;
      case 4:
        return `/petstagram/${id}`;
      default:
        return `/board/${id}`;
    }
  };

  const getProfileImage = (img) => {
    return img && img !== "null" && img !== "" ? img : defaultProfile;
  };

  return (
    <Container>
      {user && (
        <ContentWrapper>
          <ProfileSection>
            <img src={getProfileImage(user.profileImage)} alt="프로필" />
            <div>
              <h2>{user.nickname || "익명"}</h2>
              <p>{user.email}</p>
            </div>
          </ProfileSection>
        </ContentWrapper>
      )}

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
              : "펫스타그램"}
          </BoardButton>
        ))}
      </BoardNav>

      <BoardContent>
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              onClick={() => navigate(getBoardPath(post.type, post.id))}
            >
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

export default UserProfile;
