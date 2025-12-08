import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Camera, X, Move } from 'lucide-react';
import './AvatarDisplay.css';

interface AvatarDisplayProps {
  isVisible: boolean;
  onClose: () => void;
}

export function AvatarDisplay({ isVisible, onClose }: AvatarDisplayProps) {
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [size, setSize] = useState(150);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Start listening to microphone
  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      setIsListening(true);
      analyzeAudio();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  }, []);

  // Stop listening
  const stopListening = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsListening(false);
    setAudioLevel(0);
  }, []);

  // Analyze audio levels
  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    // Calculate average volume
    const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    const normalizedLevel = Math.min(average / 128, 1); // Normalize to 0-1
    
    setAudioLevel(normalizedLevel);
    animationFrameRef.current = requestAnimationFrame(analyzeAudio);
  }, []);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarImage(url);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  if (!isVisible) return null;

  // Calculate ring animation based on audio level
  const ringScale = 1 + audioLevel * 0.3;
  const ringOpacity = 0.3 + audioLevel * 0.7;
  const glowIntensity = audioLevel * 30;

  return (
    <motion.div
      className="avatar-container"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      style={{
        left: `${position.x}px`,
        bottom: `${position.y}px`,
        width: size,
        height: size,
      }}
    >
      {/* Animated rings */}
      <div className="avatar-rings">
        {[1, 2, 3].map((ring) => (
          <motion.div
            key={ring}
            className="avatar-ring"
            animate={{
              scale: isListening ? ringScale + (ring * 0.1 * audioLevel) : 1,
              opacity: isListening ? ringOpacity - (ring * 0.15) : 0.2,
            }}
            transition={{ duration: 0.1 }}
            style={{
              boxShadow: isListening 
                ? `0 0 ${glowIntensity + ring * 5}px var(--primary-color)` 
                : 'none',
            }}
          />
        ))}
      </div>

      {/* Avatar image or placeholder */}
      <div 
        className="avatar-image-wrapper"
        onClick={() => !avatarImage && fileInputRef.current?.click()}
      >
        {avatarImage ? (
          <img src={avatarImage} alt="Avatar" className="avatar-image" />
        ) : (
          <div className="avatar-placeholder">
            <Camera size={32} />
            <span>إضافة صورة</span>
          </div>
        )}
        
        {/* Speaking indicator */}
        {isListening && audioLevel > 0.1 && (
          <motion.div 
            className="speaking-indicator"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.3, repeat: Infinity }}
          />
        )}
      </div>

      {/* Controls */}
      <div className="avatar-controls">
        <button 
          className={`avatar-btn ${isListening ? 'active' : ''}`}
          onClick={isListening ? stopListening : startListening}
          title={isListening ? 'إيقاف الميكروفون' : 'تشغيل الميكروفون'}
        >
          {isListening ? <Mic size={16} /> : <MicOff size={16} />}
        </button>
        
        {avatarImage && (
          <button 
            className="avatar-btn"
            onClick={() => fileInputRef.current?.click()}
            title="تغيير الصورة"
          >
            <Camera size={16} />
          </button>
        )}
        
        <button 
          className="avatar-btn close"
          onClick={onClose}
          title="إغلاق"
        >
          <X size={16} />
        </button>
      </div>

      {/* Size controls */}
      <div className="size-controls">
        <button onClick={() => setSize(s => Math.max(80, s - 20))}>−</button>
        <button onClick={() => setSize(s => Math.min(300, s + 20))}>+</button>
      </div>

      {/* Drag handle */}
      <motion.div 
        className="drag-handle"
        drag
        dragMomentum={false}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        onDrag={(_, info) => {
          setPosition(prev => ({
            x: Math.max(0, prev.x + info.delta.x),
            y: Math.max(0, prev.y - info.delta.y),
          }));
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="اسحب لتحريك الموقع"
      >
        <Move size={18} />
      </motion.div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: 'none' }}
      />
    </motion.div>
  );
}
