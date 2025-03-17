import { useNavigate } from "react-router-dom";
import styled from "styled-components";
const RouteBar = styled.div`
  background: gray;
`;
const RouteButton = styled.button`
  margin: 0.5rem;
  font-weight: bold;
  color: #333;
`;
function Header() {
    const navigate = useNavigate();
    return (
        <>
        {/* 
        components 폴더에서는 공통적으로 사용되는 컴포넌트들을 모아놓습니다.
        이 바는 작업 할 때 편하게 하라고 만든 바입니다. 삭제해도 됩니다. 
        */}
        <RouteBar>
            <RouteButton onClick={() => navigate ("/")}>메인 페이지</RouteButton>
            <RouteButton onClick={() => navigate ("/login")}>로그인 페이지</RouteButton>
            <RouteButton onClick={() => navigate ("/signup")}>회원가입 페이지</RouteButton>
        </RouteBar>
      </>
    )
}
export default Header