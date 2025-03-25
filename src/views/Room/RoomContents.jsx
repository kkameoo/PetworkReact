import React, { useState, useEffect } from "react";
import styled from "styled-components";

const ChatContainer = styled.div`
  min-height: 600px;
  display: flex;
  flex-direction: row;
  width: 1000px;
  margin: auto;
  padding: 1rem;
  background-color: #bae3f3;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const UserContainer = styled.div`
  width: 200px;
  background-color: #d3e8f0;
  padding: 1rem;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 400px;
  overflow-y: auto;
  padding: 10px;
  flex-grow: 1;
`;

const Message = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.isUser1 ? "flex-end" : "flex-start")};
`;

const UserName = styled.div`
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 3px;
  color: #555;
`;

const Bubble = styled.div`
  max-width: 60%;
  padding: 10px 15px;
  border-radius: 15px;
  background-color: ${(props) => (props.isUser1 ? "#007AFF" : "#E5E5EA")};
  color: ${(props) => (props.isUser1 ? "white" : "black")};
  font-size: 14px;
  word-wrap: break-word;
  position: relative;
`;

const Timestamp = styled.div`
  font-size: 10px;
  color: #666;
  margin-top: 5px;
  text-align: ${(props) => (props.isUser1 ? "right" : "left")};
`;

const InputContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translate(0, -50%);
  width: calc(70% - 220px);
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
    {
      sender: "USER2",
      text: "안녕!",
      timestamp: new Date().toLocaleTimeString(),
    },
    {
      sender: "USER1",
      text: "안녕! 반가워!",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(["USER1", "USER2"]);

  const checkLoginStatus = async () => {
    try {
      const response = await fetch("http://localhost:8087/api/user/session", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.userId);
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
    setMessages([
      ...messages,
      {
        sender: "USER1",
        text: inputText,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
    setInputText("");
  };

  return (
    <ChatContainer>
      <UserContainer>
        <h4>접속 중인 유저</h4>
        {users.map((user, index) => (
          <div key={index}>{user}</div>
        ))}
      </UserContainer>
      <MessageList>
        {messages.map((msg, index) => (
          <Message key={index} isUser1={msg.sender === "USER1"}>
            {msg.sender === "USER2" && <UserName>{msg.sender}</UserName>}
            <Bubble isUser1={msg.sender === "USER1"}>{msg.text}</Bubble>
            <Timestamp isUser1={msg.sender === "USER1"}>
              {msg.timestamp}
            </Timestamp>
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
