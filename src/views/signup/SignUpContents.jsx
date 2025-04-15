import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const GooeyButton = styled.button`
  width: 100%;
  position: relative;
  display: inline-block;
  background: linear-gradient(to right, #a2e4b8, #00f2fe);
  color: white;
  padding: 12px 24px;
  font-size: 20px;
  font-family: "Ownglyph_meetme-Rg", sans-serif;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.2s ease;
  margin-bottom: 20px;

  &:hover {
    transform: translateY(-2px);
  }

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }

  &::before,
  &::after {
    content: "";
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    animation: bubble 1.5s infinite ease-in-out;
    pointer-events: none;
  }

  &::before {
    width: 20px;
    height: 20px;
    top: 0;
    left: 30%;
  }

  &::after {
    width: 15px;
    height: 15px;
    bottom: 0;
    right: 25%;
    animation-delay: 0.75s;
  }

  @keyframes bubble {
    0% {
      transform: scale(1) translateY(0);
      opacity: 1;
    }
    100% {
      transform: scale(1.5) translateY(-20px);
      opacity: 0;
    }
  }
`;

const FormWrapper = styled.form`
  width: 100%;
  max-width: 700px;
  min-height: 800px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 40px;
  box-sizing: border-box;
  overflow-y: auto;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f8f9fa;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
`;
const SignupContainer = styled(Container)``;
const SignupFormWrapper = styled(FormWrapper)``;
const Title = styled.h2`
  font-family: "Ownglyph_meetme-Rg", sans-serif;
  font-size: 60px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
  color: #a2e4b8;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 600px;
  padding: 20px;
  height: 60%;
  background: white;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;
const Label = styled.label`
  font-size: 14px;
  color: #555;
  margin-bottom: 5px;
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

const Select = styled.select`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-bottom: 15px;
  font-size: 14px;
  background: white;
  &:focus {
    outline: none;
    border-color: #93c572;
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

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
`;
/* 드롭다운 스타일 */
const SelectBox = styled.select`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 2px solid #93c572;
  border-radius: 8px;
  background-color: #fff;
  appearance: none; /* 기본 화살표 제거 */
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='gray'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;
  cursor: pointer;
  transition: 0.3s ease-in-out;
  margin-bottom: 20px;

  &:hover {
    background-color: #ffeadb;
  }

  &:focus {
    border-color: #93c572;
    box-shadow: 0 0 5px rgba(255, 140, 0, 0.5);
    outline: none;
  }
`;
const Option = styled.option`
  font-size: 16px;
  padding: 10px;
  background-color: #fff;
  color: #333;

  &:hover {
    background-color: #93c572;
    color: white;
  }
`;

// 모달
const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const ModalContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
`;

const ModalHeader = styled.h2`
  text-align: center;
`;

const ModalButton = styled.button`
  background-color: #007acc;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #00bfff;
  }
