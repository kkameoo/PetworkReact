import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
const SignupContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
`;
const Title = styled.h2`
  color: #333;
  margin-bottom: 20px;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
const Input = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;
const Select = styled.select`
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  background: white;
  cursor: pointer;
`;
const Button = styled.button`
  background-color: #ff8c00;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background-color: #e07b00;
  }
`;
const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
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
  background-color: #ff8c00;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #e07b00;
  }
`;

const SignupContents = () => {
  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    password: "",
    confirmPassword: "",
    tel_number: "",
    email: "",
    birthdate: "",
    gender: "",
    selectedCity: "",
    selectedDistrict: "",
    recommend_uid: "",
    register_date: new Date().toISOString(),
    is_deleted: false,
    is_admin: false,
    upd_date: new Date().toISOString(),
    verificationCode: "", // ✅ 인증 코드 추가
  });
  const API_USER_URL = `http://localhost:8087/api/user`;
  const API_EMAIL_VERIFICATION_URL = `http://localhost:8087/api/email/send`;
  const API_EMAIL_VERIFY_URL = `http://localhost:8087/api/email/verify`;

  // const [birthdate, setBirthdate] = useState("");
  // const [gender, setGender] = useState("");
  // const [selectedCity, setSelectedCity] = useState("");
  // const [selectedDistrict, setSelectedDistrict] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const { confirmPassword, ...formDataToSend } = formData;
  const navigate = useNavigate();
  const regionData = {
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
    평택시: ["평택구", "시흥구", "단원구", "상록구"],
    시흥시: ["시흥구"],
    안산시: ["단원구", "상록구"],
    고양시: ["덕양구", "일산동구", "일산서구"],
    과천시: ["과천구"],
    구리시: ["구리구"],
    남양주시: ["남양주구"],
    오산시: ["오산구"],
    화성시: ["화성구"],
    김포시: ["김포구"],
    광주시: ["광주구"],
    하남시: ["하남구"],
    이천시: ["이천구"],
    양평군: ["양평군"],
    동두천시: ["동두천시"],
    포천시: ["포천시"],
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
  // const regionData = {
  //   시: [
  //     "서울시",
  //     "수원시",
  //     "성남시",
  //     "안양시",
  //     "부천시",
  //     "광명시",
  //     "평택시",
  //     "시흥시",
  //     "안산시",
  //     "고양시",
  //     "과천시",
  //     "구리시",
  //     "남양주시",
  //     "오산시",
  //     "화성시",
  //     "김포시",
  //     "광주시",
  //     "하남시",
  //     "이천시",
  //     "양평군",
  //     "동두천시",
  //     "포천시",
  //     "인천시",
  //   ],
  //   군구: [
  //     "종로구",
  //     "중구",
  //     "용산구",
  //     "성동구",
  //     "광진구",
  //     "동대문구",
  //     "중랑구",
  //     "강북구",
  //     "도봉구",
  //     "노원구",
  //     "은평구",
  //     "서대문구",
  //     "마포구",
  //     "양천구",
  //     "강서구",
  //     "구로구",
  //     "금천구",
  //     "영등포구",
  //     "동작구",
  //     "관악구",
  //     "서초구",
  //     "강남구",
  //     "송파구",
  //     "강동구",
  //     "장안구",
  //     "권선구",
  //     "팔달구",
  //     "영통구",
  //     "수정구",
  //     "중원구",
  //     "분당구",
  //     "만안구",
  //     "동안구",
  //     "원미구",
  //     "소사구",
  //     "오정구",
  //     "광명구",
  //     "평택구",
  //     "시흥구",
  //     "단원구",
  //     "상록구",
  //     "덕양구",
  //     "일산동구",
  //     "일산서구",
  //     "과천구",
  //     "구리구",
  //     "남양주구",
  //     "오산구",
  //     "화성구",
  //     "중구(인천)",
  //     "동구(인천)",
  //     "미추홀구",
  //     "연수구",
  //     "남동구",
  //     "부평구",
  //     "계양구",
  //     "서구(인천)",
  //     "강화군",
  //     "옹진군",
  //   ],
  // };
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
  const handleRegionChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      selectedDistrict: "", // 시를 변경하면 군/구는 초기화
    }));
  };

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
  // const EmailVerificationModal = ({ onClose, onVerifyCode }) => {
  //   const [code, setCode] = useState("");

  //   const handleCodeChange = (e) => {
  //     setCode(e.target.value);
  //   };

  //   const handleVerify = () => {SignupContainer
  //     onVerifyCode(code);
  //     onClose(); // Close the modal after verification
  //   };
  // };
  const handleCloseModal = () => {
    setModalVisible(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^\d{10,11}$/;
    console.log(formData);
    // 회원가입 처리 로직 추가

    // if (
    //   !formData.name.trim() ||
    //   !formData.nickname.trim() ||
    //   !formData.tel_number.trim() ||
    //   !formData.email.trim()
    // ) {
    //   alert("모든 필수 입력란을 채워주세요.");
    //   return;
    // }
    if (!isEmailVerified) {
      alert("이메일 인증을 완료해주세요.");
      return;
    }
    if (!phoneRegex.test(formData.tel_number)) {
      alert("전화번호는 숫자만 입력해야 하며, 10~11자리여야 합니다.");
      return;
    }
    if (!passwordMatch) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!emailRegex.test(formData.email)) {
      alert("올바른 이메일 형식을 입력하세요.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8087/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("회원가입 실패");
      alert("회원가입 성공! 로그인 페이지로 이동합니다.");
      navigate("/loginPage");
    } catch (error) {
      console.error("회원가입 오류:", error);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };
  return (
    <SignupContainer>
      <Title>회원가입</Title>
      <Form onSubmit={handleSubmit}>
        {/* 이메일 입력 */}
        <Input
          type="email"
          name="email"
          value={formData.email}
          disabled={isEmailVerified}
          placeholder="이메일 인증을 먼저해주세요."
        />
        <button
          type="button"
          onClick={() => setModalVisible(true)}
          disabled={isEmailVerified}
        >
          이메일 인증
        </button>
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

        {isEmailVerified && <p>이메일 인증 완료 ✅</p>}

        {/* 비밀번호 입력 */}
        <Input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={formData.password}
          onChange={handleChange}
        />
        <p>{passwordStrength}</p>
        {/* 비밀번호 확인 입력 */}
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
        {/* 이름 입력 */}
        <Input
          type="text"
          name="name"
          placeholder="이름"
          value={formData.name}
          onChange={handleChange}
        />
        {/* 닉네임 입력 */}
        <Input
          type="text"
          name="nickname"
          placeholder="닉네임"
          value={formData.nickname}
          onChange={handleChange}
        />
        {/* 전화번호 입력 */}
        <Input
          type="text"
          name="tel_number"
          placeholder="전화번호"
          value={formData.tel_number}
          onChange={handleChange}
        />
        {/* 생년월일 입력 */}
        <Input
          type="date"
          name="birthdate"
          value={formData.birthdate}
          // onChange={handleChange}
          onChange={handleChange}
        />
        {/* 시 선택 */}
        {/* <div>
          <label>시</label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="">시를 선택하세요</option>
            {regionData.시.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div> */}
        {/* 군구 선택 */}
        {/* {selectedCity && (
          <div>
            <label>군/구</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
            >
              <option value="">군/구를 선택하세요</option>
              {regionData.군구.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>
        )} */}
        <select
          name="selectedCity"
          value={formData.selectedCity}
          onChange={handleRegionChange}
        >
          <option value="">시 선택</option>
          {regionData.시 &&
            regionData.시.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
        </select>
        {/* {formData.selectedCity && regionData[formData.selectedCity] && (
          <select
            name="selectedDistrict"
            value={formData.selectedDistrict}
            onChange={handleRegionChange}
            disabled={!formData.selectedCity}
          >
            <option value="">군/구 선택</option>
            {regionData.군구[formData.selectedCity] ? (
              regionData[formData.selectedCity].map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))
            ) : (
              <option value="">군/구 정보가 없습니다</option>
            )}
          </select>
        )} */}
        {formData.selectedCity && regionData[formData.selectedCity] && (
          <select
            name="selectedDistrict"
            value={formData.selectedDistrict}
            onChange={handleRegionChange}
          >
            <option value="">군/구 선택</option>
            {regionData[formData.selectedCity] &&
              regionData[formData.selectedCity].map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
          </select>
        )}
        {/* 성별 선택 */}
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="">성별 선택</option>
          <option value="male">남성</option>
          <option value="female">여성</option>
        </select>
        {/* 회원가입 버튼 */}
        <Button type="submit">가입하기</Button>
      </Form>
    </SignupContainer>
  );
};
export default SignupContents;
