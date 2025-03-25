import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const LeftImage = styled.img`
  position: absolute;
  top: -20px;
  left: 90px;
  width: 200px;
  height: auto;
  z-index: 5;
  &:hover {
    transform: scale(1.1);
  }
`;

const AuthButton = styled.button`
  padding: 15px 30px; // 여백을 반으로 줄임
  font-size: 15px; // 폰트 크기를 줄임
  background-color: #00bfff;
  color: black;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background-color: #007acc;
  }
`;

const AuthButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px; // 버튼 간 간격을 줄임
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px;
  z-index: 10;
`;

const BoardButtonWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column; // 이미지와 텍스트를 세로로 배치
  justify-content: center;
  align-items: center;
  width: 120px; // 네모 박스의 너비를 줄임
  height: 120px; // 높이를 줄임
  margin: 8px; // 여백을 줄임
  padding: 0; // 불필요한 내부 여백을 제거
  border: 2px solid #00bfff; // 네모 박스의 경계선
  border-radius: 8px; // 박스의 모서리 둥글게
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); // 부드러운 그림자 추가
  transition: transform 0.3s ease, border-color 0.3s, box-shadow 0.3s; // 호버 시 효과 추가
  &:hover {
    transform: scale(1.1); // 호버 시 살짝 커지게
    border-color: #007acc; // 호버 시 경계선 색상 변경
    box-shadow: 0px 4px 8px rgba(0, 122, 204, 0.2); // 호버 시 그림자 색상 변경
  }
`;

const BoardButtonImage = styled.img`
  width: 80%; // 이미지 크기를 줄임
  height: auto;
  margin-bottom: 5px; // 이미지와 텍스트 간 간격 설정
  cursor: pointer; // 이미지 클릭 가능하도록 설정
  z-index: 1; // 이미지가 텍스트 위에 표시되도록 설정
  border-radius: 8px; // 이미지 모서리 둥글게
  transition: transform 0.3s ease; // 이미지 크기 변화 효과 추가
  &:hover {
    transform: scale(1.1); // 이미지가 살짝 커지도록 설정
  }
`;

const BoardButtonText = styled.button`
  font-size: 14px; // 텍스트 크기를 줄임
  background-color: transparent;
  color: black;
  border: none; // 텍스트 버튼의 경계선 제거
  cursor: pointer;
  padding: 4px; // 텍스트 버튼 여백을 줄임
  transition: color 0.3s, border-color 0.3s;

  &:hover {
    color: #007acc; // 호버 시 텍스트 색상 파란색으로 변경
  }
`;
const BoardButtonContainer = styled.div`
  display: flex;
  gap: 20px; // 버튼 간 간격을 줄임
  justify-content: center;
  margin-top: 20px; // 상단 마진을 줄임
  flex-wrap: wrap;
`;

const ExampleComponent = () => {
  const navigate = useNavigate();

  const handleImageClick = (boardPath) => {
    navigate(boardPath);
  };

  const handleTextClick = (boardPath) => {
    navigate(boardPath);
  };

  return (
    <div>
      <LeftImage
        src="src/assets/TalkMedia_i_2a4ebc04392c.png.png"
        alt="left-image"
        onClick={() => handleImageClick("/")}
      />
      <AuthButtonContainer>
        <AuthButton onClick={() => navigate("/login")}>로그인</AuthButton>
        <AuthButton onClick={() => navigate("/signup")}>회원가입</AuthButton>
      </AuthButtonContainer>
      <BoardButtonContainer>
        <BoardButtonWrapper onClick={() => navigate("/walk")}>
          <BoardButtonImage
            src="src/assets/KakaoTalk_20250320_191922332.jpg"
            onClick={() => handleImageClick("/walk")}
          />
          <BoardButtonText onClick={() => handleTextClick("/walk")}>
            산책 게시판
          </BoardButtonText>
        </BoardButtonWrapper>

        <BoardButtonWrapper onClick={() => navigate("/sell")}>
          <BoardButtonImage
            src="src/assets/KakaoTalk_20250320_183321982.jpg"
            onClick={() => handleImageClick("/sell")}
          />
          <BoardButtonText onClick={() => handleTextClick("/sell")}>
            나눔 게시판
          </BoardButtonText>
        </BoardButtonWrapper>

        <BoardButtonWrapper onClick={() => navigate("/hire")}>
          <BoardButtonImage
            src="src/assets/KakaoTalk_20250320_184745054.jpg"
            onClick={() => handleImageClick("/hire")}
          />
          <BoardButtonText onClick={() => handleTextClick("/hire")}>
            알바 게시판
          </BoardButtonText>
        </BoardButtonWrapper>
        <BoardButtonWrapper onClick={() => navigate("/petshow")}>
          <BoardButtonImage
            src="src/assets/KakaoTalk_20250320_174016642.jpg"
            onClick={() => handleImageClick("/petshow")}
          />
          <BoardButtonText onClick={() => handleTextClick("/petshow")}>
            게스타그램
          </BoardButtonText>
        </BoardButtonWrapper>
      </BoardButtonContainer>
    </div>
  );
};

export default ExampleComponent;
