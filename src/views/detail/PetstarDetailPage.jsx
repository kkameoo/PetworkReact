import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";

const ProductDetailWrapper = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 50px; /* 게시물과 댓글 사이 간격 */
`;

const DetailWrapper = styled.div`
  width: 1600px;
  margin-left: 100px;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
`;

const ProductBody = styled.div`
  width: 100%;
  text-align: left;
  margin-left: 0;
`;

const ProductImage = styled.img`
  border: 1px solid rgb(207, 207, 207);
  border-radius: 25px;
  width: 400px;
  height: auto;
  margin-bottom: 30px;
`;

const SellerInfo = styled.div`
  margin-bottom: 20px;
  font-size: 20px;
  text-align: left;
  padding-bottom: 5px;
  letter-spacing: 2px;
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  margin-left: 100px;
  width: 100%;
  padding: 10px;
`;

const SellerLeft = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 20px;
  margin-left: 0;
`;

const SellerImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
`;

const Nickname = styled.p`
  font-weight: bold;
  font-size: 18px;
  margin: 0;
`;

const Location = styled.p`
  font-size: 14px;
  color: #777;
  margin: 0;
`;

const ProductTitle = styled.h2`
  font-size: 35px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: left;
  margin-left: 50px;
`;

const ProductCategory = styled.p`
  font-size: 14px;
  color: #007acc;
  margin: 0;
`;

const ProductDescription = styled.p`
  min-height: 240px;
  font-size: 18px;
  margin-bottom: 20px;
`;

const EditButton = styled.button`
  position: absolute;
  right: 150px;
  background-color: #ffd85a;
  color: white;
  border: none;
  padding: 8px 15px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
  width: 150px;

  &:hover {
    background-color: #f0ba09;
    color: white;
  }
`;
const CommentWrapper = styled.div`
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  margin-top: 30px;
  margin-bottom: 20px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  text-align: left;
  font-size: 16px;
  line-height: 1.5;
  border: 1px solid #ddd;
`;

const CommentItem = styled.div`
  padding: 0px 5px; /* 여백을 줄여서 댓글이 더 밀착되게 함 */
  margin-bottom: 5px; /* 각 댓글 간 간격 줄임 */
  font-size: 16px;

  strong {
    font-weight: bold;
  }

  p {
    font-size: 14px;
    color: #777;
    margin-top: 3px; /* 시간과 댓글 내용 사이 간격 줄임 */
  }

  /* 각 댓글 사이에 밑줄 추가 */
  border-bottom: 1px solid #c5b3b3;

  &:last-child {
    border-bottom: none; /* 마지막 댓글은 밑줄 제거 */
  }
`;

const CommentInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px auto 0 auto; /* 중앙 정렬 */
  width: 100%;
  max-width: 815px; /* 상위 요소들과 통일 */
`;
const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  margin-bottom: 10px;
`;

const CommentTitle = styled.h2`
  text-align: left;
  margin: 0;
  font-size: 18px;
`;

const CommentTextArea = styled.textarea`
  width: 100%;
  height: 150px;
  padding: 12px;
  font-size: 16px;
  border-radius: 10px;
  border: 1px solid #ccc;
  resize: none;
`;

const CommentSubmitButton = styled.button`
  background-color: #6dbe92;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: #a2e4b8;
  }
