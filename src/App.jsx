import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import GlobalStyle from "../public/data/GlobalStyle";

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
import UserProfile from "./pages/UserProfile";
import ChatListPage from "./views/detail/ChatListPage";

import { useState } from "react";
import { useEffect } from "react";
import { createContext } from "react";
import Header from "./components/Header";

export const AuthContext = createContext(null);

import PostPet from "./views/post/postPet";
import PetstarDetailPage from "./views/detail/PetstarDetailPage";
import PostUserPet from "./views/post/PostUserPet";
import ViewMap from "./views/map/ViewMap";
import { connectSocket } from "./hooks/socket";
import SideFilter from "./components/SideFilter";
import UserCheck from "./components/UserCheck";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // const checkLoginStatus = async () => {
  //   try {
  //     const response = await fetch(
  //       `${import.meta.env.VITE_API_URL}/api/user/session`,
  //       {
  //         method: "GET",
  //         credentials: "include",
  //       }
  //     );

  //     if (response.ok) {
  //       const data = await response.json();
  //       setIsLoggedIn(true);
  //       // 기존 user와 값이 다를 때만 업데이트
  //       if (JSON.stringify(user) !== JSON.stringify(data)) {
  //         setUser(data);
  //       }
  //       console.log("세션 체크" + user);
  //     } else {
  //       setIsLoggedIn(false);
  //       setUser(null);
  //     }
  //   } catch (error) {
  //     console.error("로그인 상태 확인 중 오류 발생:", error);
  //     setIsLoggedIn(false);
  //     setUser(null);
  //   }
  // };

  const checkLoginStatus = async () => {
    if (localStorage.getItem("user") == null) {
      console.log("비로그인 상태");
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/token`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: localStorage.getItem("user"),
        }
      );

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

  // const invalidSession = async () => {
  //   try {
  //     const response = await fetch(
  //       `${import.meta.env.VITE_API_URL}/api/user/logout`,
  //       {
  //         method: "GET",
  //         credentials: "include",
  //       }
  //     );

  //     if (response.ok) {
  //       console.log("로그아웃 성공");
  //       setIsLoggedIn(false);
  //       setUser(null);
  //       navigate("/");
  //     } else {
  //       console.log("에러발생");
  //     }
  //   } catch (error) {
  //     console.error("로그인 상태 확인 중 오류 발생:", error);
  //   }
  // };

  const invalidSession = async () => {
    //  try {
    //    const response = await fetch(
    //     `${import.meta.env.VITE_API_URL}/api/user/logout`,
    //     {
    //       method: "GET",
    //       credentials: "include",
    //     }
    //   );
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    window.location.reload();

    //   if (response.ok) {
    //     console.log("로그아웃 성공");
    //     setIsLoggedIn(false);
    //     setUser(null);
    //     navigate("/");
    //   } else {
    //     console.log("에러발생");
    //   }
    // } catch (error) {
    //   console.error("로그인 상태 확인 중 오류 발생:", error);
    // }
  };

  const getAlarms = async () => {
    // 로그인 후 저장된 알람 불러오기
    fetch(`${import.meta.env.VITE_API_URL}/alarm/list/byuser/` + user.userId)
      .then((res) => res.json())
      // .then((data) => setNotifications(data))
      .then((data) => {
        console.log("불러온 알림:", data);
        setNotifications(data);
      })
      .catch((err) => console.error("알림 불러오기 실패", err));
  };

  // 처음 컴포넌트가 임포트 될 때 유저세션을 가져오는 메서드
  useEffect(() => {
    // checkLoginStatus();
    if (user) {
      setIsLoggedIn(true);
      // console.log("여기");
      connectSocket(user.userId, (noti) => {
        // console.log("abc");
        setNotifications((prev) => [noti, ...prev]);
      });
      getAlarms();
    }
  }, [user]);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Header
        handleLogout={invalidSession}
        isLoggedIn={isLoggedIn}
        notifications={notifications}
        setNotifications={setNotifications}
        getAlarms={getAlarms}
      />
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
        <Route path="/viewmap/:postId/:lat/:lng" element={<ViewMap />} />
        <Route path="/profile/:userId" element={<UserProfile />} />
        <Route path="/chatlist" element={<ChatListPage />} />
      </Routes>
      <Footer />
    </AuthContext.Provider>
  );
}
export default App;
