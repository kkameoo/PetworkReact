import React, { useState } from "react";

function Report({ postId, userId }) {
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [reportReason, setReportReason] = useState(1);
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
      uid: userId,
      pid: Number(postId),
      report_id: reportReason,
      isConfirm: false,
    };

    console.log("신고 데이터:", reportData);

    try {
      const response = await fetch("http://localhost:8087/api/board/report", {
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
        `http://localhost:8087/api/board/report/${postId}/reportCnt`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ report_cnt: 1 }), // report_cnt 값을 1로 설정
        }
      );

      if (!updateResponse.ok) {
        throw new Error("report_cnt 업데이트 실패");
      }

      // alert("report_cnt가 업데이트되었습니다.");
    } catch (error) {
      console.error("🚨 신고 오류:", error);
      alert("신고 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      {/* 신고하기 버튼 */}
      <button className="detail-report-button" onClick={handleOpenReportPopup}>
        🚨 신고하기
      </button>

      {/* 신고 팝업 */}
      {showReportPopup && (
        <div className="detail-report-popup">
          <div className="detail-popup-content">
            <h3>게시글 신고</h3>
            <p>신고 사유를 선택해주세요.</p>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(Number(e.target.value))}
            >
              <option value="">-- 신고 사유 선택 --</option>
              {reportReasons.map(([id, reason]) => (
                <option key={id} value={id}>
                  {reason}
                </option>
              ))}
            </select>
            <div className="detail-popup-buttons">
              <button
                className="detail-submit-button"
                onClick={handleReportSubmit}
              >
                신고하기
              </button>
              <button
                className="detail-cancel-button"
                onClick={handleCloseReportPopup}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Report;
