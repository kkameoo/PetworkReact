import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import UserCheck from "../../components/UserCheck";

const Container = styled.div`
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  background-color: #a2e4b8;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-family: "Ownglyph_meetme-Rg", sans-serif;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 30px;
`;

const ChatRoomList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ChatRoomButton = styled.button`
  background-color: #ffffff;
  color: black;
  border: 2px solid #a2e4b8;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #6dbe92;
    color: white;
  }
`;

const ChatListPage = () => {
  const [chatrooms, setChatrooms] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChatrooms = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/chat/room/byuser/${user.userId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setChatrooms(data);
        } else {
          console.error("채팅방 목록을 가져오지 못했습니다.");
        }
      } catch (error) {
        console.error("채팅방 목록 오류:", error);
      }
    };

    if (user) fetchChatrooms();
  }, [user]);

  const goToChatRoom = (boardId) => {
    navigate(`/room/${boardId}`);
  };

  if (!user) return <UserCheck />;

  return (
    <Container>
      <Title>나의 채팅방 목록</Title>
      <ChatRoomList>
        {chatrooms.length > 0 ? (
          chatrooms.map((room) => (
            <ChatRoomButton
              key={room.chatroomId}
              onClick={() => goToChatRoom(room.boardId)}
            >
              {room.chatroomName}
            </ChatRoomButton>
          ))
        ) : (
          <p>참여 중인 채팅방이 없습니다.</p>
        )}
      </ChatRoomList>
    </Container>
  );
};

export default ChatListPage;
