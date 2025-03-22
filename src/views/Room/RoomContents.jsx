import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  height: 100vh;
  background: #007ACC;
`;

const Sidebar = styled.div`
  width: 300px;
  background: #00BFFF;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const ChatList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const ChatItem = styled.div`
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
  background: ${({ active }) => (active ? "#007ACC" : "transparent")};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background: #007ACC;
  }
`;

const Button = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  margin-left: 10px;
  padding: 5px 10px;
  font-size: 16px; /* 버튼 글자 크기 증가 */
  font-weight: bold;
  border: 1px solid white;
  border-radius: 5px;
  &:hover {
    color: #00BFFF;
    background: white;
  }
`;


const ChatWindow = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #005A99;
  padding: 20px;
`;

const ChatHeader = styled.div`
  font-size: 20px;
  font-weight: bold;
  padding-bottom: 10px;
  border-bottom: 2px solid #00BFFF;
  display: flex;
  justify-content: space-between;
  color: white;
`;

const EditInput = styled.input`
  padding: 5px;
  font-size: 16px;
  border: 1px solid #00BFFF;
`;

const Messages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
`;

const Message = styled.div`
  padding: 8px 12px;
  margin: 5px 0;
  border-radius: 10px;
  background: ${({ isMine }) => (isMine ? "#00BFFF" : "#007ACC")};
  align-self: ${({ isMine }) => (isMine ? "flex-end" : "flex-start")};
  color: white;
`;

const InputContainer = styled.div`
  display: flex;
  padding: 10px;
  background: #0066B2;
  border-top: 2px solid #00BFFF;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #00BFFF;
  outline: none;
`;

const SendButton = styled.button`
  padding: 10px;
  background: #00BFFF;
  color: white;
  border: none;
  cursor: pointer;

  &:hover {
    background: #007ACC;
  }
`;

const AddUserButton = styled(SendButton)`
  background: white;
  color: black;
  font-weight: bold;

  &:hover {
    background: #0066B2;
  }
`;

const AddUserContainer = styled.div`
  display: flex;
  gap: 10px;
  padding-top: 10px;
  border-top: 1px solid white;
`;

const AddUserWrapper = styled.div`
  margin-top: auto;
`;

const AddUserInput = styled.input`
  flex: 1;
  padding: 5px;
  border: 1px solid #00BFFF;
`;

const RoomContents = () => {
  const [users, setUsers] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState({});
  const [input, setInput] = useState("");
  const [newUser, setNewUser] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");

  const sendMessage = () => {
    if (input.trim() && activeChat) {
      const updatedMessages = messages[activeChat]
        ? [...messages[activeChat], { text: input, isMine: true }]
        : [{ text: input, isMine: true }];

      setMessages({
        ...messages,
        [activeChat]: updatedMessages,
      });
      setInput("");
    }
  };

  const addUser = () => {
    if (newUser.trim() && !users.includes(newUser)) {
      setUsers([...users, newUser]);
      setMessages({
        ...messages,
        [newUser]: [],
      });
      setNewUser("");
      if (!activeChat) setActiveChat(newUser);
    }
  };

  const deleteUser = (user) => {
    setUsers(users.filter((u) => u !== user));
    
    const { [user]: _, ...rest } = messages;
    setMessages(rest);

    if (activeChat === user) {
      setActiveChat(users.length > 1 ? users.find((u) => u !== user) : null);
    }
  };

  const editUserName = () => {
    if (editedName.trim()) {
      const updatedUsers = users.map((u) =>
        u === activeChat ? editedName : u
      );

      const updatedMessages = { ...messages };
      updatedMessages[editedName] = updatedMessages[activeChat];
      delete updatedMessages[activeChat];

      setUsers(updatedUsers);
      setMessages(updatedMessages);
      setActiveChat(editedName);
      setIsEditing(false);
    }
  };

  return (
    <Container>
      <Sidebar>
        <h2>DM 목록</h2>
        <ChatList>
          {users.map((user) => (
            <ChatItem
              key={user}
              active={activeChat === user}
              onClick={() => setActiveChat(user)}
            >
              {user}
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteUser(user);
                }}
              >
                ✖
              </Button>
            </ChatItem>
          ))}
        </ChatList>

        <AddUserWrapper>
          <AddUserContainer>
            <AddUserInput
              value={newUser}
              onChange={(e) => setNewUser(e.target.value)}
              placeholder="이름 추가"
              onKeyDown={(e) => e.key === "Enter" && addUser()}
            />
            <AddUserButton onClick={addUser}>+</AddUserButton>
          </AddUserContainer>
        </AddUserWrapper>
      </Sidebar>

      <ChatWindow>
        {activeChat ? (
          <>
<ChatHeader>
  {isEditing ? (
    <>
      <EditInput
        value={editedName}
        onChange={(e) => setEditedName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && editUserName()}
      />
      <SendButton onClick={editUserName}>✔</SendButton>
    </>
  ) : (
    <>
      <span style={{ display: "flex", alignItems: "center" }}>
        {activeChat}
        <Button
          onClick={() => {
            setIsEditing(true);
            setEditedName(activeChat);
          }}
          style={{ marginLeft: "10px" }}
        >
          수정
        </Button>
      </span>
    </>
  )}
</ChatHeader>

            <Messages>
              {(messages[activeChat] || []).map((msg, idx) => (
                <Message key={idx} isMine={msg.isMine}>
                  {msg.text}
                </Message>
              ))}
            </Messages>

            <InputContainer>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <SendButton onClick={sendMessage}>전송</SendButton>
            </InputContainer>
          </>
        ) : (
          <h2 style={{ color: "white" }}>대화 상대를 선택하세요.</h2>
        )}
      </ChatWindow>
    </Container>
  );
};

export default RoomContents;
