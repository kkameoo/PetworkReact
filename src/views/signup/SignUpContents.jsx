import React, { useState } from "react";

const SignupContents = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const regionData = {
    시: [
      "서울시",
      "수원시",
      "성남시",
      "안양시",
      "부천시",
      "광명시",
      "평택시",
      "시흥시",
      "안산시",
      "고양시",
      "과천시",
      "구리시",
      "남양주시",
      "오산시",
      "화성시",
      "김포시",
      "광주시",
      "하남시",
      "이천시",
      "양평군",
      "동두천시",
      "포천시",
      "인천시",
    ],
    군구: [
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
      "장안구",
      "권선구",
      "팔달구",
      "영통구",
      "수정구",
      "중원구",
      "분당구",
      "만안구",
      "동안구",
      "원미구",
      "소사구",
      "오정구",
      "광명구",
      "평택구",
      "시흥구",
      "단원구",
      "상록구",
      "덕양구",
      "일산동구",
      "일산서구",
      "과천구",
      "구리구",
      "남양주구",
      "오산구",
      "화성구",
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

  const handleSignup = async () => {
    if (password !== passwordCheck) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const userData = {
      name: name,
      nickname: nickname,
      password: password,
      tel_number: phone,
      email: email,
      local_si: selectedCity,
      local_gu: selectedDistrict,
      preference: 0,
      reg_date: new Date().toISOString(),
      update: new Date().toISOString(),
    };

    try {
      const response = await fetch("http://localhost:8087/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("회원가입에 실패했습니다.");
      }

      const data = await response.json();
      console.log("회원가입 성공:", data);
      alert("회원가입 성공!");
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert(error.message);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>회원가입</h1>

      {/* 아이디 입력 */}
      <div style={{ marginBottom: "16px" }}>
        <label>아이디</label>
        <input
          type="text"
          placeholder="아이디 입력"
          value={id}
          onChange={(e) => setId(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
      </div>

      {/* 비밀번호 입력 */}
      <div style={{ marginBottom: "16px" }}>
        <label>비밀번호</label>
        <input
          type="password"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
      </div>

      {/* 비밀번호 확인 입력 */}
      <div style={{ marginBottom: "16px" }}>
        <label>비밀번호 확인</label>
        <input
          type="password"
          placeholder="비밀번호 확인"
          value={passwordCheck}
          onChange={(e) => setPasswordCheck(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
      </div>

      {/* 닉네임 입력 */}
      <div style={{ marginBottom: "16px" }}>
        <label>이름 / 닉네임</label>
        <input
          type="text"
          placeholder="이름 또는 닉네임 입력"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
      </div>

      {/* 전화번호 입력 */}
      <div style={{ marginBottom: "16px" }}>
        <label>전화번호</label>
        <input
          type="text"
          placeholder="전화번호 입력"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
      </div>

      {/* 이메일 입력 */}
      <div style={{ marginBottom: "16px" }}>
        <label>Email</label>
        <input
          type="email"
          placeholder="이메일 입력"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
      </div>

      {/* 생년월일 입력 */}
      <div style={{ marginBottom: "16px" }}>
        <label>생년월일</label>
        <input
          type="date"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
      </div>

      {/* 시 선택 */}
      <div style={{ marginBottom: "16px" }}>
        <label>시</label>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          style={{ width: "103.4%", padding: "8px", marginBottom: "10px" }}
        >
          <option value="">시를 선택하세요</option>
          {regionData.시.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* 군구 선택 */}
      {selectedCity && (
        <div style={{ marginBottom: "16px" }}>
          <label>군/구</label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            style={{ width: "103.4%", padding: "8px", marginBottom: "10px" }}
          >
            <option value="">군/구를 선택하세요</option>
            {regionData.군구.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 성별 선택 */}
      <div style={{ marginBottom: "16px" }}>
        <label>성별</label>
        <div style={{ display: "flex", gap: "20px", marginBottom: "24px" }}>
          <div
            style={{
              flex: 1,
              padding: "16px",
              backgroundColor: gender === "남성" ? "#6B7280" : "#F3F4F6",
              color: gender === "남성" ? "white" : "#4B5563",
              borderRadius: "8px",
              textAlign: "center",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer",
            }}
            onClick={() => setGender("남성")}
          >
            남성
          </div>
          <div
            style={{
              flex: 1,
              padding: "16px",
              backgroundColor: gender === "여성" ? "#6B7280" : "#F3F4F6",
              color: gender === "여성" ? "white" : "#4B5563",
              borderRadius: "8px",
              textAlign: "center",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer",
            }}
            onClick={() => setGender("여성")}
          >
            여성
          </div>
        </div>
      </div>

      {/* 회원가입 버튼 */}
      <button
        onClick={handleSignup}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        회원가입
      </button>
    </div>
  );
};

export default SignupContents;
