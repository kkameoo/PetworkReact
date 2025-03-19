import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const DetailPage = () => {
  const { postId } = useParams(); // URL에서 ID 가져오기
  const navigate = useNavigate();

  const [newPost, setNewPost] = useState(null); // 게시글 상세 데이터
  const [user, setUser] = useState(null); // 로그인 유저 정보
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부

  // 로그인 상태 확인
  //   const checkLoginStatus = async () => {
  //     try {
  //       const response = await fetch("http://localhost:8087/api/user/session", {
  //         method: "GET",
  //         credentials: "include",
  //       });

  //       if (response.ok) {
  //         const data = await response.json();
  //         setIsLoggedIn(true);
  //         setUser(data);
  //       } else {
  //         setIsLoggedIn(false);
  //       }
  //     } catch (error) {
  //       console.error("로그인 상태 확인 중 오류:", error);
  //       setIsLoggedIn(false);
  //     }
  //   };

  // 게시글 상세 데이터 가져오기
  const fetchPostDetail = async () => {
    try {
      const response = await fetch(`http://localhost:8087/api/board/${postId}`);
      const data = await response.json();

      const formattedDateTime = data.upd_date
        ? new Date(data.upd_date)
            .toISOString()
            .replace("T", " ")
            .substring(0, 19)
        : "날짜 없음";

      const postData = {
        id: data.boardId,
        sellerUid: data.userId,
        regionSi: data.localSi,
        regionGu: data.localGu,
        title: data.title,
        image: data.post_photo, // 이미지 필드 보완
        content: data.content,
        category: data.category,
        type: data.boardType,
        clickCnt: data.clickCount,
        reportCnt: data.reportCount,
        updateTime: formattedDateTime,
        seller: data.nickname,
      };
      console.log(data);
      setNewPost(postData);
    } catch (error) {
      console.error("상세 데이터 불러오기 오류:", error);
    }
  };

  // 뒤로가기
  const onBack = () => {
    navigate("/");
  };

  useEffect(() => {
    // checkLoginStatus();
    fetchPostDetail();
  }, [postId]);

  if (!newPost) return <div>로딩 중...</div>;

  return (
    <>
      <div className="detail-product-detail">
        <button onClick={onBack} className="detail-back-button"></button>

        <div className="detail-product-body">
          <div className="detail-product-left">
            <img
              src={newPost.image || "/images/default.jpg"}
              alt={newPost.title}
              className="detail-product-image"
            />

            <div className="detail-seller-info">
              <div className="detail-seller-left">
                <img src="/images/user.png" alt="판매자 이미지" />
                <div>
                  <p className="detail-nickname">{newPost.seller}</p>
                  <p className="detail-location">
                    {newPost.regionSi} {newPost.regionGu}
                  </p>
                </div>
                {isLoggedIn && user && (
                  <ReportUser postId={postId} userId={user.uid} />
                )}
              </div>
            </div>
          </div>

          <div className="detail-product-right">
            <h2 className="detail-product-title">{newPost.title}</h2>
            <p className="detail-product-category">
              {newPost.category} | {newPost.updateTime}
            </p>
            <p className="detail-product-description">{newPost.content}</p>

            {isLoggedIn && user && user.uid !== newPost.sellerUid && (
              <UserNegoChat
                sellerUid={newPost.sellerUid}
                user_id={user.uid}
                post={newPost}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailPage;
