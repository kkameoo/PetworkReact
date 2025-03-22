import { useState } from "react";
import styled from "styled-components";

const UserDetailPage = () => {
  const [user] = useState({
    nickname: "멍멍이아빠",
    email: "doglover@example.com",
    profileImage:
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2F20121114_263%2Fbarun28_1352881028492HBIhF_JPEG%2F%25BF%25B9%25BB%25DB%25B0%25AD%25BE%25C6%25C1%25F6%25C0%25CC%25B9%25CC%25C1%25F6_%25284%2529.jpg&type=sc960_832",
  });

  const [selectedBoard, setSelectedBoard] = useState("community");

  const boardData = {
    community: <BoardContent>커뮤니티 게시판 내용</BoardContent>,
    adoption: <BoardContent>입양 정보 게시판 내용</BoardContent>,
    lost: <BoardContent>실종 신고 게시판 내용</BoardContent>,
  };

  return (
    <Container>
      <ProfileSection>
        <img src={user.profileImage} alt="프로필" />
        <h2>{user.nickname}</h2>
        <p>{user.email}</p>
      </ProfileSection>

      <BoardNav>
        {Object.keys(boardData).map((key) => (
          <BoardButton
            key={key}
            isActive={selectedBoard === key}
            onClick={() => setSelectedBoard(key)}
          >
            {key === "community"
              ? "커뮤니티"
              : key === "adoption"
              ? "입양 정보"
              : "실종 신고"}
          </BoardButton>
        ))}
      </BoardNav>

      {boardData[selectedBoard] || (
        <BoardContent>게시판을 선택하세요</BoardContent>
      )}
    </Container>
  );
};

export default UserDetailPage;

const Container = styled.div`
  max-width: 500px;
  margin: 20px auto;
  text-align: center;
`;

const ProfileSection = styled.div`
  img {
    width: 100px;
    height: 100px;
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
`;
