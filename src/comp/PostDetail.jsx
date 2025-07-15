import { useParams, useNavigate } from 'react-router-dom';
import { deletePost } from '../services/api';
import '../App.css';

export default function PostDetail({ posts, onDeletePost }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const post = posts.find((p) => p._id === id);

  if (!post) {
    return <div style={{ padding: '1rem' }}>לא נמצא פוסט</div>;
  }

  const handleDelete = async () => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את הפוסט?')) {
      try {
        await deletePost(id);
        onDeletePost(id); // ✅ Remove from state in App.jsx
        navigate('/');
      } catch (err) {
        alert('שגיאה במחיקה');
        console.error(err);
      }
    }
  };

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

      <button
        onClick={handleDelete}
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: '#e53935',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        מחק פוסט
      </button>
    </div>
  );
}
