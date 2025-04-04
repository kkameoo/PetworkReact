import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const OuterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 101vh, 500px;
  width: 60%;
  margin-left: 300px;
  background-color: #f9f9f9;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
  padding: 40px;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 1200px;
  height: 500px;
  background-color: #fff;
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 50%;
`;

const PreviewImage = styled.img`
  width: 300px;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const Placeholder = styled.div`
  width: 300px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #aaa;
  border-radius: 8px;
  color: #888;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const CustomFileButton = styled.label`
  padding: 10px 15px;
  background-color: #ff7f50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  &:hover {
    background-color: #ff6347;
  }
`;

const InputContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
  gap: 10px;
`;

const InputField = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 14px;
  margin-bottom: 5px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Textarea = styled.textarea`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: none;
  height: 80px;
`;

const SubmitButton = styled.button`
  padding: 10px 15px;
  background-color: #ff7f50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #ff6347;
  }
`;

const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;

  label {
    margin-bottom: 5px;
    font-weight: bold;
    color: #007acc;
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

const CATEGORY_ID = [
  [1, "소형"],
  [2, "중형"],
  [3, "대형"],
];

function PostUserPet({ onSubmitSuccess }) {
  const [petName, setPetName] = useState("");
  const [petType, setPetType] = useState("");
  const [petIntroduce, setPetIntroduce] = useState("");
  const [category, setCategory] = useState("1");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = {
      userId: user.userId,
      petName: petName,
      petCategory: Number(category),
      petType: petType,
      petIntroduce: petIntroduce,
    };

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("requestJson", JSON.stringify(postData));

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/pet/create`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      if (response.ok) {
        alert("게시물이 성공적으로 등록되었습니다!");
        if (typeof onSubmitSuccess === "function") {
          onSubmitSuccess();
        }
        navigate("/my");
      } else {
        alert("게시물 등록 실패. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("게시물 등록 중 오류 발생:", error);
      alert("오류가 발생했습니다.");
    }
  };

  return (
    <OuterContainer>
      <FormContainer>
        <ImageContainer>
          {preview ? (
            <PreviewImage src={preview} alt="미리보기" />
          ) : (
            <Placeholder>이미지를 선택하세요</Placeholder>
          )}
          <HiddenFileInput
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          <CustomFileButton htmlFor="file-upload">이미지 선택</CustomFileButton>
        </ImageContainer>
        <InputContainer onSubmit={handleSubmit}>
          <InputField>
            <Label>이름</Label>
            <Input
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              required
            />
          </InputField>
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
          <InputField>
            <Label>견종</Label>
            <Input
              type="text"
              value={petType}
              onChange={(e) => setPetType(e.target.value)}
              required
            />
          </InputField>
          <InputField>
            <Label>소개글</Label>
            <Textarea
              value={petIntroduce}
              onChange={(e) => setPetIntroduce(e.target.value)}
              required
            />
          </InputField>
          <SubmitButton type="submit">등록</SubmitButton>
        </InputContainer>
      </FormContainer>
    </OuterContainer>
  );
}

export default PostUserPet;
