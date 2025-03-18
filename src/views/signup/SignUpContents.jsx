import React, { useState } from "react";
import styled from "styled-components";

// 스타일 컴포넌트들
const Container = styled.div`
  min-height: 100vh;  /* 최소 높이를 100vh로 설정 */
  background-color: #e5e7eb;
  display: flex;
  flex-direction: column;
  justify-content: center;  /* 화면의 중앙으로 정렬 */
`;

const FormWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;  /* 폼이 화면 중간에 위치하도록 */
  padding: 24px;
`;

const Form = styled.div`
  width: 100%;
  max-width: 32rem;
  background-color: #d1d5db;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
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
  box-sizing: border-box;
`;

const GenderBox = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
`;

const GenderItem = styled.div`
  flex: 1;
  padding: 16px;
  background-color: ${(props) => (props.isSelected ? "#6B7280" : "#F3F4F6")};
  color: ${(props) => (props.isSelected ? "white" : "#4B5563")};
  border-radius: 8px;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => (props.isSelected ? "#6B7280" : "#E5E7EB")};
    color: ${(props) => (props.isSelected ? "white" : "#4B5563")};
  }
`;

const Button = styled.button`
  width: 100%;
  background-color: white;
  color: black;
  border: 1px solid black;
  padding: 16px;
  border-radius: 8px;
  margin-top: 24px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f3f4f6;
  }
`;

function SignupContents() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState(""); // 성별 상태

  const handleSignup = () => {
    // 회원가입 처리 로직
    console.log("회원가입 정보:", { id, password, passwordCheck, nickname, phone, email, birthdate, gender });
  };

  const handleBirthdateChange = (e) => {
    const value = e.target.value;
    // 년도는 4자리만 입력하도록 제한
    if (/^\d{0,4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(value)) {
      setBirthdate(value);
    }
  };

  return (
    <Container>
      {/* 회원가입 폼 */}
      <FormWrapper>
        <Form>
          <Title>회원가입</Title>
          <InputWrapper>
            <div>
              <Label>아이디</Label>
              <Input
                type="text"
                placeholder="아이디 입력"
                value={id}
                onChange={(e) => setId(e.target.value)}
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
            <div>
              <Label>비밀번호 확인</Label>
              <Input
                type="password"
                placeholder="비밀번호 확인"
                value={passwordCheck}
                onChange={(e) => setPasswordCheck(e.target.value)}
              />
            </div>
            <div>
              <Label>이름 / 닉네임</Label>
              <Input
                type="text"
                placeholder="이름 또는 닉네임 입력"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>
            <div>
              <Label>전화번호</Label>
              <Input
                type="text"
                placeholder="전화번호 입력"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="이메일 입력"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label>생년월일</Label>
              <Input
                type="date"
                value={birthdate}
                onChange={handleBirthdateChange}
              />
            </div>

            {/* 성별 선택 박스 */}
            <div>
              <Label>성별</Label>
              <GenderBox>
                <GenderItem
                  isSelected={gender === "남성"}
                  onClick={() => setGender("남성")}
                >
                  남성
                </GenderItem>
                <GenderItem
                  isSelected={gender === "여성"}
                  onClick={() => setGender("여성")}
                >
                  여성
                </GenderItem>
              </GenderBox>
            </div>

            <Button onClick={handleSignup}>회원가입</Button>
          </InputWrapper>
        </Form>
      </FormWrapper>
    </Container>
  );
}

export default SignupContents;
