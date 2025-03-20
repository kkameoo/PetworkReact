import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

// 이미지 스타일
export const LeftImage = styled.img`
  position: absolute;  // 위치를 절대적으로 설정
  top: -30px;  // 상단에서 20px 떨어지게 위치 설정
  left: -30px;  // 왼쪽 끝에 배치
  width: 200px;
  height: auto;  // 비율에 맞춰 높이 자동 조정
  z-index: 5;  // 다른 요소들보다 위에 배치되도록 설정
`;

// 게시판 버튼 스타일
export const BoardButton = styled.button`
  padding: 10px 10px;  // 버튼의 패딩
  font-size: 25px;  // 버튼의 폰트 크기
  background-color: #00bfff;  // 배경색
  color: white;  // 글자색
  border: none;  // 테두리 없음
  border-radius: 5px;  // 둥근 모서리
  cursor: pointer;  // 마우스 커서가 포인터로 변함
  transition: 0.3s;  // 호버 시 효과
  &:hover {
    background-color: #007acc;  // 호버 시 색상 변경
  }
`;

// 로그인 및 회원가입 버튼 스타일
export const AuthButton = styled.button`
  padding: 15px 30px;  // 더 큰 패딩
  font-size: 15px;  // 더 큰 폰트 크기
  background-color: #4CAF50;  // 다른 색상으로 배경 설정
  color: white;  // 글자색
  border: none;  // 테두리 없음
  border-radius: 8px;  // 둥근 모서리
  cursor: pointer;  // 마우스 커서가 포인터로 변함
  transition: 0.3s;  // 호버 시 효과
  &:hover {
    background-color: #45a049;  // 호버 시 색상 변경
  }
`;

// 게시판 버튼들을 감싸는 컨테이너 (가운데 정렬)
export const BoardButtonContainer = styled.div`
  display: flex;  // 버튼들을 가로로 배치
  gap: 25px;  // 버튼 간의 간격
  justify-content: center;  // 버튼들을 가운데 정렬
  margin-top: 30px;  // 상단 여백 (로그인, 회원가입 버튼 아래에 배치될 수 있게 조정)
  flex-wrap: wrap;  // 화면 크기에 맞게 버튼들을 줄 바꿈 가능하게 함
`;

// 로그인, 회원가입 버튼들을 감싸는 컨테이너 (오른쪽 끝 정렬)
export const AuthButtonContainer = styled.div`
  display: flex;  // 버튼들을 가로로 배치
  justify-content: flex-end;  // 버튼들을 오른쪽 끝에 정렬
  gap: 15px;  // 버튼 간의 간격
  position: absolute;  // 화면 상단에 고정되도록 설정
  top: 0;  // 화면 상단에 위치
  right: 0;  // 화면 오른쪽 끝에 위치
  padding: 10px;  // 상단, 오른쪽 여백
  z-index: 10;  // 다른 요소보다 위로 올리기 위해 z-index 설정
`;

const ExampleComponent = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* 왼쪽 끝에 이미지를 배치 */}
      <LeftImage src="src/assets/TalkMedia_i_2a4ebc04392c.png.png" alt="left-image" />

      {/* 로그인과 회원가입 버튼을 오른쪽 상단에 배치 */}
      <AuthButtonContainer>
        <AuthButton onClick={() => navigate("/login")}>로그인</AuthButton>
        <AuthButton onClick={() => navigate("/signup")}>회원가입</AuthButton>
      </AuthButtonContainer>

      {/* 게시판 버튼들을 가운데 정렬 */}
      <BoardButtonContainer>
        <BoardButton onClick={() => navigate("/walk-board")}>산책 게시판</BoardButton>
        <BoardButton onClick={() => navigate("/share-board")}>나눔 게시판</BoardButton>
        <BoardButton onClick={() => navigate("/part-time-board")}>알바 게시판</BoardButton>
        <BoardButton onClick={() => navigate("/instagram")}>게스타그램</BoardButton>
      </BoardButtonContainer>
    </div>
  );
};

export default ExampleComponent;
