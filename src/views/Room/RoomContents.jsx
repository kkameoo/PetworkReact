import React, { useState, useEffect } from "react";
import styled from "styled-components";

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  margin: auto;
  padding: 1rem;
  background-color: #bae3f3;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 400px;
  overflow-y: auto;
  padding: 10px;
`;

const Message = styled.div`
  display: flex;
  justify-content: ${(props) => (props.isUser1 ? "flex-end" : "flex-start")};
`;

const Bubble = styled.div`
  max-width: 60%;
  padding: 10px 15px;
  border-radius: 15px;
  background-color: ${(props) => (props.isUser1 ? "#007AFF" : "#E5E5EA")};
  color: ${(props) => (props.isUser1 ? "white" : "black")};
  font-size: 14px;
  word-wrap: break-word;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const Input = styled.input`
  flex-grow: 1;
  padding: 10px;
  border-radius: 20px;
  border: 1px solid #ccc;
  font-size: 14px;
`;

const SendButton = styled.button`
  background-color: #007aff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    background-color: #005ecb;
  }
`;

const RoomContents = () => {
  const [messages, setMessages] = useState([
    { sender: "USER2", text: "안녕!" },
    { sender: "USER1", text: "안녕! 반가워!" },
  ]);
  const [inputText, setInputText] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const checkLoginStatus = async () => {
    try {
      const response = await fetch("http://localhost:8087/api/user/session", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.userId); // 현재 로그인한 유저 ID 저장
      }
    } catch (error) {
      console.error("로그인 상태 확인 실패:", error);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const sendMessage = () => {
    if (inputText.trim() === "" || !currentUser) return;
    setMessages([...messages, { sender: "USER1", text: inputText }]);
    setInputText("");
  };

  return (
    <ChatContainer>
      <MessageList>
        {messages.map((msg, index) => (
          <Message key={index} isUser1={msg.sender === "USER1"}>
            <Bubble isUser1={msg.sender === "USER1"}>{msg.text}</Bubble>
          </Message>
        ))}
      </MessageList>
      <InputContainer>
        <Input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="메시지를 입력하세요..."
        />
        <SendButton onClick={sendMessage}>전송</SendButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default RoomContents;
