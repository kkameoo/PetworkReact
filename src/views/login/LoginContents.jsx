import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

// 스타일 컴포넌트들
const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const FormWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Form = styled.div`
  width: 100%;
  max-width: 32rem;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 24px;
  background-color: #00bfff;
  color: #000000;
  padding: 16px;
  border-radius: 8px;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 24px;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
`;

const Input = styled.input`
  border: 1px solid #d1d5db;
  padding: 16px;
  border-radius: 8px;
  width: 100%;
  background-color: white;
  font-size: 16px;
  box-sizing: border-box;
`;

const Button = styled.button`
  width: 100%;
  background-color: white;
  color: black;
  border: 1px solid black;
  padding: 16px;
  border-radius: 8px;
  margin-top: ${(props) => (props.isSignup ? "16px" : "24px")};
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f3f4f6;
  }
`;

function LoginContents() {
  // const [username, setUsername] = useState("");
  // const [password, setPassword] = useState("");
  const {user, setUser} = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const API_USER_URL = `http://localhost:8087/api/user`;

  // 뒤로가기 버튼
  const onBack = () => {
    navigate("/");
  };

  const handleLogin = async () => {
    // e.preventDefault();

    try {
      const response = await fetch(`${API_USER_URL}/login`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      

      const data = await response.json();
      setUser(data);
      console.log("data", data);

      navigate("/");
      if (!response.ok) {
        throw new Error("로그인 실패");
      }
    } catch (error) {
      console.error("로그인 오류", error);
      setError("서버 오류가 발생했습니다.");
    }
  };

  return (
    <Container>
      <FormWrapper>
        <Form onSubmit={handleLogin}>
          <button onClick={onBack} className="login-back-button" />
          <Title>로그인</Title>
          <InputWrapper>
            <div>
              <Label>아이디</Label>
              <Input
                type="text"
                placeholder="이메일 입력"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div>
              <Label>비밀번호</Label>
              <Input
                type="password"
                placeholder="비밀번호 입력"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
            <Button onClick={handleLogin}>로그인</Button>
            <Button isSignup>회원가입</Button>
          </InputWrapper>
        </Form>
      </FormWrapper>
    </Container>
  );
}

export default LoginContents;
