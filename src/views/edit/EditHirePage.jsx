import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // 스타일을 임포트
import { getLocalCategory, getWalkCategory } from "../../services/dataService";

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

const EditHirePage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(1);
  const [regionSi, setRegionSi] = useState("서울시");
  const [regionGu, setRegionGu] = useState("강남구");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState(null);
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("");
  const [hireDate, setHireDate] = useState(new Date());

  const [regionMap, setRegionMap] = useState([]);
  const [walkCategory, setWalkCategory] = useState([]);

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
          `${import.meta.env.VITE_API_URL}/api/board/hire/${postId}`
        );
        const post = await res.json();

        setTitle(post.title);
        setCategory(post.hireCategory);
        setRegionSi(post.localSi);
        setRegionGu(post.localGu);
        setDescription(post.content);
        setImageUrl(post.imageUrl);
        setPreview(post.imageUrl);
        setPrice(post.hirePrice);
        setCondition(post.hireCondition);
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
      const uploadRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/board/hire`,
        {
          method: "POST",
          body: formData,
        }
      );
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
      localSi: regionSi,
      localGu: regionGu,
      post_photo: imageUrl,
      hirePrice: Number(price),
      hireDate: hireDate.toISOString(),
      hireCondition: condition,
      update: new Date().toISOString(),
      hireCategory: Number(category),
    };
    console.log("update", updatedData);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/board/hire/${postId}`,
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
    !regionMap ||
    regionMap.length === 0 ||
    !walkCategory ||
    Object.keys(walkCategory).length === 0
  )
    return <div>...로딩중</div>;
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
          <label>희망 날짜</label>
          <DatePicker
            selected={hireDate}
            onChange={(date) => setHireDate(date)}
            dateFormat="yyyy-MM-dd"
            minDate={new Date()} // 오늘 이후부터 선택 가능
            placeholderText="날짜를 선택하세요"
          />
        </FormRow>
        <FormRow>
          <label>조건</label>
          <textarea
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            required
          />
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

export default EditHirePage;
