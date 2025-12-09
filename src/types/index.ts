// أنواع البيانات الرئيسية

export type MediaType = 'none' | 'image' | 'video' | 'audio' | 'link' | 'pdf';

export interface Section {
  id: string;
  title: string;
  content: string;
  mediaType: MediaType;
  mediaUrl: string | null;
  mediaName: string | null;
  linkUrl: string | null;
}

export type ThemeType = 'gold' | 'emerald' | 'royal' | 'sunset' | 'purple' | 'teal';

export type FrameType = 
  | 'classic' | 'ornate' | 'geometric' | 'arabesque' 
  | 'minimal' | 'royal' | 'stars' | 'crescent' 
  | 'calligraphy' | 'mosaic' | 'dome' | 'none';

export type BackgroundType = 
  | 'dark-night' | 'cream' | 'ocean' | 'forest' | 'purple'
  | 'warm-sunset' | 'light-sky' | 'rose' | 'midnight' | 'earthy'
  | 'navy' | 'charcoal' | 'wine' | 'olive' | 'slate'
  | 'coral' | 'lavender' | 'mint' | 'peach' | 'indigo'
  | 'gradient-sunset' | 'gradient-ocean' | 'gradient-aurora' | 'gradient-fire' | 'gradient-galaxy'
  | 'custom-image';

export type SceneEffectType = 
  | 'shooting-stars' | 'twinkle' | 'bubbles' | 'dust' | 'waves'
  | 'spinning-stars' | 'snow' | 'orbs' | 'rings' | 'lines'
  | 'particles' | 'fireflies' | 'aurora' | 'galaxy' | 'matrix'
  | 'heartbeat' | 'confetti' | 'rain' | 'leaves' | 'geometric'
  | 'laser' | 'prism' | 'energy' | 'smoke' | 'sparkle-trail'
  | 'none';

export type AnimationType = 
  | 'fade' | 'slide-right' | 'slide-up' | 'zoom' 
  | 'rotate' | 'flip';

export interface AppState {
  // Sections
  sections: Section[];
  currentSectionIndex: number;
  
  // Settings
  theme: ThemeType;
  frame: FrameType;
  background: BackgroundType;
  sceneEffect: SceneEffectType;
  animationType: AnimationType;
  animationSpeed: number;
  
  // UI State
  isAutoScrolling: boolean;
  isExpandedSectionsOpen: boolean;
}

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  accent: string;
  shadow: string;
}

export interface FrameInfo {
  id: FrameType;
  name: string;
  icon: string;
}

export interface BackgroundInfo {
  id: BackgroundType;
  name: string;
  color: string;
  textColor: string;
  gradient?: string;
  isGradient?: boolean;
}

export interface SceneEffectInfo {
  id: SceneEffectType;
  name: string;
  icon: string;
}
