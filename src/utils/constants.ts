import type { 
  ThemeType, 
  ThemeColors,
  FrameInfo,
  BackgroundInfo,
  SceneEffectInfo 
} from '../types';

// Theme Colors
export const themeColors: Record<ThemeType, ThemeColors> = {
  gold: {
    primary: '#d4af37',
    primaryLight: '#f4d03f',
    primaryDark: '#b8860b',
    accent: '#c9a227',
    shadow: 'rgba(212, 175, 55, 0.3)',
  },
  emerald: {
    primary: '#2e7d32',
    primaryLight: '#4caf50',
    primaryDark: '#1b5e20',
    accent: '#388e3c',
    shadow: 'rgba(46, 125, 50, 0.3)',
  },
  royal: {
    primary: '#1a237e',
    primaryLight: '#3949ab',
    primaryDark: '#0d1642',
    accent: '#283593',
    shadow: 'rgba(26, 35, 126, 0.3)',
  },
  sunset: {
    primary: '#bf360c',
    primaryLight: '#e64a19',
    primaryDark: '#8c2703',
    accent: '#d84315',
    shadow: 'rgba(191, 54, 12, 0.3)',
  },
  purple: {
    primary: '#7b1fa2',
    primaryLight: '#9c27b0',
    primaryDark: '#4a148c',
    accent: '#8e24aa',
    shadow: 'rgba(123, 31, 162, 0.3)',
  },
  teal: {
    primary: '#00796b',
    primaryLight: '#009688',
    primaryDark: '#004d40',
    accent: '#00897b',
    shadow: 'rgba(0, 121, 107, 0.3)',
  },
};

// Frame Designs
export const frames: FrameInfo[] = [
  { id: 'classic', name: 'كلاسيكي', icon: 'Frame' },
  { id: 'ornate', name: 'مزخرف', icon: 'Sparkles' },
  { id: 'geometric', name: 'هندسي', icon: 'Hexagon' },
  { id: 'arabesque', name: 'أرابيسك', icon: 'Flower2' },
  { id: 'minimal', name: 'بسيط', icon: 'Minus' },
  { id: 'royal', name: 'ملكي', icon: 'Crown' },
  { id: 'stars', name: 'نجوم', icon: 'Star' },
  { id: 'crescent', name: 'هلال', icon: 'Moon' },
  { id: 'calligraphy', name: 'خط عربي', icon: 'PenTool' },
  { id: 'mosaic', name: 'فسيفساء', icon: 'Grid3X3' },
  { id: 'dome', name: 'قبة', icon: 'Building' },
  { id: 'none', name: 'بدون', icon: 'X' },
];

// Background Colors
export const backgrounds: BackgroundInfo[] = [
  // Dark shades
  { id: 'dark-night', name: 'ليل داكن', color: '#0a0a0f', textColor: '#ffffff' },
  { id: 'midnight', name: 'منتصف الليل', color: '#0f0f1a', textColor: '#ffffff' },
  { id: 'charcoal', name: 'فحمي', color: '#1a1a1a', textColor: '#ffffff' },
  { id: 'navy', name: 'كحلي', color: '#0a192f', textColor: '#ffffff' },
  { id: 'slate', name: 'رمادي داكن', color: '#2d3436', textColor: '#ffffff' },
  
  // Nature inspired
  { id: 'ocean', name: 'محيط', color: '#0d3b4c', textColor: '#ffffff' },
  { id: 'forest', name: 'غابة', color: '#1a3c2a', textColor: '#ffffff' },
  { id: 'olive', name: 'زيتوني', color: '#2c3e2d', textColor: '#ffffff' },
  { id: 'earthy', name: 'ترابي', color: '#3d2b1f', textColor: '#ffffff' },
  
  // Warm tones
  { id: 'purple', name: 'بنفسجي', color: '#1a1025', textColor: '#ffffff' },
  { id: 'wine', name: 'نبيذي', color: '#2c1a2e', textColor: '#ffffff' },
  { id: 'warm-sunset', name: 'غروب', color: '#2c1810', textColor: '#ffffff' },
  { id: 'rose', name: 'وردي', color: '#2c1520', textColor: '#ffffff' },
  { id: 'indigo', name: 'نيلي', color: '#1a0a30', textColor: '#ffffff' },
  
  // Light pastels
  { id: 'cream', name: 'كريمي', color: '#f5f0e6', textColor: '#2c2c2c' },
  { id: 'light-sky', name: 'سماوي', color: '#e8f4f8', textColor: '#1a3c4c' },
  { id: 'lavender', name: 'لافندر', color: '#e6e0f0', textColor: '#2c2c3c' },
  { id: 'mint', name: 'نعناعي', color: '#e0f5ef', textColor: '#1a3c2c' },
  { id: 'peach', name: 'خوخي', color: '#fdf0e8', textColor: '#3c2c1a' },
  { id: 'coral', name: 'مرجاني', color: '#fff0ef', textColor: '#3c2020' },
  
  // Gradients
  { id: 'gradient-sunset', name: 'تدرج الغروب', color: '#1a0a20', textColor: '#ffffff', isGradient: true, gradient: 'linear-gradient(135deg, #1a0a20 0%, #2c1810 50%, #3d2b1f 100%)' },
  { id: 'gradient-ocean', name: 'تدرج المحيط', color: '#0a192f', textColor: '#ffffff', isGradient: true, gradient: 'linear-gradient(135deg, #0a192f 0%, #0d3b4c 50%, #1a5c6c 100%)' },
  { id: 'gradient-aurora', name: 'تدرج الشفق', color: '#0f0f1a', textColor: '#ffffff', isGradient: true, gradient: 'linear-gradient(135deg, #1a1040 0%, #0f3040 50%, #0a4030 100%)' },
  { id: 'gradient-fire', name: 'تدرج النار', color: '#1a0a0a', textColor: '#ffffff', isGradient: true, gradient: 'linear-gradient(135deg, #1a0a0a 0%, #3d1a0a 50%, #5c2a0a 100%)' },
  { id: 'gradient-galaxy', name: 'تدرج المجرة', color: '#0a0a1f', textColor: '#ffffff', isGradient: true, gradient: 'linear-gradient(135deg, #0a0a1f 0%, #1a0a3f 50%, #2a0a4f 100%)' },
  
  // Custom image placeholder
  { id: 'custom-image', name: 'صورة مخصصة', color: '#1a1a1a', textColor: '#ffffff' },
];

