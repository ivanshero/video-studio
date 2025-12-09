import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  Settings, 
  Palette,
  Sparkles,
  Home,
  ChevronDown,
  Camera
} from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';
import { backgrounds, sceneEffects } from '../../utils/constants';
import { SceneEffects } from '../SceneEffects/SceneEffects';
import './MobileView.css';

interface MobileViewProps {
  onBack: () => void;
}

export const MobileView = ({ onBack }: MobileViewProps) => {
  const {
    sections,
    currentSectionIndex,
    setCurrentSection,
    nextSection,
    prevSection,
    background,
    setBackground,
    sceneEffect,
    setSceneEffect,
  } = useAppStore();

  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'background' | 'effects'>('background');
  const [isListening, setIsListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentSection = sections[currentSectionIndex];

  // Voice Detection
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

  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    setAudioLevel(Math.min(average / 128, 1));
    
    animationFrameRef.current = requestAnimationFrame(analyzeAudio);
  }, []);

  useEffect(() => {
    startListening();
    return () => stopListening();
  }, [startListening, stopListening]);

  // Swipe Navigation
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    
    if (info.offset.x > threshold) {
      // Swiped right - go to previous
      prevSection();
    } else if (info.offset.x < -threshold) {
      // Swiped left - go to next
      nextSection();
    }
  };

  // Avatar Image Upload
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate bubbles based on audio level
  const renderBubbles = () => {
    const bubbleCount = Math.floor(audioLevel * 8) + 2;
    const bubbles = [];
    
    for (let i = 0; i < bubbleCount; i++) {
      const size = 8 + Math.random() * 12;
      const delay = Math.random() * 0.5;
      const angle = (i / bubbleCount) * 360;
      const distance = 60 + audioLevel * 40;
      
      bubbles.push(
        <motion.div
          key={`bubble-${i}-${Date.now()}`}
          className="voice-bubble"
          initial={{ 
            scale: 0, 
            opacity: 0.8,
            x: 0,
            y: 0
          }}
          animate={{ 
            scale: [0, 1, 0.5],
            opacity: [0.8, 0.6, 0],
            x: Math.cos(angle * Math.PI / 180) * distance,
            y: Math.sin(angle * Math.PI / 180) * distance,
          }}
          transition={{ 
            duration: 1.5,
            delay,
            ease: "easeOut"
          }}
          style={{
            width: size,
            height: size,
          }}
        />
      );
    }
    
    return bubbles;
  };

  const getBackgroundStyle = () => {
    const bg = backgrounds.find(b => b.id === background);
    if (bg?.gradient) {
      return { background: bg.gradient };
    }
    return { backgroundColor: bg?.color || '#0a0a1a' };
  };

  return (
    <div 
      className="mobile-view" 
      style={getBackgroundStyle()}
      ref={containerRef}
    >
      {/* Scene Effects */}
      <SceneEffects effect={sceneEffect} />
      
      {/* Header */}
      <div className="mobile-header">
        <button className="mobile-back-btn" onClick={onBack}>
          <Home size={20} />
        </button>
        <div className="mobile-section-indicator">
          {currentSectionIndex + 1} / {sections.length || 1}
        </div>
        <button 
          className="mobile-settings-btn"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Main Content Area - Swipeable */}
      <motion.div 
        className="mobile-content-area"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
      >
        <AnimatePresence mode="wait">
          {currentSection ? (
            <motion.div
              key={currentSection.id}
              className="mobile-section"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              {/* Section Title */}
              <h2 className="mobile-section-title">{currentSection.title}</h2>
              
              {/* Section Media */}
              {currentSection.mediaType !== 'none' && currentSection.mediaUrl && (
                <div className="mobile-section-media">
                  {currentSection.mediaType === 'image' && (
                    <img src={currentSection.mediaUrl} alt={currentSection.title} />
                  )}
                  {currentSection.mediaType === 'video' && (
                    <video src={currentSection.mediaUrl} controls playsInline />
                  )}
                </div>
              )}
              
              {/* Section Content */}
              <div className="mobile-section-content">
                <p>{currentSection.content}</p>
              </div>
            </motion.div>
          ) : (
            <div className="mobile-empty">
              <p>لا توجد أقسام</p>
              <span>أضف أقسام من الإعدادات</span>
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Navigation Arrows */}
      {sections.length > 1 && (
        <>
          <button 
            className="mobile-nav-btn mobile-nav-prev"
            onClick={prevSection}
            disabled={currentSectionIndex <= 0}
          >
            <ArrowRight size={24} />
          </button>
          <button 
            className="mobile-nav-btn mobile-nav-next"
            onClick={nextSection}
            disabled={currentSectionIndex >= sections.length - 1}
          >
            <ArrowLeft size={24} />
          </button>
        </>
      )}

      {/* Voice Avatar Circle */}
      <div className="mobile-avatar-container">
        <div 
          className={`mobile-avatar-circle ${isListening ? 'listening' : ''}`}
          style={{
            transform: `scale(${1 + audioLevel * 0.15})`,
            boxShadow: `0 0 ${20 + audioLevel * 40}px rgba(212, 175, 55, ${0.3 + audioLevel * 0.4})`
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          {avatarImage ? (
            <img src={avatarImage} alt="Avatar" className="avatar-image" />
          ) : (
            <div className="avatar-placeholder">
              <Camera size={32} />
              <span>اختر صورة</span>
            </div>
          )}
          
          {/* Voice Bubbles */}
          {isListening && audioLevel > 0.1 && (
            <div className="bubbles-container">
              {renderBubbles()}
            </div>
          )}
        </div>
        
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleAvatarUpload}
          style={{ display: 'none' }}
        />
        
        {/* Mic Status */}
        <div className={`mic-status ${isListening ? 'active' : ''}`}>
          {isListening ? '🎤 يستمع...' : '🔇 غير نشط'}
        </div>
      </div>

      {/* Section Dots */}
      {sections.length > 1 && (
        <div className="mobile-dots">
          {sections.map((_, index) => (
            <button
              key={index}
              className={`mobile-dot ${index === currentSectionIndex ? 'active' : ''}`}
              onClick={() => setCurrentSection(index)}
            />
          ))}
        </div>
      )}

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="mobile-settings-panel"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <div className="settings-header">
              <button 
                className="settings-close"
                onClick={() => setShowSettings(false)}
              >
                <ChevronDown size={24} />
              </button>
              <h3>الإعدادات</h3>
            </div>

            {/* Settings Tabs */}
            <div className="settings-tabs">
              <button
                className={`settings-tab ${settingsTab === 'background' ? 'active' : ''}`}
                onClick={() => setSettingsTab('background')}
              >
                <Palette size={18} />
                <span>الخلفيات</span>
              </button>
              <button
                className={`settings-tab ${settingsTab === 'effects' ? 'active' : ''}`}
                onClick={() => setSettingsTab('effects')}
              >
                <Sparkles size={18} />
                <span>التأثيرات</span>
              </button>
            </div>

            {/* Settings Content */}
            <div className="settings-content">
              {settingsTab === 'background' && (
                <div className="settings-grid">
                  {backgrounds.map((bg) => (
                    <button
                      key={bg.id}
                      className={`bg-option ${background === bg.id ? 'active' : ''}`}
                      style={{ 
                        background: bg.gradient || bg.color,
                        color: bg.textColor 
                      }}
                      onClick={() => setBackground(bg.id)}
                    >
                      <span className="bg-name">{bg.name}</span>
                    </button>
                  ))}
                </div>
              )}

              {settingsTab === 'effects' && (
                <div className="settings-grid effects-grid">
                  {sceneEffects.map((effect) => (
                    <button
                      key={effect.id}
                      className={`effect-option ${sceneEffect === effect.id ? 'active' : ''}`}
                      onClick={() => setSceneEffect(effect.id)}
                    >
                      <span className="effect-icon">{effect.icon}</span>
                      <span className="effect-name">{effect.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
