import { Route, Routes, useNavigate } from "react-router-dom"
import Home from "./pages/Home"
import styled from "styled-components";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

const RouteBar = styled.div`
  background: gray;
`;

const RouteButton = styled.button`
  margin: 0.5rem;
  font-weight: bold;
  color: #333;
`;

function App() {
  const navigate = useNavigate();

  return (
    <>
      {/* 작업 할 때 편하게 하라고 만든 바입니다. */}
      <RouteBar>
      <RouteButton onClick={() => navigate ("/")}>메인 페이지</RouteButton>
      <RouteButton onClick={() => navigate ("/login")}>로그인 페이지</RouteButton>
      <RouteButton onClick={() => navigate ("/signup")}>회원가입 페이지</RouteButton>
      </RouteBar>
      {/* 맨 처음 기본 페이지는 Home으로 되있습니다.
      추가 페이지를 작업하시려면 pages에서 jsx파일을 생성후 route 관리를 해주세요. */}
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<SignUp/>} />
      </Routes>
    </>
  )
}

export default App
