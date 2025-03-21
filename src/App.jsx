import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Header from "./components/Header";
import DetailPage from "./views/detail/DetailPage";
import PostWalk from "./views/post/PostWalk";
import Footer from "./components/Footer";
import PetShowcasePage from "./views/main/PetShowcasePage";
import PostTrade from "./views/post/PostTrade";
import PostHire from "./views/post/postHire";
import MainPage from "./views/main/MainPage";
import WalkContents from "./views/main/WalkContents";
import SellContents from "./views/main/SellContents";
import JobContents from "./views/main/JobContents";
import TradeDetailPage from "./views/detail/TradeDetailPage";
import HireDetailPage from "./views/detail/HireDetailPage";

function App() {
  return (
    <>
      <Header />
      {/* 맨 처음 기본 페이지는 Home으로 되있습니다.
      추가 페이지를 작업하시려면 pages에서 jsx파일을 생성후 route 관리를 해주세요. */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/walk/:postId" element={<DetailPage />} />
        <Route path="/Detail" element={<DetailPage />} />
        <Route path="/walk" element={<WalkContents />} />
        <Route path="/sell" element={<SellContents />} />
        <Route path="/hire" element={<JobContents />} />
        <Route path="/postTrade" element={<PostTrade />} />
        <Route path="/postWalk" element={<PostWalk />} />
        <Route path="/postHire" element={<PostHire />} />
        <Route path="/petshow" element={<PetShowcasePage />} />
        <Route path="/trade/:postId" element={<TradeDetailPage />} />
        <Route path="/hire/:postId" element={<HireDetailPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
