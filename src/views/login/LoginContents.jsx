import React, { useState } from "react";
import styled from "styled-components";

// 스타일 컴포넌트들
const Container = styled.div`
  height: 100vh;
  background-color: #e5e7eb;
  display: flex;
  flex-direction: column;
`;

const LoginFormWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoginForm = styled.div`
  width: 100%;
  max-width: 32rem;
  background-color: #d1d5db;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 24px;
  background-color: #6b7280;
  color: white;
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
  box-sizing: border-box;  /* 패딩과 보더를 포함한 크기 설정 */
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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("Logging in with", { username, password });
  };

  return (
    <Container>
      {/* 로그인 폼 */}
      <LoginFormWrapper>
        <LoginForm>
          <Title>로그인</Title>
          <InputWrapper>
            <div>
              <Label>아이디</Label>
              <Input 
                type="text" 
                placeholder="아이디 입력" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
              />
            </div>
            <div>
              <Label>비밀번호</Label>
              <Input 
                type="password" 
                placeholder="비밀번호 입력" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
            <Button onClick={handleLogin}>로그인</Button>
            <Button isSignup>회원가입</Button>
          </InputWrapper>
        </LoginForm>
      </LoginFormWrapper>
    </Container>
  );
}

export default LoginContents;
