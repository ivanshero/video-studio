import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Layers, 
  Home, 
  Palette,
  Frame,
  Sparkles,
  Image as ImageIcon,
  X,
  Plus,
  Trash2,
  Upload,
  Video,
  Music,
  FileText,
  Link,
  Type,
  User,
  Move,
  Mic
} from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';
import { themeColors, frames, backgrounds, sceneEffects } from '../../utils/constants';
import type { MediaType } from '../../types';
import { SceneEffects } from '../SceneEffects/SceneEffects';
import { IslamicFrame } from '../IslamicFrame/IslamicFrame';
import { SectionDisplay } from '../SectionDisplay/SectionDisplay';
import type { ThemeType } from '../../types';
import './PresentationMode.css';

// Convert themeColors to array for mapping
const themes = Object.entries(themeColors).map(([id, colors]) => ({
  id: id as ThemeType,
  name: id === 'gold' ? 'ذهبي' : 
        id === 'emerald' ? 'زمردي' : 
        id === 'royal' ? 'ملكي' : 
        id === 'sunset' ? 'غروب' : 
        id === 'purple' ? 'بنفسجي' : 'أزرق',
  colors,
}));

interface PresentationModeProps {
  onBack: () => void;
}

export const PresentationMode = ({ onBack }: PresentationModeProps) => {
  const {
    sections,
    currentSectionIndex,
    setCurrentSection,
    nextSection,
    prevSection,
    addSection,
    deleteSection,
    theme,
    setTheme,
    frame,
    setFrame,
    background,
    setBackground,
    sceneEffect,
    setSceneEffect,
    customBackgroundImage,
    setCustomBackgroundImage,
  } = useAppStore();

  const [showSettings, setShowSettings] = useState(false);
  const [showSections, setShowSections] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'theme' | 'frame' | 'background' | 'effects'>('theme');
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionContent, setNewSectionContent] = useState('');
  const [newMediaType, setNewMediaType] = useState<MediaType>('none');
  const [newMediaUrl, setNewMediaUrl] = useState<string | null>(null);
  const [newMediaName, setNewMediaName] = useState<string | null>(null);
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [showHeader, setShowHeader] = useState(true);
  
  // Speaker Avatar State
  const [showSpeaker, setShowSpeaker] = useState(false);
  const [speakerImage, setSpeakerImage] = useState<string | null>(null);
  const [speakerName, setSpeakerName] = useState('');
  const [speakerSize, setSpeakerSize] = useState(120);
  const [speakerPosition, setSpeakerPosition] = useState({ x: 50, y: 80 });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showSpeakerSettings, setShowSpeakerSettings] = useState(false);
  
  const hideTimeoutRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const currentSection = sections[currentSectionIndex];

  // Function to reset hide timeout
  const resetHideTimeout = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    setShowHeader(true);
    hideTimeoutRef.current = window.setTimeout(() => {
      // Only hide if no sidebar is open
      if (!showSettings && !showSections && !showSpeakerSettings) {
        setShowHeader(false);
      }
    }, 3000);
  }, [showSettings, showSections, showSpeakerSettings]);

  // Show header when sidebars are open
  useEffect(() => {
    if (showSettings || showSections || showSpeakerSettings) {
      setShowHeader(true);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    } else {
      resetHideTimeout();
    }
  }, [showSettings, showSections, showSpeakerSettings, resetHideTimeout]);

  // Initial hide timeout
  useEffect(() => {
    resetHideTimeout();
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [resetHideTimeout]);

  // Voice detection for speaker
  useEffect(() => {
    if (!showSpeaker) {
      setIsSpeaking(false);
      return;
    }

    let stream: MediaStream | null = null;

    const startVoiceDetection = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContextRef.current = new AudioContext();
        analyserRef.current = audioContextRef.current.createAnalyser();
        const source = audioContextRef.current.createMediaStreamSource(stream);
        source.connect(analyserRef.current);
        analyserRef.current.fftSize = 256;

        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const detectVoice = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / bufferLength;
          setIsSpeaking(average > 30);
          animationFrameRef.current = requestAnimationFrame(detectVoice);
        };

        detectVoice();
      } catch (err) {
        console.log('Microphone access denied');
      }
    };

    startVoiceDetection();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [showSpeaker]);

  // Handle speaker drag
  const handleSpeakerDrag = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSpeakerPosition({ 
      x: Math.max(5, Math.min(95, x)), 
      y: Math.max(5, Math.min(95, y)) 
    });
  };

  // Handle speaker image upload
  const handleSpeakerImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSpeakerImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      switch (e.key) {
        case 'ArrowRight':
          prevSection();
          break;
        case 'ArrowLeft':
          nextSection();
          break;
        case 'Escape':
          setShowSettings(false);
          setShowSections(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSection, prevSection]);

  // Get background style
  const getBackgroundStyle = () => {
    if (customBackgroundImage) {
      return {
        backgroundImage: `url(${customBackgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    const bg = backgrounds.find(b => b.id === background);
    if (bg?.gradient) {
      return { background: bg.gradient };
    }
    return { backgroundColor: bg?.color || '#0a0a1a' };
  };

  // Handle background image upload
  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomBackgroundImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle media file upload for sections
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewMediaUrl(event.target?.result as string);
        setNewMediaName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset new section form
  const resetNewSectionForm = () => {
    setNewSectionTitle('');
    setNewSectionContent('');
    setNewMediaType('none');
    setNewMediaUrl(null);
    setNewMediaName(null);
    setNewLinkUrl('');
  };

  // Add new section
  const handleAddSection = () => {
    if (newSectionTitle.trim()) {
      addSection({
        title: newSectionTitle,
        content: newSectionContent,
        mediaType: newMediaType,
        mediaUrl: newMediaUrl,
        mediaName: newMediaName,
        linkUrl: newLinkUrl || null,
      });
      resetNewSectionForm();
    }
  };

  return (
    <div 
      className="presentation-mode" 
      data-theme={theme}
      style={getBackgroundStyle()}
      onMouseMove={(e) => {
        resetHideTimeout();
        handleSpeakerDrag(e);
      }}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
    >
      {/* Scene Effects */}
      <SceneEffects effect={sceneEffect} />

      {/* Floating Buttons - Auto Hide */}
      <AnimatePresence>
        {showHeader && (
          <>
            {/* Top Left - Back Button */}
            <motion.button 
              className="pm-floating-btn pm-back-btn"
              style={{ top: 20, left: 20 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={onBack}
              title="الرئيسية"
            >
              <Home size={20} />
            </motion.button>

            {/* Top Right - Action Buttons */}
            <motion.div 
              className="pm-floating-group"
              style={{ top: 20, right: 20 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <button 
                className={`pm-floating-btn ${showSpeakerSettings ? 'active' : ''}`}
                onClick={() => {
                  setShowSpeakerSettings(!showSpeakerSettings);
                  setShowSettings(false);
                  setShowSections(false);
                }}
                title="المتحدث"
              >
                <User size={20} />
              </button>
              <button 
                className={`pm-floating-btn ${showSections ? 'active' : ''}`}
                onClick={() => {
                  setShowSections(!showSections);
                  setShowSettings(false);
                  setShowSpeakerSettings(false);
                }}
                title="الأقسام"
              >
                <Layers size={20} />
              </button>
              <button 
                className={`pm-floating-btn ${showSettings ? 'active' : ''}`}
                onClick={() => {
                  setShowSettings(!showSettings);
                  setShowSections(false);
                  setShowSpeakerSettings(false);
                }}
                title="الإعدادات"
              >
                <Settings size={20} />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Speaker Avatar with Voice Ripples */}
      {showSpeaker && (
        <motion.div 
          className={`pm-speaker ${isSpeaking ? 'speaking' : ''} ${isDragging ? 'dragging' : ''}`}
          style={{
            left: `${speakerPosition.x}%`,
            top: `${speakerPosition.y}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          onMouseDown={() => setIsDragging(true)}
        >
          {/* Speaker Avatar with Ripples */}
          <div 
            className="pm-speaker-avatar"
            style={{ width: speakerSize, height: speakerSize }}
          >
            {/* Voice Ripples - inside avatar for proper centering */}
            {isSpeaking && (
              <div className="pm-speaker-ripples" style={{ width: speakerSize, height: speakerSize }}>
                <div className="pm-voice-ripple ripple-1" style={{ width: speakerSize * 1.2, height: speakerSize * 1.2 }} />
                <div className="pm-voice-ripple ripple-2" style={{ width: speakerSize * 1.4, height: speakerSize * 1.4 }} />
                <div className="pm-voice-ripple ripple-3" style={{ width: speakerSize * 1.6, height: speakerSize * 1.6 }} />
              </div>
            )}
            {speakerImage ? (
              <img src={speakerImage} alt="Speaker" />
            ) : (
              <User size={speakerSize * 0.4} style={{ position: 'relative', zIndex: 5 }} />
            )}
          </div>
          
          {speakerName && (
            <div className="pm-speaker-name">{speakerName}</div>
          )}
          
          <div className="pm-speaker-drag-handle">
            <Move size={12} />
          </div>
        </motion.div>
      )}

      {/* Main Content Area */}
      <div className={`pm-content ${showSettings || showSections || showSpeakerSettings ? 'with-sidebar' : ''}`}>
        <div className="pm-frame-container">
          <IslamicFrame />
          <AnimatePresence mode="wait">
            {currentSection ? (
              <motion.div
                key={currentSection.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="pm-section-content"
              >
                <SectionDisplay section={currentSection} />
              </motion.div>
            ) : (
              <motion.div 
                className="pm-empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Layers size={48} />
                <h3>لا توجد أقسام</h3>
                <p>افتح قائمة الأقسام لإضافة محتوى</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Speaker Settings Sidebar */}
      <AnimatePresence>
        {showSpeakerSettings && (
          <motion.div
            className="pm-sidebar pm-speaker-sidebar"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <div className="pm-sidebar-header">
              <h3>إعدادات المتحدث</h3>
              <button onClick={() => setShowSpeakerSettings(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="pm-speaker-settings">
              {/* Toggle Speaker */}
              <div className="pm-setting-row">
                <span>إظهار المتحدث</span>
                <button 
                  className={`pm-toggle ${showSpeaker ? 'active' : ''}`}
                  onClick={() => setShowSpeaker(!showSpeaker)}
                >
                  {showSpeaker ? 'مفعّل' : 'معطّل'}
                </button>
              </div>

              {/* Speaker Image */}
              <div className="pm-setting-group">
                <label>صورة المتحدث</label>
                <div className="pm-speaker-image-upload">
                  <div className="pm-speaker-preview">
                    {speakerImage ? (
                      <img src={speakerImage} alt="Preview" />
                    ) : (
                      <User size={40} />
                    )}
                  </div>
                  <label className="pm-upload-btn">
                    <Upload size={16} />
                    <span>اختر صورة</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSpeakerImageUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                  {speakerImage && (
                    <button 
                      className="pm-clear-btn"
                      onClick={() => setSpeakerImage(null)}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Speaker Name */}
              <div className="pm-setting-group">
                <label>اسم المتحدث</label>
                <input
                  type="text"
                  placeholder="أدخل الاسم..."
                  value={speakerName}
                  onChange={(e) => setSpeakerName(e.target.value)}
                />
              </div>

              {/* Speaker Size */}
              <div className="pm-setting-group">
                <label>حجم المتحدث: {speakerSize}px</label>
                <input
                  type="range"
                  min="60"
                  max="200"
                  value={speakerSize}
                  onChange={(e) => setSpeakerSize(Number(e.target.value))}
                />
              </div>

              {/* Mic Status */}
              <div className="pm-mic-status">
                <Mic size={20} />
                <span>{isSpeaking ? 'يتحدث...' : 'صامت'}</span>
                <div className={`pm-mic-indicator ${isSpeaking ? 'active' : ''}`} />
              </div>

              <p className="pm-speaker-tip">
                💡 اسحب المتحدث لتغيير موقعه على الشاشة
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sections Sidebar */}
      <AnimatePresence>
        {showSections && (
          <motion.div
            className="pm-sidebar pm-sections-sidebar"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <div className="pm-sidebar-header">
              <h3>الأقسام</h3>
              <button onClick={() => setShowSections(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Add New Section */}
            <div className="pm-add-section">
              <input
                type="text"
                placeholder="عنوان القسم..."
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
              />
              <textarea
                placeholder="محتوى القسم..."
                value={newSectionContent}
                onChange={(e) => setNewSectionContent(e.target.value)}
                rows={3}
              />

              {/* Media Type Selection */}
              <div className="pm-media-type-selector">
                <span className="pm-media-label">نوع المحتوى:</span>
                <div className="pm-media-buttons">
                  <button 
                    className={`pm-media-btn ${newMediaType === 'none' ? 'active' : ''}`}
                    onClick={() => { setNewMediaType('none'); setNewMediaUrl(null); setNewMediaName(null); }}
                    title="نص فقط"
                  >
                    <Type size={16} />
                  </button>
                  <button 
                    className={`pm-media-btn ${newMediaType === 'image' ? 'active' : ''}`}
                    onClick={() => setNewMediaType('image')}
                    title="صورة"
                  >
                    <ImageIcon size={16} />
                  </button>
                  <button 
                    className={`pm-media-btn ${newMediaType === 'video' ? 'active' : ''}`}
                    onClick={() => setNewMediaType('video')}
                    title="فيديو"
                  >
                    <Video size={16} />
                  </button>
                  <button 
                    className={`pm-media-btn ${newMediaType === 'audio' ? 'active' : ''}`}
                    onClick={() => setNewMediaType('audio')}
                    title="صوت"
                  >
                    <Music size={16} />
                  </button>
                  <button 
                    className={`pm-media-btn ${newMediaType === 'pdf' ? 'active' : ''}`}
                    onClick={() => setNewMediaType('pdf')}
                    title="PDF"
                  >
                    <FileText size={16} />
                  </button>
                  <button 
                    className={`pm-media-btn ${newMediaType === 'link' ? 'active' : ''}`}
                    onClick={() => setNewMediaType('link')}
                    title="رابط"
                  >
                    <Link size={16} />
                  </button>
                </div>
              </div>

              {/* Media Upload based on type */}
              {newMediaType !== 'none' && newMediaType !== 'link' && (
                <div className="pm-media-upload">
                  <label className="pm-upload-label">
                    <Upload size={16} />
                    <span>
                      {newMediaName || (
                        newMediaType === 'image' ? 'اختر صورة...' :
                        newMediaType === 'video' ? 'اختر فيديو...' :
                        newMediaType === 'audio' ? 'اختر ملف صوتي...' :
                        'اختر ملف PDF...'
                      )}
                    </span>
                    <input
                      type="file"
                      accept={
                        newMediaType === 'image' ? 'image/*' :
                        newMediaType === 'video' ? 'video/*' :
                        newMediaType === 'audio' ? 'audio/*' :
                        '.pdf'
                      }
                      onChange={handleMediaUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                  {newMediaUrl && (
                    <button 
                      className="pm-clear-media"
                      onClick={() => { setNewMediaUrl(null); setNewMediaName(null); }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              )}

              {/* Link URL input */}
              {newMediaType === 'link' && (
                <input
                  type="url"
                  className="pm-link-input"
                  placeholder="أدخل الرابط..."
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                />
              )}

              <button 
                className="pm-add-btn"
                onClick={handleAddSection} 
                disabled={!newSectionTitle.trim()}
              >
                <Plus size={18} />
                <span>إضافة قسم</span>
              </button>
            </div>

            {/* Sections List */}
            <div className="pm-sections-list">
              {sections.map((section, index) => (
                <div 
                  key={section.id}
                  className={`pm-section-item ${index === currentSectionIndex ? 'active' : ''}`}
                  onClick={() => setCurrentSection(index)}
                >
                  <div className="pm-section-info">
                    <span className="pm-section-num">{index + 1}</span>
                    <div className="pm-section-text">
                      <h4>{section.title}</h4>
                      <p>{section.content.substring(0, 50)}...</p>
                    </div>
                  </div>
                  <div className="pm-section-actions">
                    <button onClick={(e) => {
                      e.stopPropagation();
                      deleteSection(section.id);
                    }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Sidebar */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="pm-sidebar pm-settings-sidebar"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <div className="pm-sidebar-header">
              <h3>الإعدادات</h3>
              <button onClick={() => setShowSettings(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div className="pm-settings-tabs">
              <button 
                className={settingsTab === 'theme' ? 'active' : ''}
                onClick={() => setSettingsTab('theme')}
              >
                <Palette size={16} />
                <span>اللون</span>
              </button>
              <button 
                className={settingsTab === 'frame' ? 'active' : ''}
                onClick={() => setSettingsTab('frame')}
              >
                <Frame size={16} />
                <span>الإطار</span>
              </button>
              <button 
                className={settingsTab === 'background' ? 'active' : ''}
                onClick={() => setSettingsTab('background')}
              >
                <ImageIcon size={16} />
                <span>الخلفية</span>
              </button>
              <button 
                className={settingsTab === 'effects' ? 'active' : ''}
                onClick={() => setSettingsTab('effects')}
              >
                <Sparkles size={16} />
                <span>التأثيرات</span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="pm-settings-content">
              {/* Theme */}
              {settingsTab === 'theme' && (
                <div className="pm-settings-grid themes-grid">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      className={`pm-theme-btn ${theme === t.id ? 'active' : ''}`}
                      style={{ '--theme-color': t.colors.primary } as React.CSSProperties}
                      onClick={() => setTheme(t.id)}
                    >
                      <span className="theme-color" style={{ background: t.colors.primary }} />
                      <span>{t.name}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Frame */}
              {settingsTab === 'frame' && (
                <div className="pm-settings-grid frames-grid">
                  {frames.map((f) => (
                    <button
                      key={f.id}
                      className={`pm-frame-btn ${frame === f.id ? 'active' : ''}`}
                      onClick={() => setFrame(f.id)}
                    >
                      <span className="frame-icon">{f.icon}</span>
                      <span>{f.name}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Background */}
              {settingsTab === 'background' && (
                <div className="pm-background-settings">
                  <div className="pm-settings-grid backgrounds-grid">
                    {backgrounds.map((bg) => (
                      <button
                        key={bg.id}
                        className={`pm-bg-btn ${background === bg.id && !customBackgroundImage ? 'active' : ''}`}
                        style={{ background: bg.gradient || bg.color }}
                        onClick={() => {
                          setBackground(bg.id);
                          setCustomBackgroundImage(null);
                        }}
                        title={bg.name}
                      />
                    ))}
                  </div>
                  
                  <div className="pm-upload-bg">
                    <label>
                      <Upload size={18} />
                      <span>رفع صورة خلفية</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBgUpload}
                        style={{ display: 'none' }}
                      />
                    </label>
                    {customBackgroundImage && (
                      <button 
                        className="pm-clear-bg"
                        onClick={() => setCustomBackgroundImage(null)}
                      >
                        <X size={14} />
                        مسح
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Effects */}
              {settingsTab === 'effects' && (
                <div className="pm-settings-grid effects-grid">
                  {sceneEffects.map((effect) => (
                    <button
                      key={effect.id}
                      className={`pm-effect-btn ${sceneEffect === effect.id ? 'active' : ''}`}
                      onClick={() => setSceneEffect(effect.id)}
                    >
                      <span className="effect-icon">{effect.icon}</span>
                      <span>{effect.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section Dots */}
      {sections.length > 1 && !showSettings && !showSections && (
        <div className="pm-dots">
          {sections.map((_, index) => (
            <button
              key={index}
              className={`pm-dot ${index === currentSectionIndex ? 'active' : ''}`}
              onClick={() => setCurrentSection(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
