import { useAppStore } from '../../stores/useAppStore';
import { frames, backgrounds, sceneEffects, animationTypes } from '../../utils/constants';
import { 
  Plus, ChevronLeft, ChevronRight, Maximize2, 
  RotateCcw, Expand, User, Upload,
  Image, Video, Music, Link, FileText
} from 'lucide-react';
import { useState, useRef } from 'react';
import type { MediaType } from '../../types';
import './ControlPanel.css';

interface ControlPanelProps {
  onExpandedClick?: () => void;
}

export function ControlPanel({ onExpandedClick }: ControlPanelProps) {
  const {
    sections,
    currentSectionIndex,
    addSection,
    nextSection,
    prevSection,
    clearSections,
    theme,
    setTheme,
    frame,
    setFrame,
    background,
    setBackground,
    customBackgroundImage,
    setCustomBackgroundImage,
    sceneEffect,
    setSceneEffect,
    animationType,
    setAnimationType,
    animationSpeed,
    setAnimationSpeed,
    isAvatarVisible,
    setAvatarVisible,
  } = useAppStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mediaType, setMediaType] = useState<MediaType>('none');
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaName, setMediaName] = useState<string | null>(null);
  const [linkUrl, setLinkUrl] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgImageInputRef = useRef<HTMLInputElement>(null);

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
    }
  };

  const handleBgImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const url = URL.createObjectURL(file);
    setCustomBackgroundImage(url);
    setBackground('custom-image');
  };

  const themes = ['gold', 'emerald', 'royal', 'sunset', 'purple', 'teal'] as const;

  return (
    <aside className="control-panel">
      {/* Header */}
      <header className="panel-header">
        <h2>🕌 استوديو الفيديو الإسلامي</h2>
        <div className="islamic-ornament" />
      </header>

      {/* Add Section */}
      <section className="control-section">
        <h3><FileText size={16} /> إضافة قسم</h3>
        
        <input
          type="text"
          className="islamic-input"
          placeholder="عنوان القسم"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        
        <textarea
          className="islamic-input"
          placeholder="محتوى القسم"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
        />

        {/* Media Type Selection */}
        <div className="media-type-buttons">
          <button 
            className={`media-type-btn ${mediaType === 'none' ? 'active' : ''}`}
            onClick={() => setMediaType('none')}
            title="نص فقط"
          >
            <FileText size={18} />
          </button>
          <button 
            className={`media-type-btn ${mediaType === 'image' ? 'active' : ''}`}
            onClick={() => { setMediaType('image'); fileInputRef.current?.click(); }}
            title="صورة"
          >
            <Image size={18} />
          </button>
          <button 
            className={`media-type-btn ${mediaType === 'video' ? 'active' : ''}`}
            onClick={() => { setMediaType('video'); fileInputRef.current?.click(); }}
            title="فيديو"
          >
            <Video size={18} />
          </button>
          <button 
            className={`media-type-btn ${mediaType === 'audio' ? 'active' : ''}`}
            onClick={() => { setMediaType('audio'); fileInputRef.current?.click(); }}
            title="صوت"
          >
            <Music size={18} />
          </button>
          <button 
            className={`media-type-btn ${mediaType === 'link' ? 'active' : ''}`}
            onClick={() => setMediaType('link')}
            title="رابط"
          >
            <Link size={18} />
          </button>
          <button 
            className={`media-type-btn ${mediaType === 'pdf' ? 'active' : ''}`}
            onClick={() => { setMediaType('pdf'); fileInputRef.current?.click(); }}
            title="ملف PDF"
          >
            📄
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*,audio/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {mediaType === 'link' && (
          <input
            type="url"
            className="islamic-input"
            placeholder="أدخل الرابط (https://...)"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
          />
        )}

        {mediaName && (
          <div className="media-preview-name">
            📁 {mediaName}
          </div>
        )}

        <button className="islamic-btn primary full-width" onClick={handleAddSection}>
          <Plus size={18} /> إضافة القسم
        </button>
      </section>

      {/* Navigation */}
      <section className="control-section">
        <h3><ChevronRight size={16} /> التنقل</h3>
        <div className="nav-buttons">
          <button className="islamic-btn" onClick={prevSection} disabled={currentSectionIndex <= 0}>
            <ChevronRight size={18} /> السابق
          </button>
          <span className="nav-counter">
            {Math.max(0, currentSectionIndex + 1)} / {sections.length}
          </span>
          <button className="islamic-btn" onClick={nextSection} disabled={currentSectionIndex >= sections.length - 1}>
            التالي <ChevronLeft size={18} />
          </button>
        </div>
        <button 
          className="islamic-btn full-width"
          onClick={() => onExpandedClick?.()}
        >
          <Expand size={18} /> عرض جميع الأقسام
        </button>
      </section>

      {/* Themes */}
      <section className="control-section">
        <h3>🎨 اللون</h3>
        <div className="theme-options">
          {themes.map((t) => (
            <button
              key={t}
              className={`theme-btn theme-${t} ${theme === t ? 'active' : ''}`}
              onClick={() => setTheme(t)}
              title={t}
            />
          ))}
        </div>
      </section>

      {/* Frames */}
      <section className="control-section">
        <h3>🖼️ الإطار</h3>
        <div className="frame-options">
          {frames.map((f) => (
            <button
              key={f.id}
              className={`frame-btn ${frame === f.id ? 'active' : ''}`}
              onClick={() => setFrame(f.id)}
              title={f.name}
            >
              {f.name.charAt(0)}
            </button>
          ))}
        </div>
      </section>

      {/* Backgrounds */}
      <section className="control-section">
        <h3>🌈 الخلفية</h3>
        <div className="bg-options">
          {backgrounds.filter(b => b.id !== 'custom-image').map((b) => (
            <button
              key={b.id}
              className={`bg-btn ${background === b.id ? 'active' : ''} ${b.isGradient ? 'gradient' : ''}`}
              onClick={() => setBackground(b.id)}
              title={b.name}
              style={{ 
                backgroundColor: b.color,
                background: b.gradient || b.color,
              }}
            />
          ))}
        </div>
        
        {/* Custom Image Background */}
        <div className="bg-image-upload">
          <button 
            className={`islamic-btn full-width ${background === 'custom-image' ? 'active' : ''}`}
            onClick={() => bgImageInputRef.current?.click()}
          >
            <Upload size={16} /> {customBackgroundImage ? 'تغيير صورة الخلفية' : 'رفع صورة كخلفية'}
          </button>
          <input
            ref={bgImageInputRef}
            type="file"
            accept="image/*"
            onChange={handleBgImageChange}
            style={{ display: 'none' }}
          />
          {customBackgroundImage && (
            <button 
              className="islamic-btn secondary full-width"
              onClick={() => {
                setCustomBackgroundImage(null);
                setBackground('dark-night');
              }}
            >
              إزالة صورة الخلفية
            </button>
          )}
        </div>
      </section>

      {/* Scene Effects */}
      <section className="control-section">
        <h3>✨ تأثيرات المشهد</h3>
        <div className="effect-options">
          {sceneEffects.map((e) => (
            <button
              key={e.id}
              className={`effect-btn ${sceneEffect === e.id ? 'active' : ''}`}
              onClick={() => setSceneEffect(e.id)}
              title={e.name}
            >
              {e.name.charAt(0)}
            </button>
          ))}
        </div>
      </section>

      {/* Animation */}
      <section className="control-section">
        <h3>🎬 الحركة</h3>
        <select 
          className="islamic-input"
          value={animationType}
          onChange={(e) => setAnimationType(e.target.value as typeof animationType)}
        >
          {animationTypes.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
        <div className="speed-control">
          <label>السرعة: {animationSpeed}s</label>
          <input
            type="range"
            min="0.3"
            max="2"
            step="0.1"
            value={animationSpeed}
            onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
          />
        </div>
      </section>

      {/* Actions */}
      <section className="control-section">
        <h3>⚙️ إجراءات</h3>
        <div className="action-buttons">
          <button 
            className={`islamic-btn full-width ${isAvatarVisible ? 'active' : ''}`}
            onClick={() => setAvatarVisible(!isAvatarVisible)}
          >
            <User size={16} /> {isAvatarVisible ? 'إخفاء الشخصية' : 'إظهار الشخصية'}
          </button>
          <button className="islamic-btn full-width">
            <Maximize2 size={16} /> ملء الشاشة
          </button>
          <button className="islamic-btn full-width" onClick={clearSections}>
            <RotateCcw size={16} /> إعادة تعيين
          </button>
        </div>
      </section>

      {/* Recording Status */}
      <section className="control-section recording-status">
        <div className="live-indicator">
          <span className="live-dot" />
          <span>جاهز للتسجيل</span>
        </div>
        <div className="shortcut-hint">
          <kbd>S</kbd> اضغط مطولاً للتمرير التلقائي
        </div>
      </section>
    </aside>
  );
}
