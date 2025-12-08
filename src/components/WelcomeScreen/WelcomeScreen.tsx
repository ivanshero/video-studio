import { motion } from 'framer-motion';
import './WelcomeScreen.css';

export function WelcomeScreen() {
  return (
    <motion.div 
      className="welcome-screen"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="welcome-decoration top">✦ ✦ ✦</div>
      
      <div className="welcome-icon">🕌</div>
      
      <h1 className="welcome-title">بسم الله الرحمن الرحيم</h1>
      
      <p className="welcome-subtitle">استوديو الفيديو الإسلامي</p>
      
      <div className="welcome-instructions">
        <p>أضف أقسامًا من لوحة التحكم لبدء العرض</p>
        <div className="keyboard-hints">
          <span><kbd>→</kbd> القسم التالي</span>
          <span><kbd>←</kbd> القسم السابق</span>
          <span><kbd>S</kbd> تمرير تلقائي</span>
          <span><kbd>F</kbd> ملء الشاشة</span>
        </div>
      </div>
      
      <div className="welcome-decoration bottom">✦ ✦ ✦</div>
    </motion.div>
  );
}
