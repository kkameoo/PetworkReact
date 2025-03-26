import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { MessageCircle, Trash2 } from "lucide-react";

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 12px;
`;

const PostImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: contain;
`;

const Title = styled.h3`
  font-size: 1.5em;
  font-weight: bold;
  margin: 10px 0;
`;

const CardActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
`;

const Caption = styled.div`
  width: 100%;
  padding: 16px;
  background-color: #f7f7f7;
  border-radius: 8px;
  font-size: 1.1em;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  white-space: pre-line;
  box-sizing: border-box;
`;

const Comments = styled.p`
  color: gray;
  cursor: pointer;
`;

const CommentInput = styled.input`
  width: 100%;
  padding: 8px;
  border: none;
  border-top: 1px solid #ddd;
  outline: none;
`;

const NewPostForm = styled.div`
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  box-sizing: border-box;
`;

const NewPostInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
`;

const NewPostTextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  resize: vertical;
  min-height: 100px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

function PetstarDetailPage() {
  const [comment, setComment] = useState("");
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: "",
    caption: "",
    postImage: "",
  });
  const [showComments, setShowComments] = useState(null);

  useEffect(() => {
    const savedPosts = localStorage.getItem("posts");
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
  }, []);

  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem("posts", JSON.stringify(posts));
    }
  }, [posts]);

  const handleNewPostChange = (e) => {
    const { name, value } = e.target;
    setNewPost((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddPost = () => {
    if (newPost.title && newPost.caption && newPost.postImage) {
      const newPostData = {
        id: posts.length + 1,
        username: "newuser",
        userImage: "https://via.placeholder.com/40",
        postImage: newPost.postImage,
        title: newPost.title,
        caption: newPost.caption,
        likes: 0,
        comments: 0,
        commentsList: [],
        liked: false,
      };
      setPosts([newPostData, ...posts]);
      setNewPost({ title: "", caption: "", postImage: "" });
    }
  };

  const handleAddComment = (id) => {
    if (comment.trim()) {
      setPosts(posts.map((post) =>
        post.id === id
          ? { ...post, commentsList: [...post.commentsList, comment], comments: post.comments + 1 }
          : post
      ));
      setComment("");
    }
  };

  const handleDeletePost = (id) => {
    const updatedPosts = posts.filter((post) => post.id !== id);
    setPosts(updatedPosts);
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
  };

  const toggleComments = (id) => {
    setShowComments(showComments === id ? null : id);
  };

  return (
    <Container>
      <NewPostForm>
        <h3>새 게시물 작성</h3>
        <NewPostInput
          type="text"
          name="title"
          value={newPost.title}
          placeholder="제목을 입력하세요"
          onChange={handleNewPostChange}
        />
        <NewPostTextArea
          name="caption"
          value={newPost.caption}
          placeholder="내용을 입력하세요"
          onChange={handleNewPostChange}
        />
        <NewPostInput
          type="text"
          name="postImage"
          value={newPost.postImage}
          placeholder="이미지 URL을 입력하세요"
          onChange={handleNewPostChange}
        />
        <Button onClick={handleAddPost}>게시물 추가</Button>
      </NewPostForm>

      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader>
            <Title>{post.title}</Title>
          </CardHeader>
          <PostImage src={post.postImage} alt="Post" />
          <Caption>{post.caption}</Caption>
          <CardActions>
            <MessageCircle cursor="pointer" onClick={() => toggleComments(post.id)} />
            <Trash2 cursor="pointer" onClick={() => handleDeletePost(post.id)} />
          </CardActions>
          {showComments === post.id && (
            <>
              <Comments>모든 {post.comments}개의 댓글 보기</Comments>
              <div>
                {post.commentsList.map((comment, index) => (
                  <p key={index}>{comment}</p>
                ))}
              </div>
              <CommentInput
                type="text"
                placeholder="댓글을 추가하세요..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <Button onClick={() => handleAddComment(post.id)}>댓글 추가</Button>
            </>
          )}
        </Card>
      ))}
    </Container>
  );
}

export default PetstarDetailPage;
