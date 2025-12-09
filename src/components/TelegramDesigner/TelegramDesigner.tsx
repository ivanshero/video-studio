import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Type, 
  Palette, 
  Image as ImageIcon, 
  Link, 
  Download,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  RotateCcw,
  Maximize2,
  Sparkles,
  Hash,
  AtSign,
  Copy,
  Check,
  Home,
  Settings,
  ChevronDown,
  Eye
} from 'lucide-react';
import './TelegramDesigner.css';

interface TelegramDesignerProps {
  onBack: () => void;
}

interface TextStyle {
  fontSize: number;
  fontFamily: string;
  color: string;
  textAlign: 'left' | 'center' | 'right';
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  lineHeight: number;
  letterSpacing: number;
}

interface DesignSettings {
  backgroundColor: string;
  backgroundGradient: string | null;
  backgroundImage: string | null;
  padding: number;
  borderRadius: number;
  borderColor: string;
  borderWidth: number;
  shadowIntensity: number;
  width: number;
  height: number;
}

const FONTS = [
  { id: 'tajawal', name: 'Tajawal', family: "'Tajawal', sans-serif" },
  { id: 'cairo', name: 'Cairo', family: "'Cairo', sans-serif" },
  { id: 'amiri', name: 'Amiri', family: "'Amiri', serif" },
  { id: 'noto-kufi', name: 'Noto Kufi', family: "'Noto Kufi Arabic', sans-serif" },
  { id: 'almarai', name: 'Almarai', family: "'Almarai', sans-serif" },
  { id: 'changa', name: 'Changa', family: "'Changa', sans-serif" },
];

const COLORS = [
  '#ffffff', '#f8f9fa', '#e9ecef', '#dee2e6', '#ced4da',
  '#d4af37', '#f4d03f', '#ffc107', '#ff9800', '#ff5722',
  '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3',
  '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a',
  '#1a1a2e', '#16213e', '#0f3460', '#533483', '#2c3e50',
];

