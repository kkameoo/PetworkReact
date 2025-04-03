// PostEditWalk.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { getLocalCategory, getWalkCategory } from "../../services/dataService";

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
  const [regionSi, setRegionSi] = useState(null);
  const [regionGu, setRegionGu] = useState(null);
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState(null);

  const [regionMap, setRegionMap] = useState([]);
  const [walkCategory, setWalkCategory] = useState([]);
  const [isRegionLoaded, setIsRegionLoaded] = useState(false);

  useEffect(() => {
    if (regionMap && Object.keys(regionMap).length > 0) {
      setIsRegionLoaded(true);
    }
  }, [regionMap]);

  useEffect(() => {
    getLocalCategory()
      .then(setRegionMap)
      .catch((error) => console.error("Fetching error:", error));
    getWalkCategory()
      .then(setWalkCategory)
      .catch((error) => console.error("Fetching error:", error));
  }, []);

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
        setRegionSi(post.localSi);
        setRegionGu(post.localGu);
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
      localSi: regionSi,
      localGu: regionGu,
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

  if (
    !isRegionLoaded ||
    !regionMap ||
    regionMap.length === 0 ||
    !walkCategory ||
    Object.keys(walkCategory).length === 0
  )
    return <div>...로딩중</div>;
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
            {walkCategory.map((data) => (
              <option key={data.id} value={data.id}>
                {data.name}
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
            {regionMap.map((reg) => (
              <option key={reg.id} value={reg.id}>
                {reg.name}
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
            {regionMap[regionSi]?.gu.map((guData) => (
              <option key={guData.id} value={guData.id}>
                {guData.name}
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
