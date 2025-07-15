import { useRef, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { FaCamera, FaSync, FaFolderOpen, FaVideo } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { setCapturedFile } from '../slices/cameraSlice';

export default function CameraScreen() {
  const webcamRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [facingMode, setFacingMode] = useState('environment');

  const videoConstraints = {
    facingMode,
  };

  useEffect(() => {
    const stream = webcamRef.current?.video?.srcObject;
    if (stream) {
      stream.getVideoTracks().forEach((track) => track.applyConstraints({ facingMode }));
    }
  }, [facingMode]);

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
        dispatch(setCapturedFile(file));
        navigate('/upload');
      });
  }, [dispatch, navigate]);

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  const handleGalleryPick = (e) => {
    const file = e.target.files[0];
    if (file) {
      dispatch(setCapturedFile(file));
      navigate('/upload');
    }
  };

  return (
    <div style={container}>
      <Webcam
        ref={webcamRef}
        audio={false}
        mirrored={facingMode === 'user'}
        playsInline
        muted
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        style={webcamStyle}
      />

      <button onClick={() => navigate('/')} className="back-button">חזרה</button>

      <button onClick={toggleFacingMode} style={flipBtn}>
        <FaSync />
      </button>

      <div style={controls}>
        {/* Gallery + video chooser */}
        <label style={controlBtn}>
          <FaFolderOpen />
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleGalleryPick}
            style={{ display: 'none' }}
          />
        </label>

        {/* Native video capture (uses device camera app) */}
        <label style={controlBtn}>
          <FaVideo />
          <input
            type="file"
            accept="video/*"
            capture="environment"
            onChange={handleGalleryPick}
            style={{ display: 'none' }}
          />
        </label>

        {/* Photo capture using webcam */}
        <button onClick={capturePhoto} style={captureBtn}>
          <FaCamera />
        </button>
      </div>
    </div>
  );
}

// Styles
const container = { position: 'fixed', inset: 0, backgroundColor: '#000', zIndex: 1000 };
const webcamStyle = { width: '100vw', height: '100dvh', objectFit: 'cover' };
const flipBtn = {
  position: 'fixed', top: '20px', right: '20px', background: '#fff',
  border: 'none', borderRadius: '50%', width: '48px', height: '48px',
  fontSize: '1.2rem', display: 'flex', justifyContent: 'center', alignItems: 'center',
  boxShadow: '0 4px 12px rgba(0,0,0,0.3)', cursor: 'pointer', zIndex: 1001
};
const controls = {
  position: 'fixed', bottom: 'env(safe-area-inset-bottom, 20px)',
  left: '50%', transform: 'translateX(-50%)', display: 'flex',
  gap: '16px', alignItems: 'center', zIndex: 1001
};
const controlBtn = {
  background: '#fff', border: 'none', borderRadius: '50%',
  width: '56px', height: '56px', fontSize: '1.4rem',
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
};
const captureBtn = { ...controlBtn, width: '72px', height: '72px', fontSize: '1.6rem', background: '#f8f8f8' };
