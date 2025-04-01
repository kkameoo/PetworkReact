import React, { useState } from "react";
import styled from "styled-components";

const ReportButton = styled.button`
  font-size: 13px;
  background-color: #ff4d4d;
  color: white;
  padding: 8px 10px;
  border: 1px solid black;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 270px;
  /* margin-top: 50px; */
  display: flex;
  justify-content: flex-end;
  align-items: center;

  &:hover {
    background-color: #d93636;
  }
`;

const ReportPopup = styled.div`
  position: fixed;
  width: 300px;
  height: 180px;
  border: 1px solid black;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  z-index: 1000;
`;

const PopupContent = styled.div`
  text-align: center;
`;

const PopupButtons = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 15px;
`;

const SubmitButton = styled.button`
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 15px;

  &:hover {
    background-color: #d93636;
  }
`;

const CancelButton = styled.button`
  background-color: gray;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 15px;

  &:hover {
    background-color: darkgray;
  }
`;

function Report({ postId, userId }) {
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [reportReason, setReportReason] = useState(1);
  const [reportComment, setReportComment] = useState();

  // 신고 사유 목록
  const reportReasons = [
    [1, "허위 매물"],
    [2, "부적절한 게시글"],
    [3, "사기 의심"],
    [4, "기타 사유"],
  ];

  // 신고 팝업 열기
  const handleOpenReportPopup = () => {
    setShowReportPopup(true);
  };

  // 신고 팝업 닫기
  const handleCloseReportPopup = () => {
    setShowReportPopup(false);
    setReportReason(1);
  };

  // 신고 제출
  const handleReportSubmit = async () => {
    if (!reportReason) {
      alert("신고 사유를 선택해주세요.");
      return;
    }

    const reportData = {
      boardId: Number(postId),
      senderId: userId,
      reportType: Number(reportReason),
      reportComment: reportComment,
    };

    console.log("신고 데이터:", reportData);

    try {
      const response = await fetch("http://localhost:8087/api/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        throw new Error("신고 요청 실패");
      }

      alert("신고가 접수되었습니다.");
      handleCloseReportPopup();

      // 신고 완료 후 report_cnt 업데이트
      const updateResponse = await fetch(
        `http://localhost:8087/api/report/${postId}/reportCnt`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ report_cnt: 1 }),
        }
      );

      if (!updateResponse.ok) {
        throw new Error("report_cnt 업데이트 실패");
      }
    } catch (error) {
      console.error("🚨 신고 오류:", error);
      alert("신고 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <ReportButton onClick={handleOpenReportPopup}>🚨 신고하기</ReportButton>

      {showReportPopup && (
        <ReportPopup>
          <PopupContent>
            <h3>게시글 신고</h3>
            <p>신고 사유를 선택해주세요.</p>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(Number(e.target.value))}
            >
              {reportReasons.map(([id, reason]) => (
                <option key={id} value={id}>
                  {reason}
                </option>
              ))}
            </select>
            <label>신고 내용</label>
            <textarea
              value={reportComment}
              onChange={(e) => setReportComment(e.target.value)}
              required
            />
            <PopupButtons>
              <SubmitButton onClick={handleReportSubmit}>신고하기</SubmitButton>
              <CancelButton onClick={handleCloseReportPopup}>취소</CancelButton>
            </PopupButtons>
          </PopupContent>
        </ReportPopup>
      )}
    </>
  );
}

export default Report;
