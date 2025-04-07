import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getLocalCategory, getTradeCategory } from "../../services/dataService";
import { useAuth } from "../../hooks/useAuth";
import UserCheck from "../../components/UserCheck";

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

const PostTrade = ({ onSubmitSuccess = () => {} }) => {
  // const [user, setUser] = useState(null);
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("0");
  const [selectedSi, setSelectedSi] = useState("0");
  const [selectedGu, setSelectedGu] = useState("0");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState([]);
  const [regionMap, setRegionMap] = useState([]);
  const [tradeCategory, setTradeCategory] = useState([]);
  const navigate = useNavigate();

  const handleImageChange = async (event) => {
    const files = Array.from(event.target.files);
    if (!files) return;

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImageFile((prev) => [...prev, ...newImages]);
  };

  const handleImageDelete = async (event) => {
    console.log(event);
    if (!event) return;

    const newFiles = imageFile.filter((image) => image !== event);
    setImageFile(newFiles);
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
    getTradeCategory()
      .then(setTradeCategory)
      .catch((error) => console.error("Fetching error:", error));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    const postData = {
      userId: user.userId,
      title: title,
      content: description,
      reportCount: 0,
      boardType: 2,
      localSi: selectedSi,
      localGu: selectedGu,
      tradeCategory: Number(category),
      tradePrice: Number(price),
      latitude: regionMap[selectedSi].latitude,
      longitude: regionMap[selectedSi].longitude,
      update: new Date().toISOString(),
      nickname: user.nickname,
    };
    const formData = new FormData();
    imageFile.forEach((img) => {
      formData.append("file", img.file);
    });
    // console.log(postData);
    const postData2 = JSON.stringify(postData);
    // console.log(postData2);
    formData.append("requestJson", postData2);
    // console.log(postData, "데이터");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/board/trade`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      if (response.ok) {
        alert("게시물이 성공적으로 등록되었습니다!");
        onSubmitSuccess();
        navigate("/");
      } else {
        alert("게시물 등록 실패. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("게시물 등록 중 오류 발생:", error);
      alert("오류가 발생했습니다.");
    }
  };

  if (!user) return <UserCheck />;

  if (!tradeCategory) return <div>...로딩중</div>;

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
          <label>가격</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </FormRow>
        <FormRow>
          <label>카테고리</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {tradeCategory.map((category) => (
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
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
          {imageFile.map(
            (img, index) =>
              img && (
                <PreviewImage
                  key={index}
                  src={img.preview}
                  alt="preview"
                  onClick={() => handleImageDelete(img)}
                />
              )
          )}
        </FormRow>
        <SubmitButton type="submit">등록</SubmitButton>
      </form>
    </FormContainer>
  );
};

export default PostTrade;
