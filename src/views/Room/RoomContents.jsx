import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

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
  const SOCKET_URL = "http://localhost:8087/ws";
  // const [messages, setMessages] = useState([
  //   {
  //     sender: "USER2",
  //     text: "안녕!",
  //     timestamp: new Date().toLocaleTimeString(),
  //   },
  //   {
  //     sender: "USER1",
  //     text: "안녕! 반가워!",
  //     timestamp: new Date().toLocaleTimeString(),
  //   },
  // ]);
  // const [inputText, setInputText] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  // const [users, setUsers] = useState(["USER1", "USER2"]);
  const [chatrooms, setChatrooms] = useState([]);
  const [chatroom, setChatroom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const stompClientRef = useRef(null);
  const { postId } = useParams();
  const { user } = useAuth();
  // console.log(user);

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

  const getChatHistory = async () => {
    try {
      const response = await fetch("http://localhost:8087/api/chat/" + postId, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        const jsonData = data.map((item) => JSON.parse(item));
        jsonData.reverse();
        setMessages(jsonData);
      }
    } catch (error) {
      console.error("채팅 내역 가져오기 실패", error);
    }
  };

  const getChatrooms = async () => {
    try {
      const response = await fetch(
        "http://localhost:8087/api/chat/room/byuser/" + user.userId,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setChatrooms(data);
      }
    } catch (error) {
      console.error("채팅 방 이름 가져오기 실패", error);
    }
  };

  const getRoomInfo = async () => {
    try {
      const response = await fetch(
        "http://localhost:8087/api/chat/room/board/" + postId,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setChatroom(data);
      }
    } catch (error) {
      console.error("채팅 방 정보 가져오기 실패", error);
    }
  };

  useEffect(() => {
    checkLoginStatus();
    getChatHistory();
    getRoomInfo();
    const socket = new SockJS(SOCKET_URL);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("WebSocket Connected");
        stompClient.subscribe("/topic/messages", (msg) => {
          setMessages((prev) => [...prev, JSON.parse(msg.body)]);
        });
      },
      onStompError: (frame) => console.error("Error: ", frame),
    });
    stompClient.activate();
    stompClientRef.current = stompClient;
    return () => stompClient.deactivate();
  }, []);

  useEffect(() => {
    if (user !== null && user !== undefined) {
      getChatrooms();
    }
  }, [user]);

  const sendMessage = () => {
    if (!message.trim()) return;
    stompClientRef.current.publish({
      destination: "/app/chat",
      body: JSON.stringify({
        chatroomId: chatroom.chatroomId,
        sender: "User",
        content: message,
        messageType: 3,
      }),
    });
    setMessage("");
  };

  // const sendMessage = () => {
  //   if (inputText.trim() === "" || !currentUser) return;
  //   setMessages([
  //     ...messages,
  //     {
  //       sender: "USER1",
  //       text: inputText,
  //       timestamp: new Date().toLocaleTimeString(),
  //     },
  //   ]);
  //   setInputText("");
  // };
  if (!messages || !chatroom || !user) return <div>로딩 중...</div>;

  return (
    <ChatContainer>
      {/*
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
      */}
      <UserContainer>
        <h4>접속 중인 유저</h4>
        {user.name}
        <h4>채팅 방</h4>
        <div>
          {chatrooms.length === 0 ? (
            <p>나의 채팅방들을 불러오는 중...</p>
          ) : (
            <div>
              {chatrooms.map((room, idx) => (
                <div key={idx}>{room.chatroomName}</div>
              ))}
            </div>
          )}
        </div>
      </UserContainer>
      <h2>{chatroom.chatroomName}</h2>
      {messages.length === 0 ? (
        <p>메시지를 불러오는 중...</p>
      ) : (
        <MessageList>
          {messages.map((msg, idx) => (
            <Message key={idx}>
              <b>{msg.sender}: </b> {msg.content}
              <Timestamp>{new Date().toLocaleTimeString()}</Timestamp>
            </Message>
          ))}
        </MessageList>
      )}
      <InputContainer>
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지를 입력하세요..."
        />
        <SendButton onClick={sendMessage}>전송</SendButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default RoomContents;
