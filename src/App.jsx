import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Header from "./components/Header";
import DetailPage from "./views/detail/DetailPage";
import Board from "./pages/Board";
import PostWalk from "./views/post/PostWalk";

function App() {
  return (
    <>
      <Header />
      {/* 맨 처음 기본 페이지는 Home으로 되있습니다.
      추가 페이지를 작업하시려면 pages에서 jsx파일을 생성후 route 관리를 해주세요. */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/:postId" element={<DetailPage />} />
        <Route path="/Detail" element={<DetailPage />} />
        <Route path="/board" element={<Board />} />
        <Route path="/post" element={<PostWalk />} />
      </Routes>
    </>
  );
}

export default App;
