import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ChatContainer = styled.div`
  min-height: 600px;
  display: flex;
  flex-direction: row;
  width: 1000px;
  margin: auto;
  padding: 1rem;
  background-color: #a2e4b8;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const UserContainer = styled.div`
  width: 200px;
  background-color: white;
  padding: 1rem;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ChatBox = styled.div`
  width: 900px;
  height: 500px;
  display: flex;
  flex-wrap: wrap;
`;
const Title = styled.h2`
  padding-left: 10px;
  width: 300px;
  height: 30px;
`;

const MessageList = styled.div`
  width: 600px;
  display: flex;
  flex-direction: column-reverse;
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
  width: 140px;
  border: 3px solid #a2e4b8;
  border-radius: 3px;
  padding: 5px;
  margin-bottom: 5px;
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
  left: 25%;
  transform: translate(0, -50%);
  width: calc(95% - 220px);
`;

const Input = styled.input`
  flex-grow: 1;
  padding: 10px;
  border-radius: 20px;
  border: 1px solid #ccc;
  font-size: 14px;
`;

const SendButton = styled.button`
  background-color: white;
  color: black;
  border: none;
  padding: 10px 15px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    background-color: #afafaf;
  }
`;

const ChatRoomList = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 8px;
  max-height: 300px; /* 최대 높이 설정 (조절 가능) */
  overflow-y: auto; /* 채팅방이 많으면 스크롤 생성 */
  padding-right: 5px; /* 스크롤바와 간격 */
`;

const ChatRoomButton = styled.button`
  margin-bottom: 5px;
  background-color: #ffffff;
  color: black;
  border: 3px solid #a2e4b8;
  padding: 8px 12px;
  border-radius: 5px;
  font-size: 14px;
  width: 150px;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.2s, color 0.2s;

  &:hover {
    background-color: #66d69e;
    color: white;
  }
