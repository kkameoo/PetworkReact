import { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "../../hooks/useAuth";
import defaultProfile from "/assets/userimage.jpg";
import { useNavigate } from "react-router-dom";
import UserCheck from "../../components/UserCheck";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const ContentWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 50px;
  padding: 20px;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  gap: 20px;

  img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
  }
  div {
    text-align: left;
  }
  h2 {
    margin: 10px 0 5px;
  }
  p {
    font-family: "Ownglyph_meetme-Rg", sans-serif;
    color: gray;
  }
`;

const ButtonSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ActionButton = styled.button`
  font-family: "Ownglyph_meetme-Rg", sans-serif;
  padding: 10px 15px;
  border: none;
  background: #a2e4b8;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #6dbe92;
  }
`;

const BoardNav = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
`;

const BoardButton = styled.button.attrs((props) => ({
  "data-active": props.isActive,
}))`
  font-family: "Ownglyph_meetme-Rg", sans-serif;
  padding: 10px 15px;
  border: none;
  background: ${(props) => (props.isActive ? "#a2e4b8" : "#a2e4b8")};
  color: ${(props) => (props.isActive ? "white" : "black")};
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #6dbe92;
    color: white;
  }
`;

const BoardContent = styled.div`
  margin-top: 20px;
  padding: 15px;
  background: #a2e4b8;
  border-radius: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
`;

const PostCard = styled.div`
  font-family: "Ownglyph_meetme-Rg", sans-serif;
  background: #ecebde;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }

  img {
    width: 100px;
    height: 100px;
    border-radius: 10px;
    object-fit: cover;
  }

  h4 {
    font-family: "Ownglyph_meetme-Rg", sans-serif;
    font-size: 1rem;
    margin-top: 0.5rem;
    color: #3b2e1a;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  min-width: 300px;
  text-align: center;

  img {
    width: 200px;
    height: 200px;
    object-fit: cover;
    border-radius: 12px;
    margin-bottom: 1rem;
  }

  input,
  textarea {
    font-family: "Ownglyph_meetme-Rg", sans-serif;
    width: 100%;
    margin-bottom: 0.5rem;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
`;

const ModalButton = styled.button`
  font-family: "Ownglyph_meetme-Rg", sans-serif;
  background-color: #a2e4b8;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  margin: 0.5rem;
  cursor: pointer;
`;

const CloseButton = styled(ModalButton)`
  font-family: "Ownglyph_meetme-Rg", sans-serif;
  background-color: gray;
`;

