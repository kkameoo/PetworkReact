import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

const PostWalk = ({ onSubmitSuccess = () => {} }) => {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(1);
  const [selectedSi, setSelectedSi] = useState("서울특별시");
  const [selectedGu, setSelectedGu] = useState("종로구");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();
  const [regionMap, setRegionMap] = useState([]);
  const META_URL = "/src/data/localCategory.json";

  const CATEGORY_ID = [
    [1, "소형"],
    [2, "중형"],
    [3, "대형"],
  ];

  const localSi = [
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
  const localGu = {
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

  const guMap = [
    [1, "종로구"],
    [2, "중구"],
    [3, "용산구"],
    [4, "성동구"],
    [5, "광진구"],
    [6, "동대문구"],
    [7, "중랑구"],
    [8, "강북구"],
    [9, "도봉구"],
    [10, "노원구"],
    [11, "은평구"],
    [12, "서대문구"],
    [13, "마포구"],
    [14, "양천구"],
    [15, "강서구"],
    [16, "구로구"],
    [17, "금천구"],
    [18, "영등포구"],
    [19, "동작구"],
    [20, "관악구"],
    [21, "서초구"],
    [22, "강남구"],
    [23, "송파구"],
    [24, "강동구"],
    [25, "장안구"],
    [26, "권선구"],
    [27, "팔달구"],
    [28, "영통구"],
    [29, "수정구"],
    [30, "중원구"],
    [31, "분당구"],
    [32, "만안구"],
    [33, "동안구"],
    [34, "원미구"],
    [35, "소사구"],
    [36, "오정구"],
    [37, "광명구"],
    [38, "평택구"],
    [39, "시흥구"],
    [40, "단원구"],
    [41, "상록구"],
    [42, "덕양구"],
    [43, "일산동구"],
    [44, "일산서구"],
    [45, "과천구"],
    [46, "구리구"],
    [47, "남양주구"],
    [48, "오산구"],
    [49, "화성구"],
    [50, "중구(인천)"],
    [51, "동구(인천)"],
    [52, "미추홀구"],
    [53, "연수구"],
    [54, "남동구"],
    [55, "부평구"],
    [56, "계양구"],
    [57, "서구(인천)"],
    [58, "강화군"],
    [59, "옹진군"],
  ];

  const getCategory = async () => {
    try {
      const response = await fetch(META_URL);
      if (response.ok) {
        const data = await response.json();
        setRegionMap(data.regions);
      } else {
        throw new Error("Failed to Fetch Data");
      }
    } catch (error) {
      console.error("Error fetching JSON:", error);
      throw error;
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };
  const handleSiChange = (event) => {
    const newSi = event.target.value;
    setSelectedSi(newSi);
    setSelectedGu(localGu[newSi]?.[0] || ""); // 첫 번째 구 자동 선택
  };
  const handleGuChange = (event) => {
    setSelectedGu(event.target.value);
  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:8087/api/user/session", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) throw new Error("서버 응답 오류");

        const data = await response.json();
        if (data.userId) setUser(data);
      } catch (err) {
        console.error("사용자 정보 불러오기 실패", err);
      }
    };

    fetchUserData();
    getCategory();
  }, []);
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) return alert("로그인이 필요합니다.");
    const localSiIndex = localSi.indexOf(selectedSi) + 1;
    const localGuValue =
      guMap.find(([_, name]) => name === selectedGu)?.[0] || 0;
    const postData = {
      userId: user.userId,
      title,
      content: description,
      reportCount: 0,
      boardType: 1,
      localSi: localSiIndex,
      localGu: localGuValue,
      walkCategory: Number(category),
      update: new Date().toISOString(),
    };
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("requestJson", JSON.stringify(postData));
    try {
      const response = await fetch("http://localhost:8087/api/board/walk", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
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
            {CATEGORY_ID.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </FormRow>
        <FormRow>
          <label>시 선택:</label>
          <select value={selectedSi} onChange={handleSiChange} required>
            {localSi.map((si, index) => (
              <option key={index} value={si}>
                {si}
              </option>
            ))}
          </select>
        </FormRow>

        <FormRow>
          <label>구 선택:</label>
          <select value={selectedGu} onChange={handleGuChange} required>
            {localGu[selectedSi]?.map((gu, index) => (
              <option key={index} value={gu}>
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
        <SubmitButton type="submit">등록</SubmitButton>
      </form>
    </FormContainer>
  );
};

export default PostWalk;
