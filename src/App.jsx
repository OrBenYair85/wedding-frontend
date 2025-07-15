import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import UploadForm from './comp/UploadForm';
import PostDetail from './comp/PostDetail';
import CameraScreen from './comp/CameraScreen';
import { getPosts } from './services/api';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts().then((data) => setPosts(data));
  }, []);

  const handleUploadComplete = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleDeletePost = (id) => {
    setPosts((prev) => prev.filter((post) => post._id !== id));
  };

  return (
    <Router>
      <div dir="rtl">
        <Routes>
          <Route path="/" element={<MainPage posts={posts} />} />
          <Route path="/camera" element={<CameraScreen />} />
          <Route
            path="/upload"
            element={<UploadForm onUploadComplete={handleUploadComplete} />}
          />
          <Route
            path="/post/:id"
            element={
              <PostDetail posts={posts} onDeletePost={handleDeletePost} />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
