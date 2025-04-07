import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80vh;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 2rem;
`;

const LoginButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 0.7rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #45a049;
  }
`;
const DogImage = styled.img`
  width: 180px;
  height: auto;
  margin-bottom: 1.5rem;
  animation: float 3s ease-in-out infinite;

  @keyframes float {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
    100% {
      transform: translateY(0px);
    }
  }
`;

function UserCheck() {
  const navigate = useNavigate();
  const DEFAULT_IMAGE = "/src/assets/walkdog.png";

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <Container>
      <DogImage src={DEFAULT_IMAGE} />
      <Title>로그인이 필요합니다</Title>
      <Message>
        이 페이지를 보려면 로그인이 필요해요. 로그인 페이지로 이동해 주세요.
      </Message>
      <LoginButton onClick={goToLogin}>로그인 하러 가기</LoginButton>
    </Container>
  );
}
export default UserCheck;
