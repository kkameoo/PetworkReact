import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Container = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa;
`;

const FormWrapper = styled.div`
  width: 100%;
  max-width: 700px;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 600px;
  margin-top: inherit;
`;

const Title = styled.h1`
  font-family: "Ownglyph_meetme-Rg", sans-serif;
  font-size: 60px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  color: #a2e4b8;
`;

const InputWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  font-family: "Ownglyph_meetme-Rg", sans-serif;
  width: 100%;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 20px;
  background-color: white;
  box-sizing: border-box;
  transition: border 0.3s;
  margin-bottom: 20px;

  &:focus {
    border-color: #f1f0e8;
    outline: none;
  }
`;

const Button = styled.button`
  font-family: "Ownglyph_meetme-Rg", sans-serif;
  width: 100%;
  background-color: #a2e4b8;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: auto;
  margin-bottom: 20px;

  &:hover {
    background-color: #6dbe92;
  }
`;

const Login = () => {
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const API_USER_URL = `${import.meta.env.VITE_API_URL}/api/user`;

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_USER_URL}/login/jwt`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error("로그인 실패");
      }
      console.log(data);
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      navigate("/");
    } catch (error) {
      console.error("로그인 오류", error);
      setError("이메일 또는 비밀번호 재확인 해주세요.");
    }
  };

  return (
    <Container>
      <FormWrapper>
        <Title>로 그 인</Title>
        <InputWrapper>
          <Input
            type="email"
            placeholder="이메일"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <Input
            type="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </InputWrapper>
        {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
        <Button onClick={handleLogin}>로그인</Button>
        <Button
          onClick={() => navigate("/signup")}
          style={{ marginTop: "10px", backgroundColor: "#ddd", color: "black" }}
        >
          회원가입
        </Button>
      </FormWrapper>
    </Container>
  );
};

export default Login;