const UserDetailPage = () => {
  const { user, setUser } = useAuth();
  const [selectedBoard, setSelectedBoard] = useState("community");
  const [posts, setPosts] = useState([]);
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isUserEditModalOpen, setIsUserEditModalOpen] = useState(false);
  const [userEditForm, setUserEditForm] = useState(null);
  const [editForm, setEditForm] = useState({
    petId: "",
    petName: "",
    petType: "",
    petCategory: "",
    petIntroduce: "",
  });
  const [selectedPetId, setSelectedPetId] = useState(() => {
    return localStorage.getItem("selectedPetId") || null;
  });

  const CATEGORY_ID = [
    [1, "소형"],
    [2, "중형"],
    [3, "대형"],
  ];

  const getCategoryLabel = (id) => {
    const found = CATEGORY_ID.find(([key]) => key === Number(id));
    return found ? found[1] : "알 수 없음";
  };

  const [newPhotoFile, setNewPhotoFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const API_POST_URL = `${import.meta.env.VITE_API_URL}/api/board/user/${
      user.userId
    }`;
    fetch(API_POST_URL)
      .then((res) => res.json())
      .then((data) => {
        const formattedData = Object.values(data).map((item) => ({
          id: item.boardId,
          title: item.title,
          content: item.content,
          type: item.boardType,
        }));
        setPosts(formattedData);
      })
      .catch((err) => console.error("게시글 불러오기 오류:", err));
  }, [user]);

  const filteredPosts =
    selectedBoard === "mypet"
      ? pets
      : posts.filter((post) => {
          if (selectedBoard === "community") return post.type === 1;
          if (selectedBoard === "adoption") return post.type === 2;
          if (selectedBoard === "lost") return post.type === 3;
          if (selectedBoard === "pet") return post.type === 4;
          return [];
        });

  const handleUserInfoUpdate = async () => {
    if (!user || !user.userId) {
      alert("로그인 정보가 없습니다.");
      return;
    }

    try {
      const data = {
        userId: user.userId,
        name: userEditForm.name,
        nickname: userEditForm.nickname,
        telNumber: userEditForm.telNumber,
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) throw new Error("회원 정보 수정 실패");

      alert("회원 정보가 수정되었습니다.");
      const updatedUser = {
        ...user,
        name: data.name || user.name,
        nickname: data.nickname || user.nickname,
        telNumber: data.telNumber || user.telNumber,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsUserEditModalOpen(false);
      location.reload();
    } catch (err) {
      console.error(err);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  const fetchPets = async () => {
    if (!user) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/pet/list/${user.userId}`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      setPets(data);
    } catch (error) {
      console.error("펫 정보 불러오기 실패:", error);
    }
  };

  const getSelectedPetImage = () => {
    if (!selectedPetId) return defaultProfile;
    return `${
      import.meta.env.VITE_API_URL
    }/api/photo/pet/upload/${selectedPetId}`;
  };

  const applySelectedProfileImage = () => {
    if (selectedPetId) {
      localStorage.setItem("selectedPetId", selectedPetId);
    } else {
      localStorage.removeItem("selectedPetId");
    }
    setIsProfileModalOpen(false);
  };
  useEffect(() => {
    fetchPets();
    setUserEditForm({
      name: user?.name || "",
      nickname: user?.nickname || "",
      telNumber: user?.telNumber || "",
    });
  }, [user]);

  const openEditModal = (pet) => {
    setEditForm({
      petId: pet.petId,
      petName: pet.petName,
      petType: pet.petType,
      petCategory: pet.petCategory,
      petIntroduce: pet.petIntroduce,
    });
    setNewPhotoFile(null);
    setIsEditModalOpen(true);
  };

  const handlePetUpdate = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/pet/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(editForm),
        }
      );

      if (!response.ok) throw new Error("정보 수정 실패");

      if (newPhotoFile) {
        const formData = new FormData();
        formData.append("file", newPhotoFile);
        formData.append("petId", editForm.petId);

        const photoRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/pet/photo/update`,
          {
            method: "PUT",
            credentials: "include",
            body: formData,
          }
        );

        if (!photoRes.ok) throw new Error("사진 수정 실패");
      }

      alert("수정 완료!");
      setIsEditModalOpen(false);
      setIsModalOpen(false);
      fetchPets();
    } catch (error) {
      console.error("펫 수정 실패:", error);
      alert("수정에 실패했습니다.");
    }
  };

  const getBoardPath = (type, id) => {
    switch (type) {
      case 1:
        return `/${id}`;
      case 2:
        return `/trade/${id}`;
      case 3:
        return `/hire/${id}`;
      case 4:
        return `/petstarDetail/${id}`;
      default:
        return `/board/${id}`;
    }
  };

  if (!user) return <UserCheck />;

  return (
    <Container>
      {user ? (
        <ContentWrapper>
          <ProfileSection>
            <img src={getSelectedPetImage()} alt="프로필" />
            <h2>{user.nickname || "익명"}</h2>
            <p>{user.email}</p>
            <ButtonSection>
              <ActionButton onClick={() => navigate("/chatlist")}>
                채팅방 목록
              </ActionButton>
              <ActionButton onClick={() => navigate("/postUserPet")}>
                나의 펫 등록
              </ActionButton>
              <ActionButton onClick={() => setIsProfileModalOpen(true)}>
                프로필 이미지 선택
              </ActionButton>
              <ActionButton onClick={() => setIsUserEditModalOpen(true)}>
                회원 정보 수정
              </ActionButton>
            </ButtonSection>
          </ProfileSection>
        </ContentWrapper>
      ) : (
        <p>로그인이 필요합니다.</p>
      )}
      {isProfileModalOpen && (
        <ModalOverlay onClick={() => setIsProfileModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3>프로필로 사용할 펫 선택</h3>
            <select
              value={selectedPetId || ""}
              onChange={(e) => setSelectedPetId(e.target.value)}
            >
              <option value="">기본 이미지</option>
              {pets.map((pet) => (
                <option key={pet.petId} value={pet.petId}>
                  {pet.petName}
                </option>
              ))}
            </select>
            <div>
              <ModalButton onClick={applySelectedProfileImage}>
                바꾸기
              </ModalButton>
              <ModalButton onClick={() => setIsProfileModalOpen(false)}>
                닫기
              </ModalButton>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
      {isUserEditModalOpen && (
        <ModalOverlay onClick={() => setIsUserEditModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3>회원 정보 수정</h3>
            <input
              type="text"
              placeholder="이름"
              value={userEditForm.name}
              onChange={(e) =>
                setUserEditForm({ ...userEditForm, name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="닉네임"
              value={userEditForm.nickname}
              onChange={(e) =>
                setUserEditForm({ ...userEditForm, nickname: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="전화번호"
              value={userEditForm.telNumber}
              onChange={(e) =>
                setUserEditForm({ ...userEditForm, telNumber: e.target.value })
              }
            />
            <ModalButton onClick={handleUserInfoUpdate}>수정 완료</ModalButton>
            <CloseButton onClick={() => setIsUserEditModalOpen(false)}>
              닫기
            </CloseButton>
          </ModalContent>
        </ModalOverlay>
      )}

      <BoardNav>
        {["community", "adoption", "lost", "pet", "mypet"].map((key) => (
          <BoardButton
            key={key}
            isActive={selectedBoard === key}
            onClick={() => setSelectedBoard(key)}
          >
            {key === "community"
              ? "산책 게시판"
              : key === "adoption"
              ? "나눔 게시판"
              : key === "lost"
              ? "알바 게시판"
              : key === "pet"
              ? "펫스타그램"
              : "나의 펫"}
          </BoardButton>
        ))}
      </BoardNav>

      <BoardContent>
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) =>
            selectedBoard === "mypet" ? (
              <PostCard
                key={post.petId}
                onClick={() => {
                  setSelectedPet(post);
                  setIsModalOpen(true);
                }}
              >
                <h3>
                  <img
                    src={`${
                      import.meta.env.VITE_API_URL
                    }/api/photo/pet/upload/${post.petId}`}
                    alt="펫 이미지"
                  />
                </h3>
                <h4>{post.petName}</h4>
              </PostCard>
            ) : (
              <PostCard
                key={post.id}
                onClick={() => navigate(getBoardPath(post.type, post.id))}
              >
                <h4>{post.title}</h4>
                <p>{post.content}</p>
              </PostCard>
            )
          )
        ) : (
          <p>게시글이 없습니다.</p>
        )}
      </BoardContent>

      {isModalOpen && selectedPet && (
        <ModalOverlay onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <img
              src={`${import.meta.env.VITE_API_URL}/api/photo/pet/upload/${
                selectedPet.petId
              }`}
              alt="펫 이미지"
            />
            <h3>{selectedPet.petName}</h3>
            <p>
              {selectedPet.petType} -{" "}
              {getCategoryLabel(selectedPet.petCategory)}
            </p>
            <p>{selectedPet.petIntroduce}</p>
            <ModalButton onClick={() => openEditModal(selectedPet)}>
              수정
            </ModalButton>
            <ModalButton
              onClick={async () => {
                await fetch(
                  `${import.meta.env.VITE_API_URL}/api/pet/delete/${
                    selectedPet.petId
                  }`,
                  {
                    method: "DELETE",
                    credentials: "include",
                  }
                );
                setPets((prev) =>
                  prev.filter((p) => p.petId !== selectedPet.petId)
                );
                setIsModalOpen(false);
              }}
            >
              삭제
            </ModalButton>
            <CloseButton onClick={() => setIsModalOpen(false)}>
              닫기
            </CloseButton>
          </ModalContent>
        </ModalOverlay>
      )}

      {isEditModalOpen && (
        <ModalOverlay onClick={() => setIsEditModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3>펫 정보 수정</h3>
            <input
              type="text"
              placeholder="이름"
              value={editForm.petName}
              onChange={(e) =>
                setEditForm({ ...editForm, petName: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="타입"
              value={editForm.petType}
              onChange={(e) =>
                setEditForm({ ...editForm, petType: e.target.value })
              }
            />
            <select
              value={editForm.petCategory}
              onChange={(e) => setEditForm(e.target.value)}
            >
              {CATEGORY_ID.map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
            <textarea
              placeholder="소개"
              value={editForm.petIntroduce}
              onChange={(e) =>
                setEditForm({ ...editForm, petIntroduce: e.target.value })
              }
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewPhotoFile(e.target.files[0])}
            />
            <ModalButton onClick={handlePetUpdate}>수정 완료</ModalButton>
            <CloseButton onClick={() => setIsEditModalOpen(false)}>
              닫기
            </CloseButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default UserDetailPage;
