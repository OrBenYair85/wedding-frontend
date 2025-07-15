import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

export default function MainPage({ posts }) {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1 className="title">Noy & Or Wedding<br /> 17/07/25</h1>
      

      <div className="gallery">
        {posts.map((post) => (
          <Link to={`/post/${post._id}`} key={post._id} className="post">
            {post.type === 'image' ? (
              <img src={post.url} alt={post.header} />
            ) : (
              <video src={post.url} />
            )}
            <p>{post.header}</p>
          </Link>
        ))}
      </div>

      <button className="upload-btn" onClick={() => navigate('/camera')}>
        +
      </button>
    </div>
  );
}