const GRADIENTS = [
  { id: 'gold', value: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%)' },
  { id: 'sunset', value: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)' },
  { id: 'ocean', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { id: 'forest', value: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
  { id: 'night', value: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2a 50%, #0a1a2a 100%)' },
  { id: 'royal', value: 'linear-gradient(135deg, #141E30 0%, #243B55 100%)' },
  { id: 'fire', value: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)' },
  { id: 'aurora', value: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)' },
];

const DECORATIONS = [
  { id: 'none', icon: '✖️', name: 'بدون' },
  { id: 'stars', icon: '⭐', name: 'نجوم' },
  { id: 'hearts', icon: '❤️', name: 'قلوب' },
  { id: 'sparkles', icon: '✨', name: 'لمعان' },
  { id: 'flowers', icon: '🌸', name: 'ورود' },
  { id: 'islamic', icon: '☪️', name: 'إسلامي' },
  { id: 'arrows', icon: '➤', name: 'أسهم' },
  { id: 'dots', icon: '●', name: 'نقاط' },
];

export const TelegramDesigner = ({ onBack }: TelegramDesignerProps) => {
  // Content State
  const [mainText, setMainText] = useState('اكتب نصك هنا...');
  const [channelName, setChannelName] = useState('@channel_name');
  const [channelUrl, setChannelUrl] = useState('https://t.me/channel_name');
  const [hashtags, setHashtags] = useState('#تصميم #تلغرام');
  const [decoration, setDecoration] = useState('none');
  
  // Text Style
  const [textStyle, setTextStyle] = useState<TextStyle>({
    fontSize: 24,
    fontFamily: "'Tajawal', sans-serif",
    color: '#ffffff',
    textAlign: 'center',
    isBold: false,
    isItalic: false,
    isUnderline: false,
    lineHeight: 1.8,
    letterSpacing: 0,
  });

  // Design Settings
  const [design, setDesign] = useState<DesignSettings>({
    backgroundColor: '#1a1a2e',
    backgroundGradient: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2a 50%, #0a1a2a 100%)',
    backgroundImage: null,
    padding: 40,
    borderRadius: 20,
    borderColor: '#d4af37',
    borderWidth: 2,
    shadowIntensity: 30,
    width: 400,
    height: 500,
  });

  // UI State
  const [activeTab, setActiveTab] = useState<'text' | 'design' | 'channel'>('text');
  const [showSettings, setShowSettings] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const designRef = useRef<HTMLDivElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  // Get decoration elements
  const getDecorationElements = () => {
    switch (decoration) {
      case 'stars':
        return '★ ☆ ★ ☆ ★';
      case 'hearts':
        return '❤️ 💕 ❤️ 💕 ❤️';
      case 'sparkles':
        return '✨ ⭐ ✨ ⭐ ✨';
      case 'flowers':
        return '🌸 🌺 🌸 🌺 🌸';
      case 'islamic':
        return '☪️ ✦ ☪️ ✦ ☪️';
      case 'arrows':
        return '➤ ◆ ➤ ◆ ➤';
      case 'dots':
        return '● ○ ● ○ ●';
      default:
        return '';
    }
  };

  // Handle background image upload
  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setDesign(prev => ({ 
          ...prev, 
          backgroundImage: event.target?.result as string,
          backgroundGradient: null 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Copy text to clipboard
  const copyToClipboard = useCallback(() => {
    const text = `${getDecorationElements()}\n\n${mainText}\n\n${hashtags}\n\n${channelName}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [mainText, hashtags, channelName, decoration]);

  // Download as image
  const downloadAsImage = useCallback(async () => {
    if (!designRef.current) return;
    
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(designRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });
      
      const link = document.createElement('a');
      link.download = `telegram-design-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert('يرجى تثبيت html2canvas: npm install html2canvas');
    }
  }, []);

  // Get background style
  const getBackgroundStyle = () => {
    if (design.backgroundImage) {
      return {
        backgroundImage: `url(${design.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    if (design.backgroundGradient) {
      return { background: design.backgroundGradient };
    }
    return { backgroundColor: design.backgroundColor };
  };

  return (
    <div className="telegram-designer">
      {/* Header */}
      <div className="td-header">
        <button className="td-back-btn" onClick={onBack}>
          <Home size={20} />
        </button>
        <h2>تصميم منشورات التلغرام</h2>
        <button 
          className="td-settings-btn"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Main Content */}
      <div className="td-main">
        {/* Preview Area */}
        <div className={`td-preview-wrapper ${isFullscreen ? 'fullscreen' : ''}`}>
          <div 
            className="td-preview"
            ref={designRef}
            style={{
              ...getBackgroundStyle(),
              padding: design.padding,
              borderRadius: design.borderRadius,
              border: `${design.borderWidth}px solid ${design.borderColor}`,
              boxShadow: `0 ${design.shadowIntensity}px ${design.shadowIntensity * 2}px rgba(0,0,0,0.3)`,
              width: isFullscreen ? '100%' : design.width,
              minHeight: design.height,
            }}
          >
            {/* Decoration Top */}
            {decoration !== 'none' && (
              <div className="td-decoration top" style={{ color: design.borderColor }}>
                {getDecorationElements()}
              </div>
            )}

            {/* Main Text */}
            <div 
              className="td-main-text"
              style={{
                fontSize: textStyle.fontSize,
                fontFamily: textStyle.fontFamily,
                color: textStyle.color,
                textAlign: textStyle.textAlign,
                fontWeight: textStyle.isBold ? 'bold' : 'normal',
                fontStyle: textStyle.isItalic ? 'italic' : 'normal',
                textDecoration: textStyle.isUnderline ? 'underline' : 'none',
                lineHeight: textStyle.lineHeight,
                letterSpacing: textStyle.letterSpacing,
              }}
            >
              {mainText}
            </div>

            {/* Hashtags */}
            {hashtags && (
              <div className="td-hashtags" style={{ color: design.borderColor }}>
                {hashtags}
              </div>
            )}

            {/* Decoration Bottom */}
            {decoration !== 'none' && (
              <div className="td-decoration bottom" style={{ color: design.borderColor }}>
                {getDecorationElements()}
              </div>
            )}

            {/* Channel Link */}
            <div className="td-channel">
              <a 
                href={channelUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: design.borderColor }}
              >
                <Send size={14} />
                <span>{channelName}</span>
              </a>
            </div>
          </div>

          {/* Preview Actions */}
          <div className="td-preview-actions">
            <button onClick={() => setIsFullscreen(!isFullscreen)} title="ملء الشاشة">
              <Maximize2 size={18} />
            </button>
            <button onClick={copyToClipboard} title="نسخ النص">
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
            <button onClick={downloadAsImage} title="تحميل كصورة">
              <Download size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="td-settings-panel"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, duration: 0.5 }}
          >
            <div className="td-settings-header">
              <button onClick={() => setShowSettings(false)}>
                <ChevronDown size={24} />
              </button>
              <h3>الإعدادات</h3>
            </div>

            {/* Tabs */}
            <div className="td-tabs">
              <button 
                className={activeTab === 'text' ? 'active' : ''}
                onClick={() => setActiveTab('text')}
              >
                <Type size={18} />
                <span>النص</span>
              </button>
              <button 
                className={activeTab === 'design' ? 'active' : ''}
                onClick={() => setActiveTab('design')}
              >
                <Palette size={18} />
                <span>التصميم</span>
              </button>
              <button 
                className={activeTab === 'channel' ? 'active' : ''}
                onClick={() => setActiveTab('channel')}
              >
                <Send size={18} />
                <span>القناة</span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="td-tab-content">
              {/* Text Tab */}
              {activeTab === 'text' && (
                <div className="td-text-settings">
                  {/* Main Text Input */}
                  <div className="td-input-group">
                    <label>النص الرئيسي</label>
                    <textarea
                      value={mainText}
                      onChange={(e) => setMainText(e.target.value)}
                      placeholder="اكتب نصك هنا..."
                      rows={4}
                    />
                  </div>

                  {/* Font Selection */}
                  <div className="td-input-group">
                    <label>الخط</label>
                    <div className="td-font-grid">
                      {FONTS.map(font => (
                        <button
                          key={font.id}
                          className={textStyle.fontFamily === font.family ? 'active' : ''}
                          style={{ fontFamily: font.family }}
                          onClick={() => setTextStyle(prev => ({ ...prev, fontFamily: font.family }))}
                        >
                          {font.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Size */}
                  <div className="td-input-group">
                    <label>حجم الخط: {textStyle.fontSize}px</label>
                    <input
                      type="range"
                      min="12"
                      max="72"
                      value={textStyle.fontSize}
                      onChange={(e) => setTextStyle(prev => ({ ...prev, fontSize: Number(e.target.value) }))}
                    />
                  </div>

                  {/* Text Color */}
                  <div className="td-input-group">
                    <label>لون النص</label>
                    <div className="td-color-grid">
                      {COLORS.map(color => (
                        <button
                          key={color}
                          className={textStyle.color === color ? 'active' : ''}
                          style={{ backgroundColor: color }}
                          onClick={() => setTextStyle(prev => ({ ...prev, color }))}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Text Alignment */}
                  <div className="td-input-group">
                    <label>محاذاة النص</label>
                    <div className="td-align-btns">
                      <button
                        className={textStyle.textAlign === 'right' ? 'active' : ''}
                        onClick={() => setTextStyle(prev => ({ ...prev, textAlign: 'right' }))}
                      >
                        <AlignRight size={18} />
                      </button>
                      <button
                        className={textStyle.textAlign === 'center' ? 'active' : ''}
                        onClick={() => setTextStyle(prev => ({ ...prev, textAlign: 'center' }))}
                      >
                        <AlignCenter size={18} />
                      </button>
                      <button
                        className={textStyle.textAlign === 'left' ? 'active' : ''}
                        onClick={() => setTextStyle(prev => ({ ...prev, textAlign: 'left' }))}
                      >
                        <AlignLeft size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Text Style Toggles */}
                  <div className="td-input-group">
                    <label>تنسيق النص</label>
                    <div className="td-style-btns">
                      <button
                        className={textStyle.isBold ? 'active' : ''}
                        onClick={() => setTextStyle(prev => ({ ...prev, isBold: !prev.isBold }))}
                      >
                        <Bold size={18} />
                      </button>
                      <button
                        className={textStyle.isItalic ? 'active' : ''}
                        onClick={() => setTextStyle(prev => ({ ...prev, isItalic: !prev.isItalic }))}
                      >
                        <Italic size={18} />
                      </button>
                      <button
                        className={textStyle.isUnderline ? 'active' : ''}
                        onClick={() => setTextStyle(prev => ({ ...prev, isUnderline: !prev.isUnderline }))}
                      >
                        <Underline size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Line Height */}
                  <div className="td-input-group">
                    <label>ارتفاع السطر: {textStyle.lineHeight}</label>
                    <input
                      type="range"
                      min="1"
                      max="3"
                      step="0.1"
                      value={textStyle.lineHeight}
                      onChange={(e) => setTextStyle(prev => ({ ...prev, lineHeight: Number(e.target.value) }))}
                    />
                  </div>

                  {/* Hashtags */}
                  <div className="td-input-group">
                    <label><Hash size={14} /> الهاشتاقات</label>
                    <input
                      type="text"
                      value={hashtags}
                      onChange={(e) => setHashtags(e.target.value)}
                      placeholder="#هاشتاق1 #هاشتاق2"
                    />
                  </div>

                  {/* Decoration */}
                  <div className="td-input-group">
                    <label><Sparkles size={14} /> الزخرفة</label>
                    <div className="td-decoration-grid">
                      {DECORATIONS.map(dec => (
                        <button
                          key={dec.id}
                          className={decoration === dec.id ? 'active' : ''}
                          onClick={() => setDecoration(dec.id)}
                        >
                          <span>{dec.icon}</span>
                          <span>{dec.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Design Tab */}
              {activeTab === 'design' && (
                <div className="td-design-settings">
                  {/* Background Gradient */}
                  <div className="td-input-group">
                    <label>خلفية متدرجة</label>
                    <div className="td-gradient-grid">
                      {GRADIENTS.map(grad => (
                        <button
                          key={grad.id}
                          className={design.backgroundGradient === grad.value ? 'active' : ''}
                          style={{ background: grad.value }}
                          onClick={() => setDesign(prev => ({ 
                            ...prev, 
                            backgroundGradient: grad.value,
                            backgroundImage: null 
                          }))}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Background Color */}
                  <div className="td-input-group">
                    <label>لون الخلفية</label>
                    <div className="td-color-grid">
                      {COLORS.map(color => (
                        <button
                          key={color}
                          className={design.backgroundColor === color && !design.backgroundGradient ? 'active' : ''}
                          style={{ backgroundColor: color }}
                          onClick={() => setDesign(prev => ({ 
                            ...prev, 
                            backgroundColor: color,
                            backgroundGradient: null,
                            backgroundImage: null 
                          }))}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Background Image */}
                  <div className="td-input-group">
                    <label>صورة الخلفية</label>
                    <button className="td-upload-btn" onClick={() => bgInputRef.current?.click()}>
                      <ImageIcon size={18} />
                      <span>رفع صورة</span>
                    </button>
                    <input
                      ref={bgInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleBgUpload}
                      style={{ display: 'none' }}
                    />
                  </div>

                  {/* Border Color */}
                  <div className="td-input-group">
                    <label>لون الإطار والزخرفة</label>
                    <div className="td-color-grid">
                      {COLORS.map(color => (
                        <button
                          key={color}
                          className={design.borderColor === color ? 'active' : ''}
                          style={{ backgroundColor: color }}
                          onClick={() => setDesign(prev => ({ ...prev, borderColor: color }))}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Border Width */}
                  <div className="td-input-group">
                    <label>سمك الإطار: {design.borderWidth}px</label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={design.borderWidth}
                      onChange={(e) => setDesign(prev => ({ ...prev, borderWidth: Number(e.target.value) }))}
                    />
                  </div>

                  {/* Border Radius */}
                  <div className="td-input-group">
                    <label>انحناء الزوايا: {design.borderRadius}px</label>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={design.borderRadius}
                      onChange={(e) => setDesign(prev => ({ ...prev, borderRadius: Number(e.target.value) }))}
                    />
                  </div>

                  {/* Padding */}
                  <div className="td-input-group">
                    <label>الحشوة الداخلية: {design.padding}px</label>
                    <input
                      type="range"
                      min="10"
                      max="80"
                      value={design.padding}
                      onChange={(e) => setDesign(prev => ({ ...prev, padding: Number(e.target.value) }))}
                    />
                  </div>

                  {/* Shadow */}
                  <div className="td-input-group">
                    <label>شدة الظل: {design.shadowIntensity}</label>
                    <input
                      type="range"
                      min="0"
                      max="60"
                      value={design.shadowIntensity}
                      onChange={(e) => setDesign(prev => ({ ...prev, shadowIntensity: Number(e.target.value) }))}
                    />
                  </div>

                  {/* Size */}
                  <div className="td-input-group">
                    <label>العرض: {design.width}px</label>
                    <input
                      type="range"
                      min="300"
                      max="600"
                      value={design.width}
                      onChange={(e) => setDesign(prev => ({ ...prev, width: Number(e.target.value) }))}
                    />
                  </div>

                  <div className="td-input-group">
                    <label>الارتفاع: {design.height}px</label>
                    <input
                      type="range"
                      min="300"
                      max="800"
                      value={design.height}
                      onChange={(e) => setDesign(prev => ({ ...prev, height: Number(e.target.value) }))}
                    />
                  </div>

                  {/* Reset */}
                  <button className="td-reset-btn" onClick={() => {
                    setDesign({
                      backgroundColor: '#1a1a2e',
                      backgroundGradient: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2a 50%, #0a1a2a 100%)',
                      backgroundImage: null,
                      padding: 40,
                      borderRadius: 20,
                      borderColor: '#d4af37',
                      borderWidth: 2,
                      shadowIntensity: 30,
                      width: 400,
                      height: 500,
                    });
                  }}>
                    <RotateCcw size={18} />
                    <span>إعادة تعيين</span>
                  </button>
                </div>
              )}

              {/* Channel Tab */}
              {activeTab === 'channel' && (
                <div className="td-channel-settings">
                  <div className="td-input-group">
                    <label><AtSign size={14} /> اسم القناة</label>
                    <input
                      type="text"
                      value={channelName}
                      onChange={(e) => setChannelName(e.target.value)}
                      placeholder="@channel_name"
                    />
                  </div>

                  <div className="td-input-group">
                    <label><Link size={14} /> رابط القناة</label>
                    <input
                      type="url"
                      value={channelUrl}
                      onChange={(e) => setChannelUrl(e.target.value)}
                      placeholder="https://t.me/channel_name"
                    />
                  </div>

                  <div className="td-channel-preview">
                    <h4>معاينة</h4>
                    <a href={channelUrl} target="_blank" rel="noopener noreferrer">
                      <Send size={16} />
                      <span>{channelName}</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Show Settings Button (when closed) */}
      {!showSettings && (
        <button 
          className="td-show-settings"
          onClick={() => setShowSettings(true)}
        >
          <Eye size={20} />
          <span>الإعدادات</span>
        </button>
      )}
    </div>
  );
};