`;

const regions = [
  [1, "서울시"],
  [2, "수원시"],
  [3, "성남시"],
  [4, "안양시"],
  [5, "부천시"],
  [6, "광명시"],
  [7, "평택시"],
  [8, "시흥시"],
  [9, "안산시"],
  [10, "고양시"],
  [11, "과천시"],
  [12, "구리시"],
  [13, "남양주시"],
  [14, "오산시"],
  [15, "화성시"],
  [16, "인천시"],
];

const allSis = {
  1: [
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
  ],
  2: [
    [1, "장안구"],
    [2, "권선구"],
    [3, "팔달구"],
    [4, "영통구"],
  ],
  3: [
    [1, "수정구"],
    [2, "중원구"],
    [3, "분당구"],
  ],
  4: [
    [1, "만안구"],
    [2, "동안구"],
  ],
  5: [
    [1, "원미구"],
    [2, "소사구"],
    [3, "오정구"],
  ],
  6: [[1, "광명구"]],
  7: [[1, "평택구"]],
  8: [[1, "시흥구"]],
  9: [
    [1, "단원구"],
    [2, "상록구"],
  ],
  10: [
    [1, "덕양구"],
    [2, "일산동구"],
    [3, "일산서구"],
  ],
  11: [[1, "과천구"]],
  12: [[1, "구리구"]],
  13: [[1, "남양주구"]],
  14: [[1, "오산구"]],
  15: [[1, "화성구"]],
  16: [
    [1, "중구(인천)"],
    [2, "동구(인천)"],
    [3, "미추홀구"],
    [4, "연수구"],
    [5, "남동구"],
    [6, "부평구"],
    [7, "계양구"],
    [8, "서구(인천)"],
    [9, "강화군"],
    [10, "옹진군"],
  ],
};

const SignupContents = () => {
  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    password: "",
    confirmPassword: "",
    telNumber: "",
    email: "",
    preference: 1,
    localSi: "", // 첫 번째 지역으로 기본값 설정
    localGu: "", // 첫 번째 군/구로 기본값 설정
  });
  const API_USER_URL = `${import.meta.env.VITE_API_URL}/api/user/register`;
  const API_EMAIL_VERIFICATION_URL = `${
    import.meta.env.VITE_API_URL
  }/api/email/send`;
  const API_EMAIL_VERIFY_URL = `${
    import.meta.env.VITE_API_URL
  }/api/email/verify`;

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [emailInput, setEmailInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(API_USER_URL)
      .then((response) => response.json())
      .then((data) => console.log("회원 데이터 로드 성공", data))
      .catch((error) => console.error("회원 데이터 로드 실패", error));
  }, []);
  useEffect(() => {
    setPasswordMatch(
      formData.confirmPassword
        ? formData.password === formData.confirmPassword
        : true
    );
  }, [formData.password, formData.confirmPassword]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 회원 정보 조회 시 변환
  const user = { localSi: 1, localGu: 3 }; // DB에서 가져온 데이터

  const handleSendEmailVerification = async () => {
    if (!emailInput.trim()) {
      alert("이메일을 입력해주세요.");
      return;
    }

    // 실제 api사용 이메일 인증
    try {
      const response = await fetch(API_EMAIL_VERIFICATION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput }),
      });

      if (!response.ok) throw new Error("이메일 인증 요청 실패");

      alert("이메일 인증 코드가 전송되었습니다.");
    } catch (error) {
      console.error("이메일 인증 오류:", error);
      alert("이메일 인증 중 오류 발생");
    }
  };

  const handleVerifyCode = async () => {
    if (!emailInput.trim() || !verificationCode.trim()) {
      alert("이메일과 인증 코드를 입력해주세요.");
      return;
    }

    try {
      const response = await fetch(API_EMAIL_VERIFY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput, code: verificationCode }),
      });

      if (!response.ok) throw new Error("인증 코드 불일치");

      alert("이메일 인증 성공!");
      setIsEmailVerified(true);

      // ✅ 인증 코드 formData에 저장
      setFormData((prev) => ({ ...prev, email: emailInput }));
      setModalVisible(false);
    } catch (error) {
      console.error("이메일 인증 오류:", error);
      alert("인증 코드가 올바르지 않습니다.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    console.log(formData);

    const userData = {
      ...formData,
      localSi: parseInt(formData.localSi), // 숫자로 변환
      localGu: formData.localGu ? parseInt(formData.localGu) : null,
    };

    console.log("회원가입 데이터:", userData);

    if (!isEmailVerified) {
      alert("이메일 인증을 완료해주세요.");
      return;
    }

    try {
      const response = await fetch(API_USER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const responseData = await response.text(); // 서버 응답 메시지 받기

      if (!response.ok) {
        throw new Error(responseData || "회원가입 실패");
      }

      alert("회원가입 성공! 로그인 페이지로 이동합니다.");
      navigate("/login");
    } catch (error) {
      console.error("회원가입 오류:", error.message);
      alert(`회원가입 실패: ${error.message}`);
    }
  };
  return (
    <SignupContainer>
      <SignupFormWrapper onSubmit={handleSubmit}>
        <Title>회원가입</Title>
        <GooeyButton
          type="button"
          onClick={() => setModalVisible(true)}
          disabled={isEmailVerified}
        >
          이메일 인증
        </GooeyButton>
        {/* 이메일 입력 */}
        <Input
          type="email"
          name="email"
          value={formData.email}
          disabled={isEmailVerified}
          placeholder="이메일 인증을 먼저해주세요."
        />
        {modalVisible && (
          <ModalBackdrop>
            <ModalContainer>
              <h3>이메일 인증</h3>
              <Input
                type="text"
                placeholder="이메일 입력"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                disabled={isEmailVerified}
              />
              <Button type="button" onClick={handleSendEmailVerification}>
                인증 코드 보내기
              </Button>
              <Input
                type="text"
                placeholder="인증 코드 입력"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              <Button type="button" onClick={handleVerifyCode}>
                인증 확인
              </Button>
              <Button type="button" onClick={() => setModalVisible(false)}>
                닫기
              </Button>
            </ModalContainer>
          </ModalBackdrop>
        )}

        {isEmailVerified && <p>이메일 인증 완료 </p>}

        <Input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={formData.password}
          onChange={handleChange}
        />
        <Input
          type="password"
          name="confirmPassword"
          placeholder="비밀번호 확인"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {!passwordMatch && (
          <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>
        )}
        <Input
          type="text"
          name="name"
          placeholder="이름"
          value={formData.name}
          onChange={handleChange}
        />
        <Input
          type="text"
          name="nickname"
          placeholder="닉네임"
          value={formData.nickname}
          onChange={handleChange}
        />
        <Input
          type="text"
          name="telNumber"
          placeholder="전화번호"
          value={formData.telNumber}
          onChange={handleChange}
        />
        <SelectBox
          name="localSi"
          value={formData.localSi}
          onChange={(e) => {
            setFormData((prev) => ({
              ...prev,
              localSi: e.target.value,
              localGu: "",
            }));
          }}
        >
          <Option value="">시 선택</Option>
          {regions.map((city) => (
            <Option key={city} value={city[0]}>
              {city[1]}
            </Option>
          ))}
        </SelectBox>
        {formData.localSi && allSis[formData.localSi] && (
          <SelectBox
            name="localGu"
            value={formData.localGu}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                localGu: e.target.value,
              }));
            }}
          >
            <Option value="">군/구 선택</Option>
            {allSis[formData.localSi].map((district) => (
              <Option key={district} value={district[0]}>
                {district[1]}
              </Option>
            ))}
          </SelectBox>
        )}
        <Button type="submit">가입하기</Button>
      </SignupFormWrapper>
    </SignupContainer>
  );
};
export default SignupContents;
