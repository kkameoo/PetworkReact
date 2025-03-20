import { useState } from "react"; 

function BoardPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(1);
  // const [location, setLocation] = useState("");
  const [selectedRegion, setSelectedRegion] = useState({ 시: '', 군구: '' });

  const regionData = { 
    시: ['서울시', '수원시', '성남시', '안양시', '부천시', '광명시', '평택시', '시흥시', '안산시', '고양시', '과천시', '구리시', '남양주시', '오산시', '화성시', '김포시', '광주시', '하남시', '이천시', '양평군', '동두천시', '포천시', '인천시'],
    군구: ['종로구', '중구', '용산구', '성동구', '광진구', '동대문구', '중랑구', '강북구', '도봉구', '노원구', '은평구', '서대문구', '마포구', '양천구', '강서구', '구로구', '금천구', '영등포구', '동작구', '관악구', '서초구', '강남구', '송파구', '강동구', '장안구', '권선구', '팔달구', '영통구', '수정구', '중원구', '분당구', '만안구', '동안구', '원미구', '소사구', '오정구', '광명구', '평택구', '시흥구', '단원구', '상록구', '덕양구', '일산동구', '일산서구', '과천구', '구리구', '남양주구', '오산구', '화성구', '중구(인천)', '동구(인천)', '미추홀구', '연수구', '남동구', '부평구', '계양구', '서구(인천)', '강화군', '옹진군'],
  };

  const handleRegionChange = (type, value) => {
    setSelectedRegion((prev) => ({ ...prev, [type]: value }));
  };

  const handleSubmit = () => {
    console.log("Posting", { title, content, category, location });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#ffffff", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "600px", padding: "40px", backgroundColor: "white", borderRadius: "12px", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "bold", textAlign: "center", marginBottom: "32px" }}>게시판 작성</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{ fontSize: "18px", fontWeight: "600" }}>제목</label>
            <input 
              type="text" 
              placeholder="제목 입력" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              style={{ border: "1px solid #ccc", padding: "14px", borderRadius: "6px", width: "100%", marginTop: "6px", fontSize: "16px" }}
            />
          </div>
          <div>
            <label style={{ fontSize: "18px", fontWeight: "600" }}>내용</label>
            <textarea 
              placeholder="내용 입력" 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              style={{ border: "1px solid #ccc", padding: "14px", borderRadius: "6px", width: "100%", marginTop: "6px", fontSize: "16px", height: "150px" }}
            />
          </div>
          <div>
            <label style={{ fontSize: "18px", fontWeight: "600" }}>크기?</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(Number(e.target.value))} 
              style={{ border: "1px solid #ccc", padding: "14px", borderRadius: "6px", width: "100%", marginTop: "6px", fontSize: "16px" }}
            >
              <option value={1}>소형</option>
              <option value={2}>중형</option>
              <option value={3}>대형</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: "18px", fontWeight: "600" }}>시/구</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <select 
                value={selectedRegion.시} 
                onChange={(e) => handleRegionChange('시', e.target.value)} 
                style={{ border: "1px solid #ccc", padding: "14px", borderRadius: "6px", width: "48%", fontSize: "16px" }}
              >
                <option value="">시 선택</option>
                {regionData.시.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <select 
                value={selectedRegion.군구} 
                onChange={(e) => handleRegionChange('군구', e.target.value)} 
                style={{ border: "1px solid #ccc", padding: "14px", borderRadius: "6px", width: "48%", fontSize: "16px" }}
              >
                <option value="">구/군 선택</option>
                {regionData.군구.map((district) => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>
          </div>
          <button 
            style={{ width: "100%", backgroundColor: "#00BFFF", color: "white", padding: "14px", borderRadius: "6px", marginTop: "20px", fontSize: "18px", fontWeight: "bold", cursor: "pointer", border: "none" }}
            onClick={handleSubmit}
          >
            글 작성
          </button>
        </div>
      </div>
    </div>
  );
}

export default BoardPage;
