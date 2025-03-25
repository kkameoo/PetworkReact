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
import EditWalkPage from "./views/edit/EditWalkPage";
import EditHirePage from "./views/edit/EditHirePage";
import EditTradePage from "./views/edit/EditTradePage";
import Room from "./pages/Room";
import UserDetailPage from "./views/detail/UserDetailPage";
import PostPet from "./views/post/postPet";

function App() {
  return (
    <>
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
        <Route path="/postPet" element={<PostPet />} />
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
    </>
  );
}

export default App;
