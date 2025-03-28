import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { connectSocket } from "../hooks/socket";

const HeaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: white;
  z-index: 1000;
  padding: -20px 0;
  display: flex;
  justify-content: center;
  /* box-shadow: ; */
`;

const LeftImage = styled.img`
  position: fixed;
  top: 10px;
  left: 100px;
  width: 100px;
  height: auto;
  z-index: 5;
  &:hover {
    transform: scale(1.1);
  }
`;

const AuthButton = styled.button`
  padding: 15px 30px; // 여백을 반으로 줄임
  font-size: 15px; // 폰트 크기를 줄임
  background-color: #a2e4b8;
  color: black;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background-color: #6dbe92;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    transform: translateY(-1px);
  }
`;

const AuthButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px; // 버튼 간 간격을 줄임
  position: absolute;
  top: 18px;
  right: 70px;
  padding: 10px;
  z-index: 10;
`;
const BellIcon = styled.img`
  width: 30px;
  height: 30px;
`;

const BoardButtonWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column; // 이미지와 텍스트를 세로로 배치
  justify-content: center;
  align-items: center;
  width: 100px; // 네모 박스의 너비를 줄임
  height: 100px; // 높이를 줄임
  margin: 8px; // 여백을 줄임
  padding: 0; // 불필요한 내부 여백을 제거
  border: 2px solid #a2e4b8; // 네모 박스의 경계선
  border-radius: 8px; // 박스의 모서리 둥글게
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); // 부드러운 그림자 추가
  transition: transform 0.3s ease, border-color 0.3s, box-shadow 0.3s; // 호버 시 효과 추가
  &:hover {
    transform: scale(1.1); // 호버 시 살짝 커지게
    border-color: #6dbe92; // 호버 시 경계선 색상 변경
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
  /* &:hover {
    transform: scale(1.1); // 이미지가 살짝 커지도록 설정
  } */
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
    color: #6dbe92; // 호버 시 텍스트 색상 파란색으로 변경
  }
`;
const BoardButtonContainer = styled.div`
  display: flex;
  gap: 20px; // 버튼 간 간격을 줄임
  justify-content: center;
  margin-top: 1px; // 상단 마진을 줄임
  flex-wrap: wrap;
`;

function Header({ handleLogout, isLoggedIn }) {
  const navigate = useNavigate();

  // 로그인 상태관리
  const { user } = useAuth();

  // 로그인 상태 변경시 호출할 함수 (상태 관리)
  const onAuthChange = (loggedIn, user) => {
    // 로그인 상태나 사용자 정보 변경
    console.log(loggedIn ? "로그인 상태" : "로그아웃 상태", user);
  };

  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    if (user) {
      connectSocket(user.userId, (noti) => {
        setNotifications((prev) => [noti, ...prev]);
      });
      // 로그인 후 저장된 알람 불러오기
      fetch(`http://localhost:8087/alarm/list?userId=${user.userId}`)
        .then((res) => res.json())
        // .then((data) => setNotifications(data))
        .then((data) => {
          console.log("불러온 알림:", data);
          setNotifications(data);
        })
        .catch((err) => console.error("알림 불러오기 실패", err));
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleImageClick = (boardPath) => {
    navigate(boardPath);
  };

  const handleTextClick = (boardPath) => {
    navigate(boardPath);
  };

  return (
    <HeaderContainer>
      <div>
        <LeftImage
          src="src/assets/TalkMedia_i_2a4ebc04392c.png.png"
          alt="left-image"
          onClick={() => handleImageClick("/")}
        />
        <AuthButtonContainer>
          {/* 로그인 여부에 따라 다른 버튼을 렌더링 */}
          {isLoggedIn ? (
            <>
              <AuthButton onClick={() => handleLogout()}>로그아웃</AuthButton>
              <AuthButton onClick={() => navigate("/my")}>
                마이페이지
              </AuthButton>
            </>
          ) : (
            <>
              {/* <AuthButton onClick={handleLoginClick}>로그인</AuthButton> */}
              {/* <AuthButton onClick={handleLogin}>로그인</AuthButton> */}
              <AuthButton onClick={() => navigate("/login")}>로그인</AuthButton>
              <AuthButton onClick={() => navigate("/signup")}>
                회원가입
              </AuthButton>
            </>
          )}
        </AuthButtonContainer>
        {/* <AuthButtonContainer>
        <AuthButton onClick={() => navigate("/login")}>로그인</AuthButton>
        <AuthButton onClick={() => navigate("/signup")}>회원가입</AuthButton>
      </AuthButtonContainer> */}
        {/* :종: 알림 벨 아이콘 + 드롭다운 */}
        <div
          style={{
            position: "absolute",
            top: 38,
            right: 350,
            cursor: "pointer",
          }}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <BellIcon src="src/assets/bell.png" />
          {notifications.length > 0 && <span style={{ color: "red" }}> ●</span>}
        </div>
        {dropdownOpen && (
          <div
            ref={dropdownRef}
            style={{
              position: "absolute",
              top: "60px",
              right: "100px",
              width: "250px",
              background: "white",
              border: "1px solid #ddd",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              borderRadius: "8px",
              zIndex: 999,
            }}
          >
            <ul style={{ listStyle: "none", padding: "1rem", margin: 0 }}>
              {notifications.length === 0 ? (
                <li style={{ color: "#888" }}>알림이 없습니다</li>
              ) : (
                notifications.map((n, i) => (
                  <li
                    key={i}
                    style={{
                      padding: "0.5rem 0",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {n.content}
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
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
    </HeaderContainer>
  );
}

export default Header;
