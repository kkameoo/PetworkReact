import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 400px;
  background-color: #fff;
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PreviewImage = styled.img`
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const Placeholder = styled.div`
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #aaa;
  border-radius: 8px;
  color: #888;
`;

const ImageInput = styled.input`
  margin-top: 10px;
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


const PostUserPet = ({ user, onSubmitSuccess }) => {
  const [petName, setPetName] = useState("");
  const [petCategory, setPetCategory] = useState("");
  const [petIntroduce, setPetIntroduce] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = {
      userId: user.userId,
      petName: petName,
      petCategory: petCategory,
      petIntroduce: petIntroduce,
      boardType: 3,
    };

    const formData = new FormData();
    console.log(postData);
    const postData2 = JSON.stringify(postData);
    console.log(postData2);
    formData.append("file", imageFile);
    formData.append("requestJson", postData2);
    console.log(postData, "데이터");

    try {
      const response = await fetch("http://localhost:8087/api/user/pet", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

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

  return (
    <FormContainer onSubmit={handleSubmit}>
      <ImageContainer>
        {preview ? <PreviewImage src={preview} alt="미리보기" /> : <Placeholder>이미지를 선택하세요</Placeholder>}
        <ImageInput type="file" accept="image/*" onChange={handleImageChange} />
      </ImageContainer>
      <InputField>
        <Label>이름</Label>
        <Input type="text" value={petName} onChange={(e) => setPetName(e.target.value)} required />
      </InputField>
      <InputField>
        <Label>종류</Label>
        <Input type="text" value={petCategory} onChange={(e) => setPetCategory(e.target.value)} required />
      </InputField>
      <InputField>
        <Label>소개글</Label>
        <Textarea value={petIntroduce} onChange={(e) => setPetIntroduce(e.target.value)} required />
      </InputField>
      <SubmitButton type="submit">등록</SubmitButton>
    </FormContainer>
  );
};

export default PostUserPet;

