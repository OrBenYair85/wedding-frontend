import { useParams, useNavigate } from 'react-router-dom';
import { getAllPosts } from '../services/postService';
import '../App.css';

export default function PostDetail({ posts }) {
  const { id } = useParams();
  const navigate = useNavigate();

  // Try from props, fallback to localStorage
  const allPosts = posts.length > 0 ? posts : getAllPosts();
  const post = allPosts.find((p) => p._id === id);

  if (!post) {
    return <div style={{ padding: '1rem' }}>לא נמצא פוסט</div>;
  }

  return (
    <div className="detail-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← חזרה
      </button>

      <div className="detail-media">
        {post.type === 'image' ? (
          <img src={post.url} alt={post.header} />
        ) : (
          <video src={post.url} controls />
        )}
      </div>

      <h2>{post.header}</h2>
      {post.content && <p>{post.content}</p>}
    </div>
  );
}
