import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCapturedFile } from '../slices/cameraSlice';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../services/api'; // ✅ use API

export default function UploadForm({ onUploadComplete }) {
  const capturedFile = useSelector((state) => state.camera.capturedFile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [header, setHeader] = useState('');
  const [content, setContent] = useState('');
  const [uploading, setUploading] = useState(false);
  const [videoError, setVideoError] = useState('');
  const galleryInputRef = useRef(null);

  useEffect(() => {
    if (capturedFile) {
      setFile(capturedFile);
    }
  }, [capturedFile]);

  const handleUpload = async () => {
    if (!file) return alert('נא לבחור קובץ');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    setUploading(true);
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`,
        { method: 'POST', body: formData }
      );
      const data = await res.json();
      const type = file.type.startsWith('image/') ? 'image' : 'video';

      const post = {
        url: data.secure_url,
        header,
        content,
        type,
      };

      const savedPost = await createPost(post); // ✅ send to your MongoDB
      onUploadComplete(savedPost);
      dispatch(clearCapturedFile());
      navigate('/');
    } catch (err) {
      alert('אירעה שגיאה בעת ההעלאה');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (selected.type.startsWith('image/')) {
      setFile(selected);
      setVideoError('');
    } else if (selected.type.startsWith('video/')) {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        if (video.duration > 60) {
          setVideoError('הווידאו לא יכול להיות ארוך מ-60 שניות');
          setFile(null);
        } else {
          setVideoError('');
          setFile(selected);
        }
      };
      video.src = URL.createObjectURL(selected);
    }
  };

  return (
    <div className="upload-page">
      <button className="back-button" onClick={() => navigate(-1)}>חזרה</button>

      <div className="upload-form-wrapper">
        {file && (
          <div className="media-preview">
            {file.type.startsWith('image/') ? (
              <img src={URL.createObjectURL(file)} alt="preview" />
            ) : file.type.startsWith('video/') ? (
              <video
                key={file.name}
                controls
                src={URL.createObjectURL(file)}
                style={{ width: '100%', borderRadius: '12px', maxHeight: '300px' }}
              />
            ) : (
              <p>לא ניתן להציג את הקובץ</p>
            )}
          </div>
        )}

        <input
          type="text"
          placeholder="כותרת"
          value={header}
          onChange={(e) => setHeader(e.target.value)}
        />

        <textarea
          placeholder="תיאור (לא חובה)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <input
          type="file"
          accept="image/*,video/*"
          ref={galleryInputRef}
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />
        <button onClick={() => galleryInputRef.current?.click()}>
          בחר קובץ מהטלפון
        </button>

        {videoError && <div className="error-message">{videoError}</div>}

        <button onClick={handleUpload} disabled={!file || uploading}>
          {uploading ? 'מעלה...' : 'שלח'}
        </button>
      </div>
    </div>
  );
}