// Scene Effects - 25 تأثيرات متنوعة
export const sceneEffects: SceneEffectInfo[] = [
  // Original effects
  { id: 'shooting-stars', name: 'نيازك', icon: 'Sparkle' },
  { id: 'twinkle', name: 'نقاط متلألئة', icon: 'Stars' },
  { id: 'bubbles', name: 'فقاعات', icon: 'Circle' },
  { id: 'dust', name: 'غبار', icon: 'CloudFog' },
  { id: 'waves', name: 'موجات', icon: 'Waves' },
  { id: 'spinning-stars', name: 'نجوم دوارة', icon: 'Star' },
  { id: 'snow', name: 'ثلج', icon: 'Snowflake' },
  { id: 'orbs', name: 'هالة متوهجة', icon: 'Sun' },
  { id: 'rings', name: 'حلقات', icon: 'CircleDot' },
  { id: 'lines', name: 'خطوط', icon: 'GripVertical' },
  
  // New effects
  { id: 'particles', name: 'جزيئات', icon: 'Atom' },
  { id: 'fireflies', name: 'يراعات', icon: 'Lightbulb' },
  { id: 'aurora', name: 'شفق قطبي', icon: 'Aurora' },
  { id: 'galaxy', name: 'مجرة', icon: 'Orbit' },
  { id: 'matrix', name: 'ماتريكس', icon: 'Binary' },
  { id: 'heartbeat', name: 'نبض', icon: 'Heart' },
  { id: 'confetti', name: 'قصاصات', icon: 'PartyPopper' },
  { id: 'rain', name: 'مطر', icon: 'CloudRain' },
  { id: 'leaves', name: 'أوراق', icon: 'Leaf' },
  { id: 'geometric', name: 'أشكال هندسية', icon: 'Shapes' },
  { id: 'laser', name: 'ليزر', icon: 'Zap' },
  { id: 'prism', name: 'موشور', icon: 'Triangle' },
  { id: 'energy', name: 'طاقة', icon: 'Activity' },
  { id: 'smoke', name: 'دخان', icon: 'Cloud' },
  { id: 'sparkle-trail', name: 'أثر لامع', icon: 'Wand2' },
  
  { id: 'none', name: 'بدون', icon: 'X' },
];

// Animation Types
export const animationTypes = [
  { id: 'fade', name: 'تلاشي' },
  { id: 'slide-right', name: 'انزلاق يمين' },
  { id: 'slide-up', name: 'انزلاق أعلى' },
  { id: 'zoom', name: 'تكبير' },
  { id: 'rotate', name: 'دوران' },
  { id: 'flip', name: 'قلب' },
];
