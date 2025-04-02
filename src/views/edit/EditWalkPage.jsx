// PostEditWalk.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

const FormContainer = styled.div`
  /* max-width: 600px; */
  width: 1600px;
  margin: 40px auto;
  padding: 20px;
  /* border: 2px solid #00bfff; */
  /* border-radius: 20px; */
  background-color: #a2e4b8;
  /* box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1); */
`;

const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;

  label {
    margin-bottom: 5px;
    font-weight: bold;
    color: #727d73;
  }

  input,
  select,
  textarea {
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #ccc;
    font-size: 16px;
  }

  textarea {
    resize: vertical;
    min-height: 100px;
  }
`;

const PreviewImage = styled.img`
  margin-top: 10px;
  max-width: 400px;
  border-radius: 12px;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #6dbe92;
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #14af5a;
  }
`;

const EditWalkPage = () => {
  const { postId } = useParams(); // 게시물 ID
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(1);
  const [regionSi, setRegionSi] = useState("서울시");
  const [regionGu, setRegionGu] = useState("강남구");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState(null);

  const CATEGORY_ID = [
    [1, "소형"],
    [2, "중형"],
    [3, "대형"],
  ];

  const regions = [
    "서울시",
    "수원시",
    "성남시",
    "안양시",
    "부천시",
    "광명시",
    "펑택시",
    "시흥시",
    "안산시",
    "고양시",
    "과천시",
    "구리시",
    "남양주시",
    "오산시",
    "화성시",
    "인천시",
  ];

  const allSis = {
    서울시: [
      "종로구",
      "중구",
      "용산구",
      "성동구",
      "광진구",
      "동대문구",
      "중랑구",
      "강북구",
      "도봉구",
      "노원구",
      "은평구",
      "서대문구",
      "마포구",
      "양천구",
      "강서구",
      "구로구",
      "금천구",
      "영등포구",
      "동작구",
      "관악구",
      "서초구",
      "강남구",
      "송파구",
      "강동구",
    ],
    수원시: ["장안구", "권선구", "팔달구", "영통구"],
    성남시: ["수정구", "중원구", "분당구"],
    안양시: ["만안구", "동안구"],
    부천시: ["원미구", "소사구", "오정구"],
    광명시: ["광명구"],
    평택시: ["평택구"],
    시흥시: ["시흥구"],
    안산시: ["단원구", "상록구"],
    고양시: ["덕양구", "일산동구", "일산서구"],
    과천시: ["과천구"],
    구리시: ["구리구"],
    남양주시: ["남양주구"],
    오산시: ["오산구"],
    화성시: ["화성구"],
    인천시: [
      "중구(인천)",
      "동구(인천)",
      "미추홀구",
      "연수구",
      "남동구",
      "부평구",
      "계양구",
      "서구(인천)",
      "강화군",
      "옹진군",
    ],
  };

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("http://localhost:8087/api/user/session", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.userId) setUser(data);
    };

    const fetchPostData = async () => {
      try {
        const res = await fetch(
          `http://localhost:8087/api/board/walk/${postId}`
        );
        const post = await res.json();

        setTitle(post.title);
        setCategory(post.walkCategory);
        setRegionSi(regions[post.localSi - 1]);
        setRegionGu(allSis[regions[post.localSi - 1]][post.localGu - 1]);
        setDescription(post.content);
        setImageUrl(post.imageUrl);
        setPreview(post.imageUrl);
      } catch (err) {
        console.error("게시물 로드 실패:", err);
      }
    };

    fetchUser();
    fetchPostData();
  }, [postId]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const uploadRes = await fetch("http://localhost:8087/api/board/walk", {
        method: "POST",
        body: formData,
      });
      if (uploadRes.ok) {
        const result = await uploadRes.json();
        setImageUrl(result.url);
        setPreview(result.url);
      }
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    const updatedData = {
      userId: user.userId,
      title,
      content: description,
      reportCount: 0,
      localSi: regions.indexOf(regionSi) + 1,
      localGu: allSis[regionSi].indexOf(regionGu) + 1,
      walkCategory: Number(category),
      update: new Date().toISOString(),
      post_photo: imageUrl,
    };

    try {
      const res = await fetch(
        `http://localhost:8087/api/board/walk/${postId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        }
      );

      if (res.ok) {
        alert("게시물이 수정되었습니다.");
        navigate("/");
      } else {
        alert("수정 실패. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("수정 오류:", error);
    }
  };

  return (
    <FormContainer>
      <h2>게시물 수정</h2>
      <form onSubmit={handleSubmit}>
        <FormRow>
          <label>제목</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </FormRow>
        <FormRow>
          <label>카테고리</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORY_ID.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </FormRow>
        <FormRow>
          <label>시</label>
          <select
            value={regionSi}
            onChange={(e) => setRegionSi(e.target.value)}
          >
            {regions.map((reg) => (
              <option key={reg} value={reg}>
                {reg}
              </option>
            ))}
          </select>
        </FormRow>
        <FormRow>
          <label>구</label>
          <select
            value={regionGu}
            onChange={(e) => setRegionGu(e.target.value)}
          >
            {allSis[regionSi]?.map((gu) => (
              <option key={gu} value={gu}>
                {gu}
              </option>
            ))}
          </select>
        </FormRow>
        <FormRow>
          <label>설명</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </FormRow>
        <FormRow>
          <label>이미지 업로드</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {preview && <PreviewImage src={preview} alt="preview" />}
        </FormRow>
        <SubmitButton type="submit">수정하기</SubmitButton>
      </form>
    </FormContainer>
  );
};

export default EditWalkPage;
