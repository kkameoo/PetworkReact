import { Route, Routes } from "react-router-dom";
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
import { useContext } from "react";
import { useMemo } from "react";
import Header from "./components/Header";

const AuthContext = createContext(null);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const value = useMemo(() => ({ user }), [user]);

  useEffect(() => {
    checkLoginStatus();
    // console.log("현재 접속 중인 유저 : " + user);
  }, []);

  const checkLoginStatus = async () => {
    try {
      const response = await fetch("http://localhost:8087/api/user/session", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        setUser(data);
        // onAuthChange(true, data); // 로그인상태 전달
      } else {
        setIsLoggedIn(false);
        setUser(null);
        // onAuthChange(false, null); // 로그아웃상태 전달
      }
    } catch (error) {
      console.error("로그인 상태 확인 중 오류 발생:", error);
      setIsLoggedIn(false);
      setUser(null);
      // onAuthChange(false, null);
    }
  };

  return (
    <AuthContext.Provider value={value}>
      <Header />
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
        <Route path="/postHire" element={<PostHire />} />
        <Route path="/petshow" element={<PetShowcasePage />} />
        <Route path="/trade/:postId" element={<TradeDetailPage />} />
        <Route path="/hire/:postId" element={<HireDetailPage />} />
        <Route path="/editWalk/:postId" element={<EditWalkPage />} />
        <Route path="/edithire/:postId" element={<EditHirePage />} />
        <Route path="/edittrade/:postId" element={<EditTradePage />} />
        <Route path="/room" element={<Room />} />
        <Route path="/my" element={<UserDetailPage />} />
      </Routes>
      <Footer />
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
export default App;
