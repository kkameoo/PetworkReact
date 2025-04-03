import React from "react";
import styled from "styled-components";

const FooterContainer = styled.footer`
  background-color: #f8f9fa;
  padding: 20px;
  font-size: 14px;
  color: #333;
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
`;

const FooterSection = styled.div`
  flex: 1;
  min-width: 250px;
  margin: 10px;

  a {
    text-decoration-line: none;
  }

  h4 {
    margin-left: 30px;
    font-size: 16px;
    margin-bottom: 10px;
    color: #ac6f37;
  }
`;

const ContactBtn = styled.button`
  display: block;
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &.kakao {
    background-color: #fee500;
    color: #000;
  }

  &.naver {
    background-color: #03c75a;
    color: #fff;
  }
`;

const FooterBottom = styled.div`
  text-align: center;
  margin-top: 20px;
  padding-top: 10px;
  border-top: 1px solid #ddd;
`;

const FooterLinks = styled.div`
  margin-top: 10px;

  a {
    margin: 0 10px;
    text-decoration: none;
    color: #333;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h4>거래 안내</h4>
          <p>직거래 및 택배거래 가능</p>
          <p>교환/반품 관련 사항은 판매자와 협의 필요</p>
          <h4>앱 다운로드</h4>
          <div className="footer-qr">
            {/* <QRCodeGenerator url="http://192.168.0.61/" /> */}
          </div>
        </FooterSection>

        <FooterSection>
          <h4>고객센터</h4>
          <p>문의사항은 빠르게 답변해 드립니다.</p>
          <a href="https://open.kakao.com/o/gsQNncVg">
            <ContactBtn className="kakao">카카오톡 문의하기</ContactBtn>
          </a>
          <a href="https://help.naver.com/index.help">
            <ContactBtn className="naver">네이버 문의하기</ContactBtn>
          </a>
          <p>운영시간: 월-금 10:00 - 18:00 (점심 12:00 - 13:00)</p>
          <p>(주말 및 공휴일 휴무)</p>
        </FooterSection>

        <FooterSection>
          <h4>공지사항</h4>
          <ul>
            <p>🚨안전한 만남을 위한 유의사항</p>
            <p>🚨사기 예방 가이드</p>
            <p>🚨새로운 기능 업데이트 안내</p>
          </ul>
        </FooterSection>

        <FooterSection>
          <h4>ABOUT 펫트워크</h4>
          <p>(주)펫트워크</p>
          <p>대표이사: 나!현석</p>
          <p>주소: 서울특별시 멍멍구 야옹이동 123-45</p>
          <p>사업자 등록번호: 123-45-67890</p>
          <p>고객문의: support@petwalk.com</p>
        </FooterSection>
      </FooterContent>

      <FooterBottom>
        <p>Copyright © 2025 펫트워크. All Rights Reserved.</p>
        <FooterLinks>
          <a href="#">이용약관</a>
          <a href="#">개인정보처리방침</a>
          <a href="#">파트너쉽</a>
          <a href="#">FAQ</a>
        </FooterLinks>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer;