`;

const RoomContents = () => {
  const SOCKET_URL = `${import.meta.env.VITE_API_URL}/ws/chat`;
  const API_URL = `${import.meta.env.VITE_API_URL}/api`;
  const [chatrooms, setChatrooms] = useState([]);
  const [chatroom, setChatroom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [roomUserlist, setRoomUserList] = useState([]);
  const [connectedUser, setConnectedUser] = useState("");

  const chatroomRef = useRef(null);
  const userRef = useRef(null);
  const stompClientRef = useRef(null);
  const messageListRef = useRef(null);
  const { postId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleConnectUser = () => {
    const list = roomUserlist.map((user) => {
      connectedUser.map((cUser) => {
        if (cUser.userId === user.userId) {
          user.connected = true;
        }
      });
      return user;
    });
    setRoomUserList(list);
  };

  const getChatHistory = async () => {
    try {
      const response = await fetch(API_URL + "/chat/" + postId, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        const jsonData = data.map((item) => {
          const getdata = JSON.parse(item);
          const data = {
            chatroomId: getdata.chatroomId,
            sender: getdata.sender,
            content: getdata.content,
            messageType: getdata.messageType,
            regDate: new Date(getdata.regDate).toLocaleString(),
          };
          return data;
        });
        // jsonData.reverse();
        setMessages(jsonData);
      }
    } catch (error) {
      console.error("채팅 내역 가져오기 실패", error);
    }
  };

  const getChatrooms = async () => {
    try {
      const response = await fetch(
        API_URL + "/chat/room/byuser/" + user.userId,
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
      const response = await fetch(API_URL + "/chat/room/board/" + postId, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setChatroom(data);
      }
    } catch (error) {
      console.error("채팅 방 정보 가져오기 실패", error);
    }
  };

  const getChatroomUserList = async () => {
    try {
      const response = await fetch(
        API_URL + "/chat/room/userlist/" + chatroom.chatroomId,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const responseData = await response.text();

      if (response.ok) {
        console.log(responseData);
        const jsonData = JSON.parse(responseData);
        const updatedData = jsonData.map((data) => ({
          ...data,
          connected: false,
        }));
        setRoomUserList(updatedData);
      } else {
        console.log(responseData);
      }
    } catch (error) {
      console.error("채팅 방 유저 정보 가져오기 실패", error);
    }
  };

  const checkUserlist = async () => {
    if (!chatroom || !user) return;
    const roomUserData = {
      chatroomId: chatroom.chatroomId,
      userId: user.userId,
      userName: user.nickname,
    };

    try {
      const response = await fetch(API_URL + "/chat/room/userlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roomUserData),
        credentials: "include",
      });
      const responseData = await response.text();
      if (response.ok && responseData == "NoInsert") {
        console.log(responseData);
      } else if (response.ok) {
        console.log(responseData);
      }
    } catch (error) {
      console.error("오류:", error.message);
    }
    getChatroomUserList();
  };

  useEffect(() => {
    // checkLoginStatus();
    getChatHistory();
    getRoomInfo();
  }, []);

  useEffect(() => {
    if (!chatroom || !user) return;
    checkUserlist();

    chatroomRef.current = chatroom;
    userRef.current = user;

    const socket = new SockJS(SOCKET_URL);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("WebSocket Connected");
        // 채팅방 구독
        stompClient.subscribe("/topic/messages", (msg) => {
          const postData = JSON.parse(msg.body);
          const data = {
            chatroomId: postData.chatroomId,
            sender: postData.sender,
            content: postData.content,
            messageType: postData.messageType,
            regDate: new Date(postData.regDate).toLocaleString(),
          };
          setMessages((prev) => [data, ...prev]);
        });
        // 채팅 접속중인 유저 리스트 구독
        stompClient.subscribe("/topic/userlist", (msg) => {
          setConnectedUser(
            JSON.parse(msg.body).map((data) => JSON.parse(data))
          );
        });
        if (chatroom.chatroomId && user.userId) {
          stompClient.publish({
            destination: "/app/chat/join",
            body: JSON.stringify({
              chatroomId: chatroom.chatroomId,
              userId: user.userId,
              userName: user.nickname,
            }),
          });
        }
      },
      onStompError: (frame) => console.error("Error: ", frame),
    });
    stompClient.activate();
    stompClientRef.current = stompClient;

    const handleBeforeUnload = () => {
      if (stompClientRef.current && chatroomRef.current && userRef.current) {
        stompClientRef.current.publish({
          destination: "/app/chat/leave",
          body: JSON.stringify({
            chatroomId: chatroomRef.current.chatroomId,
            userId: userRef.current.userId,
            userName: userRef.current.nickname,
          }),
        });
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      if (stompClientRef.current && chatroomRef.current && userRef.current) {
        stompClientRef.current.publish({
          destination: "/app/chat/leave",
          body: JSON.stringify({
            chatroomId: chatroomRef.current.chatroomId,
            userId: userRef.current.userId,
            userName: userRef.current.nickname,
          }),
        });
      }
      stompClient.deactivate();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [user, chatroom]);

  useEffect(() => {
    if (user !== null && user !== undefined) {
      getChatrooms();
    }
  }, [user]);

  useEffect(() => {
    if (!roomUserlist || !connectedUser) return;
    handleConnectUser();
  }, [connectedUser]);

  const sendMessage = () => {
    if (!message.trim()) return;
    stompClientRef.current.publish({
      destination: "/app/chat",
      body: JSON.stringify({
        chatroomId: chatroom.chatroomId,
        sender: user.nickname,
        content: message,
        messageType: 3,
        regDate: new Date().toISOString(),
      }),
    });
    console.log(user.nickname);
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
  const goToDetail = (postId) => {
    navigate(`/room/${postId}`);
    window.location.reload();
  };
  if (!user) return <div>인증이 필요...</div>;
  if (!chatroom || !user || !connectedUser || !roomUserlist)
    return <div>로딩 중...</div>;

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
        <h2>유저</h2>
        <div>
          ------------ (Redis 저장소)
          {connectedUser.length === 0 ? (
            <p>접속 중인 유저 없음</p>
          ) : (
            <div>
              {connectedUser.map((user, idx) => (
                <div key={idx}>{user.userName}</div>
              ))}
            </div>
          )}
          ------------
        </div>
        <div>
          {roomUserlist.length === 0 ? (
            <p>유저 없음</p>
          ) : (
            <div>
              {roomUserlist.map((user, idx) => (
                <UserName key={idx}>
                  {user.userName}
                  {user.connected && (
                    <span style={{ color: "green" }}> ● </span>
                  )}
                </UserName>
              ))}
            </div>
          )}
        </div>

        <h2>채팅 방</h2>
        <ChatRoomList>
          {chatrooms.length === 0 ? (
            <p>나의 채팅방들을 불러오는 중...</p>
          ) : (
            <div>
              {chatrooms.map((room, idx) => (
                <ChatRoomButton
                  key={idx}
                  onClick={() => goToDetail(room.boardId)}
                >
                  {room.chatroomName}
                </ChatRoomButton>
              ))}
            </div>
          )}
        </ChatRoomList>
      </UserContainer>
      <ChatBox>
        <Title>{chatroom.chatroomName}</Title>
        {messages.length === 0 ? (
          <p>메시지...</p>
        ) : (
          <MessageList>
            {messages.map((msg, idx) => (
              <Message key={idx}>
                <b>{msg.sender}: </b> {msg.content}
                <Timestamp>{msg.regDate}</Timestamp>
              </Message>
            ))}
            <div ref={messageListRef}></div>
          </MessageList>
        )}
      </ChatBox>
      <InputContainer>
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지를 입력하세요..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // 기본 동작(줄 바꿈) 방지
              sendMessage();
            }
          }}
        />
        <SendButton onClick={sendMessage}>전송</SendButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default RoomContents;
