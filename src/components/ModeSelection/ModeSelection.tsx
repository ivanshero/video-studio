import { motion } from 'framer-motion';
import { Camera, CameraOff, Sparkles, Smartphone, Send } from 'lucide-react';
import './ModeSelection.css';

interface ModeSelectionProps {
  onSelectMode: (mode: 'camera' | 'presentation' | 'mobile' | 'telegram') => void;
}

export function ModeSelection({ onSelectMode }: ModeSelectionProps) {
  return (
    <div className="mode-selection">
      {/* Background Animation */}
      <div className="mode-bg-effects">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i} 
            className="floating-particle"
            style={{
              '--delay': `${Math.random() * 5}s`,
              '--left': `${Math.random() * 100}%`,
              '--duration': `${5 + Math.random() * 5}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      <motion.div 
        className="mode-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Logo */}
        <div className="mode-logo">
          <Sparkles size={48} />
        </div>

        <h1 className="mode-title">استوديو الفيديو الإسلامي</h1>
        <p className="mode-subtitle">اختر طريقة العرض المناسبة لك</p>

        <div className="mode-options">
          {/* With Camera */}
          <motion.button
            className="mode-option camera"
            onClick={() => onSelectMode('camera')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="mode-option-icon">
              <Camera size={48} />
            </div>
            <h3>مع الكاميرا</h3>
            <p>تصوير مباشر مع عرض المحتوى</p>
            <ul>
              <li>عرض الكاميرا الخاصة بك</li>
              <li>مشاركة المحتوى بجانب الفيديو</li>
              <li>مثالي للدروس والمحاضرات</li>
            </ul>
          </motion.button>

          {/* Without Camera */}
          <motion.button
            className="mode-option no-camera"
            onClick={() => onSelectMode('presentation')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="mode-option-icon">
              <CameraOff size={48} />
            </div>
            <h3>بدون كاميرا</h3>
            <p>عرض المحتوى فقط</p>
            <ul>
              <li>تركيز كامل على المحتوى</li>
              <li>تأثيرات وإطارات إسلامية</li>
              <li>مثالي للعروض التقديمية</li>
            </ul>
          </motion.button>

          {/* Mobile Mode */}
          <motion.button
            className="mode-option mobile"
            onClick={() => onSelectMode('mobile')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="mode-option-icon">
              <Smartphone size={48} />
            </div>
            <h3>وضع الهاتف</h3>
            <p>واجهة مُحسّنة للهواتف</p>
            <ul>
              <li>تحكم سهل بالسحب</li>
              <li>دائرة فقاعات صوتية</li>
              <li>مثالي للعرض على الجوال</li>
            </ul>
          </motion.button>

          {/* Telegram Designer */}
          <motion.button
            className="mode-option telegram"
            onClick={() => onSelectMode('telegram')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="mode-option-icon">
              <Send size={48} />
            </div>
            <h3>تصميم التلغرام</h3>
            <p>إنشاء منشورات احترافية</p>
            <ul>
              <li>تنسيقات وخطوط متعددة</li>
              <li>خلفيات وزخارف جميلة</li>
              <li>تحميل كصورة PNG</li>
            </ul>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
