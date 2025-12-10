import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Layers, 
  Home, 
  ChevronLeft, 
  ChevronRight, 
  Palette,
  Frame,
  Sparkles,
  Image as ImageIcon,
  Play,
  Pause,
  X,
  Plus,
  Trash2,
  Upload
} from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';
import { themeColors, frames, backgrounds, sceneEffects } from '../../utils/constants';
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
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  const currentSection = sections[currentSectionIndex];

  // Auto play
  useEffect(() => {
    if (!isAutoPlay || sections.length <= 1) return;
    
    const interval = setInterval(() => {
      nextSection();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay, nextSection, sections.length]);

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

  // Add new section
  const handleAddSection = () => {
    if (newSectionTitle.trim()) {
      addSection({
        title: newSectionTitle,
        content: newSectionContent,
        mediaType: 'none',
        mediaUrl: null,
        mediaName: null,
        linkUrl: null,
      });
      setNewSectionTitle('');
      setNewSectionContent('');
    }
  };

  return (
    <div 
      className="presentation-mode" 
      data-theme={theme}
      style={getBackgroundStyle()}
    >
      {/* Scene Effects */}
      <SceneEffects effect={sceneEffect} />

      {/* Header */}
      <div className="pm-header">
        <button className="pm-btn pm-back-btn" onClick={onBack}>
          <Home size={20} />
        </button>
        
        <div className="pm-header-center">
          <button 
            className="pm-nav-btn"
            onClick={prevSection}
            disabled={sections.length <= 1}
          >
            <ChevronRight size={20} />
          </button>
          <span className="pm-section-indicator">
            {sections.length > 0 ? `${currentSectionIndex + 1} / ${sections.length}` : '0 / 0'}
          </span>
          <button 
            className="pm-nav-btn"
            onClick={nextSection}
            disabled={sections.length <= 1}
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            className={`pm-nav-btn ${isAutoPlay ? 'active' : ''}`}
            onClick={() => setIsAutoPlay(!isAutoPlay)}
          >
            {isAutoPlay ? <Pause size={18} /> : <Play size={18} />}
          </button>
        </div>

        <div className="pm-header-actions">
          <button 
            className={`pm-btn ${showSections ? 'active' : ''}`}
            onClick={() => {
              setShowSections(!showSections);
              setShowSettings(false);
            }}
          >
            <Layers size={20} />
          </button>
          <button 
            className={`pm-btn ${showSettings ? 'active' : ''}`}
            onClick={() => {
              setShowSettings(!showSettings);
              setShowSections(false);
            }}
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`pm-content ${showSettings || showSections ? 'with-sidebar' : ''}`}>
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
              <button onClick={handleAddSection} disabled={!newSectionTitle.trim()}>
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
