import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { getLocalCategory, getTradeCategory } from "../../services/dataService";
import UserCheck from "../../components/UserCheck";

const FormContainer = styled.div`
  width: 1600px;
  margin: 40px auto;
  padding: 20px;
  background-color: #a2e4b8;
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

const EditTradePage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(0);
  const [regionSi, setRegionSi] = useState(0);
  const [regionGu, setRegionGu] = useState(0);
  const [description, setDescription] = useState("");
  const [newImageFile, setNewImageFile] = useState([]);
  const [existImageFile, setExistImageFile] = useState([]);
  const [deletedImageFile, setDeletedImageFile] = useState([]);
  const [price, setPrice] = useState("");
  const [regionMap, setRegionMap] = useState([]);
  const [tradeCategory, setTradeCategory] = useState([]);

  useEffect(() => {
    getLocalCategory()
      .then(setRegionMap)
      .catch((error) => console.error("Fetching error:", error));
    getTradeCategory()
      .then(setTradeCategory)
      .catch((error) => console.error("Fetching error:", error));
    fetchImageBase64();
  }, []);

  const fetchImageBase64 = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/photo/board/upload/edit/${postId}`
      );
      if (response.ok) {
        const base64Data = await response.json(); // 서버가 JSON으로 배열 반환하는 경우
        setExistImageFile(base64Data);
      } else {
        console.error("이미지 로드 실패");
      }
    } catch (error) {
      console.error("이미지 로드 에러:", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/session`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (data.userId) setUser(data);
    };

    const fetchPostData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/board/trade/${postId}`
        );
        const post = await res.json();

        setTitle(post.title);
        setCategory(post.tradeCategory);
        setRegionSi(post.localSi);
        setRegionGu(post.localGu);
        setDescription(post.content);
        setPrice(post.tradePrice);
      } catch (err) {
        console.error("게시물 로드 실패:", err);
      }
    };

    fetchUser();
    fetchPostData();
  }, [postId]);

  const handleImageChange = async (event) => {
    const files = Array.from(event.target.files);
    if (!files) return;

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setNewImageFile((prev) => [...prev, ...newImages]);
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
      localSi: regionSi,
      localGu: regionGu,
      tradeCategory: Number(category),
      tradePrice: Number(price),
      update: new Date().toISOString(),
    };
    const formData = new FormData();
    newImageFile.forEach((img) => {
      formData.append("file", img.file);
    });
    deletedImageFile.forEach((img) => {
      formData.append("deleted", img.fileId);
    });
    formData.append("requestJson", JSON.stringify(updatedData));
    console.log("update", updatedData);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/board/trade/${postId}`,
        {
          method: "PUT",
          credentials: "include",
          // headers: { "Content-Type": "application/json" },
          body: formData,
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

  const handleNewImageDelete = async (event) => {
    console.log(event);
    if (!event) return;

    const newFiles = newImageFile.filter((image) => image !== event);
    setNewImageFile(newFiles);
  };

  const handleExistImageDelete = async (event) => {
    console.log(event);
    if (!event) return;

    setDeletedImageFile((prev) => [...prev, event]);
    const newFiles = existImageFile.filter((image) => image !== event);
    setExistImageFile(newFiles);
  };

  if (!user) return <UserCheck />;

  if (
    !regionMap ||
    regionMap.length === 0 ||
    !tradeCategory ||
    Object.keys(tradeCategory).length === 0
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
            {tradeCategory.map((data) => (
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
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
          {existImageFile.map(
            (img, index) =>
              img && (
                <PreviewImage
                  key={index}
                  src={img.base64Name}
                  alt="preview"
                  onClick={() => handleExistImageDelete(img)}
                />
              )
          )}
          {newImageFile.map(
            (img, index) =>
              img && (
                <PreviewImage
                  key={index}
                  src={img.preview}
                  alt="preview"
                  onClick={() => handleNewImageDelete(img)}
                />
              )
          )}
        </FormRow>
        <SubmitButton type="submit">수정하기</SubmitButton>
      </form>
    </FormContainer>
  );
};

export default EditTradePage;
