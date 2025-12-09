import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, CameraOff, Settings, X, Plus, ChevronLeft, ChevronRight,
  Maximize2, Minimize2, Image, Video, Music, Link, FileText, Trash2
} from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';
import type { MediaType } from '../../types';
import './CameraStudio.css';

interface CameraStudioProps {
  onBack: () => void;
}

// Background themes for camera mode
const cameraBackgrounds = [
  { id: 'dark-leather', name: 'جلد داكن', gradient: 'linear-gradient(135deg, #3d2b1f 0%, #2c1810 100%)' },
  { id: 'midnight-blue', name: 'أزرق داكن', gradient: 'linear-gradient(135deg, #0a1628 0%, #1a2d4a 100%)' },
  { id: 'royal-purple', name: 'بنفسجي ملكي', gradient: 'linear-gradient(135deg, #1a0a30 0%, #2d1a4a 100%)' },
  { id: 'forest-dark', name: 'غابة داكنة', gradient: 'linear-gradient(135deg, #0a1a0a 0%, #1a3020 100%)' },
  { id: 'warm-brown', name: 'بني دافئ', gradient: 'linear-gradient(135deg, #2c1810 0%, #4a2c1a 100%)' },
  { id: 'ocean-depth', name: 'أعماق المحيط', gradient: 'linear-gradient(135deg, #0a1a2a 0%, #1a3a4a 100%)' },
  { id: 'charcoal', name: 'فحمي', gradient: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' },
  { id: 'wine-red', name: 'نبيذي', gradient: 'linear-gradient(135deg, #2a0a1a 0%, #4a1a2a 100%)' },
];

export function CameraStudio({ onBack }: CameraStudioProps) {
  const {
    sections,
    currentSectionIndex,
    addSection,
    deleteSection,
    nextSection,
    prevSection,
    setCurrentSection,
  } = useAppStore();

  // States
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [userName, setUserName] = useState('اسمك');
  const [selectedBg, setSelectedBg] = useState(cameraBackgrounds[0]);
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  
  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mediaType, setMediaType] = useState<MediaType>('none');
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaName, setMediaName] = useState<string | null>(null);
  const [linkUrl, setLinkUrl] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: 'user' },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraOn(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('لم نتمكن من الوصول إلى الكاميرا');
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOn(false);
  }, [stream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setMediaUrl(url);
    setMediaName(file.name);

    if (file.type.startsWith('image/')) {
      setMediaType('image');
    } else if (file.type.startsWith('video/')) {
      setMediaType('video');
    } else if (file.type.startsWith('audio/')) {
      setMediaType('audio');
    } else if (file.type === 'application/pdf') {
      setMediaType('pdf');
    }
  };

  // Add section
  const handleAddSection = () => {
    if (!title.trim() && !content.trim()) return;
    
    addSection({
      title: title.trim(),
      content: content.trim(),
      mediaType,
      mediaUrl,
      mediaName,
      linkUrl: mediaType === 'link' ? linkUrl : null,
    });
    
    // Reset form
    setTitle('');
    setContent('');
    setMediaType('none');
    setMediaUrl(null);
    setMediaName(null);
    setLinkUrl('');
  };

  const currentSection = sections[currentSectionIndex];
  const currentBg = selectedBg.gradient;

  return (
    <div className="camera-studio" style={{ background: currentBg }}>
      {/* Background Animation */}
      <div className="studio-bg-effects">
        {Array.from({ length: 15 }).map((_, i) => (
          <div 
            key={i} 
            className="bg-particle"
            style={{
              '--delay': `${Math.random() * 10}s`,
              '--left': `${Math.random() * 100}%`,
              '--size': `${4 + Math.random() * 6}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Main Layout */}
      <div className="studio-layout">
        {/* Left Side - Camera */}
        <div className="studio-camera-section">
          <div className="camera-label">
            <span>{userName}</span>
          </div>
          
          <div className="camera-container">
            {isCameraOn ? (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="camera-video"
              />
            ) : (
              <div className="camera-placeholder">
                <CameraOff size={48} />
                <p>الكاميرا متوقفة</p>
              </div>
            )}
          </div>

          <div className="camera-controls">
            {isCameraOn ? (
              <button className="cam-btn stop" onClick={stopCamera}>
                <CameraOff size={20} /> إيقاف الكاميرا
              </button>
            ) : (
              <button className="cam-btn start" onClick={startCamera}>
                <Camera size={20} /> تشغيل الكاميرا
              </button>
            )}
          </div>
        </div>

        {/* Center - Logo/Branding */}
        <div className="studio-center">
          <div className="studio-logo">
            <span className="logo-arabic">استوديو</span>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="studio-content-section">
          <div className="content-label">
            <span>مصدر خارجي</span>
          </div>
          
          <div className={`content-container ${isContentExpanded ? 'expanded' : ''}`}>
            {currentSection ? (
              <div className="content-display">
                {currentSection.title && (
                  <h3 className="content-title">{currentSection.title}</h3>
                )}
                
                {/* Media Display */}
                {currentSection.mediaType === 'image' && currentSection.mediaUrl && (
                  <img src={currentSection.mediaUrl} alt="" className="content-media" />
                )}
                {currentSection.mediaType === 'video' && currentSection.mediaUrl && (
                  <video src={currentSection.mediaUrl} controls className="content-media" />
                )}
                {currentSection.mediaType === 'pdf' && currentSection.mediaUrl && (
                  <iframe 
                    src={currentSection.mediaUrl} 
                    className="content-pdf"
                    title="PDF"
                  />
                )}
                
                {currentSection.content && (
                  <p className="content-text">{currentSection.content}</p>
                )}
              </div>
            ) : (
              <div className="content-placeholder">
                <FileText size={48} />
                <p>أضف محتوى للعرض</p>
              </div>
            )}

            {/* Expand/Collapse */}
            <button 
              className="expand-btn"
              onClick={() => setIsContentExpanded(!isContentExpanded)}
            >
              {isContentExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          </div>

          {/* Navigation */}
          {sections.length > 0 && (
            <div className="content-nav">
              <button onClick={prevSection} disabled={currentSectionIndex <= 0}>
                <ChevronRight size={20} />
              </button>
              <span>{currentSectionIndex + 1} / {sections.length}</span>
              <button onClick={nextSection} disabled={currentSectionIndex >= sections.length - 1}>
                <ChevronLeft size={20} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Settings Button */}
      <button 
        className="settings-toggle"
        onClick={() => setShowSettings(true)}
      >
        <Settings size={24} />
      </button>

      {/* Back Button */}
      <button className="back-btn" onClick={onBack}>
        الرجوع
      </button>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <>
            <motion.div 
              className="settings-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
            />
            <motion.div 
              className="settings-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <div className="settings-header">
                <h2>الإعدادات</h2>
                <button onClick={() => setShowSettings(false)}>
                  <X size={24} />
                </button>
              </div>

              <div className="settings-content">
                {/* Name Setting */}
                <div className="setting-group">
                  <label>الاسم المعروض</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="اسمك"
                    className="setting-input"
                  />
                </div>

                {/* Background Selection */}
                <div className="setting-group">
                  <label>خلفية المشهد</label>
                  <div className="bg-options">
                    {cameraBackgrounds.map((bg) => (
                      <button
                        key={bg.id}
                        className={`bg-option ${selectedBg.id === bg.id ? 'active' : ''}`}
                        style={{ background: bg.gradient }}
                        onClick={() => setSelectedBg(bg)}
                        title={bg.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Add Section */}
                <div className="setting-group">
                  <label>إضافة محتوى جديد</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="العنوان"
                    className="setting-input"
                  />
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="المحتوى"
                    className="setting-input"
                    rows={3}
                  />

                  {/* Media Type */}
                  <div className="media-btns">
                    <button 
                      className={mediaType === 'none' ? 'active' : ''} 
                      onClick={() => setMediaType('none')}
                    >
                      <FileText size={16} />
                    </button>
                    <button 
                      className={mediaType === 'image' ? 'active' : ''}
                      onClick={() => { setMediaType('image'); fileInputRef.current?.click(); }}
                    >
                      <Image size={16} />
                    </button>
                    <button 
                      className={mediaType === 'video' ? 'active' : ''}
                      onClick={() => { setMediaType('video'); fileInputRef.current?.click(); }}
                    >
                      <Video size={16} />
                    </button>
                    <button 
                      className={mediaType === 'audio' ? 'active' : ''}
                      onClick={() => { setMediaType('audio'); fileInputRef.current?.click(); }}
                    >
                      <Music size={16} />
                    </button>
                    <button 
                      className={mediaType === 'link' ? 'active' : ''}
                      onClick={() => setMediaType('link')}
                    >
                      <Link size={16} />
                    </button>
                    <button 
                      className={mediaType === 'pdf' ? 'active' : ''}
                      onClick={() => { setMediaType('pdf'); fileInputRef.current?.click(); }}
                    >
                      📄
                    </button>
                  </div>

                  {mediaType === 'link' && (
                    <input
                      type="url"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="رابط URL"
                      className="setting-input"
                    />
                  )}

                  {mediaName && (
                    <div className="media-preview">
                      <span>📎 {mediaName}</span>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*,audio/*,application/pdf"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />

                  <button className="add-section-btn" onClick={handleAddSection}>
                    <Plus size={18} /> إضافة القسم
                  </button>
                </div>

                {/* Sections List */}
                {sections.length > 0 && (
                  <div className="setting-group">
                    <label>الأقسام ({sections.length})</label>
                    <div className="sections-list">
                      {sections.map((section, idx) => (
                        <div 
                          key={section.id} 
                          className={`section-item ${currentSectionIndex === idx ? 'active' : ''}`}
                          onClick={() => setCurrentSection(idx)}
                        >
                          <span className="section-num">{idx + 1}</span>
                          <span className="section-title">{section.title || 'بدون عنوان'}</span>
                          <button 
                            className="delete-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSection(section.id);
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
