import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getLocalCategory, getWalkCategory } from "../../services/dataService";
import { useAuth } from "../../hooks/useAuth";

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

const PostWalk = ({ onSubmitSuccess = () => {} }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("0");
  const [selectedSi, setSelectedSi] = useState("0");
  const [selectedGu, setSelectedGu] = useState("0");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();
  const [regionMap, setRegionMap] = useState([]);
  const [walkCategory, setWalkCategory] = useState([]);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSiChange = (event) => {
    const newSi = event.target.value;
    setSelectedSi(newSi);
    setSelectedGu(regionMap[newSi]?.gu[0].id || "0"); // 첫 번째 구 자동 선택
  };

  const handleGuChange = (event) => {
    setSelectedGu(event.target.value);
  };

  useEffect(() => {
    getLocalCategory()
      .then(setRegionMap)
      .catch((error) => console.error("Fetching error:", error));
    getWalkCategory()
      .then(setWalkCategory)
      .catch((error) => console.error("Fetching error:", error));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) return alert("로그인이 필요합니다.");

    const postData = {
      userId: user.userId,
      title: title,
      content: description,
      reportCount: 0,
      boardType: 1,
      localSi: selectedSi,
      localGu: selectedGu,
      walkCategory: Number(category),
      update: new Date().toISOString(),
      latitude: regionMap[selectedSi].latitude,
      longitude: regionMap[selectedSi].longitude,
      nickname: user.nickname,
    };
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("requestJson", JSON.stringify(postData));
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/board/walk`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );
      if (response.ok) {
        alert("게시물이 등록되었습니다");
        onSubmitSuccess();
        navigate("/");
      } else {
        alert("등록 실패");
      }
    } catch (err) {
      console.error("등록 중 오류:", err);
    }
  };

  if (!walkCategory) return <div>...로딩중</div>;

  return (
    <FormContainer>
      <h2>게시물 등록</h2>
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
            {walkCategory.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </FormRow>
        <FormRow>
          <label>시 선택:</label>
          <select value={selectedSi} onChange={handleSiChange} required>
            {regionMap.map((si, index) => (
              <option key={index} value={si.id}>
                {si.name}
              </option>
            ))}
          </select>
        </FormRow>

        <FormRow>
          <label>구 선택:</label>
          <select value={selectedGu} onChange={handleGuChange} required>
            {regionMap[selectedSi]?.gu.map((gu, index) => (
              <option key={index} value={gu.id}>
                {gu.name}
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
        <SubmitButton type="submit">등록</SubmitButton>
      </form>
    </FormContainer>
  );
};

export default PostWalk;
