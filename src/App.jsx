import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

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
import EditWalkPage from "./views/edit/EditWalkPage";
import EditHirePage from "./views/edit/EditHirePage";
import EditTradePage from "./views/edit/EditTradePage";
import Room from "./pages/Room";
import UserDetailPage from "./views/detail/UserDetailPage";

import { useState } from "react";
import { useEffect } from "react";
import { createContext } from "react";
import Header from "./components/Header";

export const AuthContext = createContext(null);

import PostPet from "./views/post/postPet";
import PetstarDetailPage from "./views/detail/PetstarDetailPage";
import PostUserPet from "./views/post/PostUserPet";
import ViewMap from "./views/map/ViewMap";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  // const value = useMemo(() => ({ user }), [user]);
  const navigate = useNavigate();

  const checkLoginStatus = async () => {
    try {
      const response = await fetch("http://localhost:8087/api/user/session", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        // 기존 user와 값이 다를 때만 업데이트
        if (JSON.stringify(user) !== JSON.stringify(data)) {
          setUser(data);
        }
        console.log("세션 체크" + user);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error("로그인 상태 확인 중 오류 발생:", error);
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  const invalidSession = async () => {
    try {
      const response = await fetch("http://localhost:8087/api/user/logout", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        console.log("로그아웃 성공");
        setIsLoggedIn(false);
        setUser(null);
        navigate("/");
      } else {
        console.log("에러발생");
      }
    } catch (error) {
      console.error("로그인 상태 확인 중 오류 발생:", error);
    }
  };

  // 처음 컴포넌트가 임포트 될 때 유저세션을 가져오는 메서드
  useEffect(() => {
    checkLoginStatus();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Header handleLogout={invalidSession} isLoggedIn={isLoggedIn} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/:postId" element={<DetailPage />} />
        <Route path="/Detail" element={<DetailPage />} />
        <Route path="/walk" element={<WalkContents />} />
        <Route path="/sell" element={<SellContents />} />
        <Route path="/hire" element={<JobContents />} />
        <Route path="/postTrade" element={<PostTrade />} />
        <Route path="/postWalk" element={<PostWalk />} />
        <Route path="/postPet" element={<PostPet />} />
        <Route path="/postHire" element={<PostHire />} />
        <Route path="/petshow" element={<PetShowcasePage />} />
        <Route path="/trade/:postId" element={<TradeDetailPage />} />
        <Route path="/hire/:postId" element={<HireDetailPage />} />
        <Route path="/editWalk/:postId" element={<EditWalkPage />} />
        <Route path="/edithire/:postId" element={<EditHirePage />} />
        <Route path="/edittrade/:postId" element={<EditTradePage />} />
        <Route path="/room/:postId" element={<Room />} />
        <Route path="/my" element={<UserDetailPage />} />
        <Route path="/petstarDetail/:postId" element={<PetstarDetailPage />} />
        <Route path="/postUserPet" element={<PostUserPet />} />
        <Route path="/postpet" element={<PostUserPet />} />
        <Route path="/viewmap/:lat/:lng" element={<ViewMap />} />
      </Routes>
      <Footer />
    </AuthContext.Provider>
  );
}
export default App;