`;

function PetstarDetailPage({ onSubmitSuccess = () => {} }) {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [newPost, setNewPost] = useState(null);
  const [newComment, setNewComment] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [description, setDescription] = useState("");
  const DEFAULT_IMAGE = "src/assets/TalkMedia_i_2a4ebc04392c.png.png";
  const [imageBase64, setImageBase64] = useState("");

  const fetchImageBase64 = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/photo/board/upload/${postId}`
      );
      if (response.ok) {
        const base64Data = await response.json();
        const base64String = Array.isArray(base64Data)
          ? base64Data[0]
          : base64Data;
        const mimeType = "image/jpeg";
        const fullBase64 = `data:${mimeType};base64,${base64String}`;
        setImageBase64(fullBase64);
      } else {
        console.error("이미지 로드 실패");
      }
    } catch (error) {
      console.error("이미지 로드 에러:", error);
    }
  };

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
  //       setUser(data);
  //       console.log(data + "세션정보");
  //     } else {
  //       setIsLoggedIn(false);
  //     }
  //   } catch (error) {
  //     console.error("로그인 상태 확인 실패:", error);
  //     setIsLoggedIn(false);
  //   }
  // };

  const checkLoginStatus = async () => {
    // console.log(localStorage.getItem("user"));
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

  const fetchPostDetail = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/board/${postId}`
      );
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
        content: data.content,
        category: data.category,
        type: data.boardType,
        clickCnt: data.clickCount,
        reportCnt: data.reportCount,
        updateTime: new Date(data.update).toLocaleString(),
        seller: data.nickname,
      };
      console.log("data", data);
      setNewPost(postData);
    } catch (error) {
      console.error("상세 데이터 불러오기 오류:", error);
    }
  };
  const fetchComment = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/board/${postId}/comment`
      );
      const data = await response.json();
      if (Array.isArray(data)) {
        const formattedComments = data.map((comment) => ({
          commentContent: comment.commentContent,
          regDate: new Date(comment.regDate).toLocaleString(),
          commentUser: comment.commentUser,
        }));
        setNewComment(formattedComments);
      } else {
        setNewComment([]);
      }
    } catch (error) {
      console.error("댓글 데이터 불러오기 오류:", error);
      setNewComment([]);
    }
  };
  const increaseViewCount = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/board/count/${postId}`, {
        method: "PUT",
      });
    } catch (error) {
      console.error("조회수 증가 실패:", error);
    }
  };
  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    const postData2 = {
      commentContent: description,
      regDate: new Date().toISOString(),
      commentUser: user.nickname,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/board/${postId}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData2),
        }
      );

      if (response.ok) {
        const formattedComment = {
          ...postData2,
          regDate: new Date(postData2.regDate).toLocaleString(), // 👈 변환된 시간으로
        };
        setNewComment([...newComment, formattedComment]);
        setDescription("");
      } else {
        alert("댓글 등록 실패. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("댓글 등록 중 오류 발생:", error);
      alert("오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    if (postId) {
      checkLoginStatus();
      fetchPostDetail();
      fetchImageBase64();
      fetchComment();
      increaseViewCount();
    }
  }, [postId]);

  if (!newPost || !newComment) return <div>로딩 중...</div>;

  return (
    <DetailWrapper>
      <ProductDetailWrapper>
        <ProductBody>
          <ProductTitle>{newPost.title}</ProductTitle>
        </ProductBody>

        <SellerInfo>
          <SellerLeft>
            <SellerImage src="/assets/userimage.jpg" alt="판매자 이미지" />
            <div
              onClick={() => navigate(`/profile/${newPost.sellerUid}`)}
              style={{ cursor: "pointer" }}
            >
              작성자: {newPost.seller}
            </div>
            <div>
              <ProductCategory>
                {newPost.category} | {newPost.updateTime}
              </ProductCategory>
            </div>
          </SellerLeft>
        </SellerInfo>
        <ProductImage src={imageBase64 || DEFAULT_IMAGE} alt={newPost.title} />
        <ProductDescription>{newPost.content}</ProductDescription>
      </ProductDetailWrapper>

      <CommentWrapper>
        <CommentHeader>
          <CommentTitle>댓글창</CommentTitle>{" "}
          {/* 여기에 '댓글창' 텍스트 추가 */}
        </CommentHeader>

        {newComment.length > 0 ? (
          newComment.map((comment, index) => (
            <CommentItem key={index}>
              <strong>{comment.commentUser}</strong>: {comment.commentContent}
              <p>{comment.regDate}</p>
            </CommentItem>
          ))
        ) : (
          <p>댓글이 없습니다.</p>
        )}
      </CommentWrapper>

      <CommentInputWrapper>
        <CommentHeader>
          <CommentTitle>댓글 등록</CommentTitle>
          <CommentSubmitButton type="submit" onClick={handleCommentSubmit}>
            등록
          </CommentSubmitButton>
        </CommentHeader>
        <CommentTextArea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </CommentInputWrapper>
    </DetailWrapper>
  );
}

export default PetstarDetailPage;
