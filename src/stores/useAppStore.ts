import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  Section, 
  ThemeType, 
  FrameType, 
  BackgroundType, 
  SceneEffectType, 
  AnimationType 
} from '../types';

interface AppStore {
  // Sections
  sections: Section[];
  currentSectionIndex: number;
  addSection: (section: Omit<Section, 'id'>) => void;
  updateSection: (id: string, updates: Partial<Section>) => void;
  deleteSection: (id: string) => void;
  reorderSections: (fromIndex: number, toIndex: number) => void;
  setCurrentSection: (index: number) => void;
  nextSection: () => void;
  prevSection: () => void;
  clearSections: () => void;
  
  // Theme & Appearance
  theme: ThemeType;
  frame: FrameType;
  background: BackgroundType;
  sceneEffect: SceneEffectType;
  customBackgroundImage: string | null;
  setTheme: (theme: ThemeType) => void;
  setFrame: (frame: FrameType) => void;
  setBackground: (background: BackgroundType) => void;
  setSceneEffect: (effect: SceneEffectType) => void;
  setCustomBackgroundImage: (image: string | null) => void;
  
  // Animation
  animationType: AnimationType;
  animationSpeed: number;
  setAnimationType: (type: AnimationType) => void;
  setAnimationSpeed: (speed: number) => void;
  
  // UI State
  isAutoScrolling: boolean;
  isExpandedSectionsOpen: boolean;
  isAvatarVisible: boolean;
  setAutoScrolling: (value: boolean) => void;
  setExpandedSectionsOpen: (value: boolean) => void;
  setAvatarVisible: (value: boolean) => void;
}

const generateId = () => `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial State
      sections: [],
      currentSectionIndex: -1,
      theme: 'gold',
      frame: 'classic',
      background: 'dark-night',
      sceneEffect: 'none',
      customBackgroundImage: null,
      animationType: 'fade',
      animationSpeed: 0.8,
      isAutoScrolling: false,
      isExpandedSectionsOpen: false,
      isAvatarVisible: false,
      
      // Section Actions
      addSection: (sectionData) => {
        const newSection: Section = {
          ...sectionData,
          id: generateId(),
        };
        set((state) => ({
          sections: [...state.sections, newSection],
          currentSectionIndex: state.sections.length,
        }));
      },
      
      updateSection: (id, updates) => {
        set((state) => ({
          sections: state.sections.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        }));
      },
      
      deleteSection: (id) => {
        set((state) => {
          const newSections = state.sections.filter((s) => s.id !== id);
          let newIndex = state.currentSectionIndex;
          
          if (newSections.length === 0) {
            newIndex = -1;
          } else if (state.currentSectionIndex >= newSections.length) {
            newIndex = newSections.length - 1;
          }
          
          return {
            sections: newSections,
            currentSectionIndex: newIndex,
          };
        });
      },
      
      reorderSections: (fromIndex, toIndex) => {
        set((state) => {
          const newSections = [...state.sections];
          const [removed] = newSections.splice(fromIndex, 1);
          newSections.splice(toIndex, 0, removed);
          return { sections: newSections };
        });
      },
      
      setCurrentSection: (index) => {
        const { sections } = get();
        if (index >= -1 && index < sections.length) {
          set({ currentSectionIndex: index });
        }
      },
      
      nextSection: () => {
        const { sections, currentSectionIndex } = get();
        if (currentSectionIndex < sections.length - 1) {
          set({ currentSectionIndex: currentSectionIndex + 1 });
        }
      },
      
      prevSection: () => {
        const { currentSectionIndex } = get();
        if (currentSectionIndex > 0) {
          set({ currentSectionIndex: currentSectionIndex - 1 });
        }
      },
      
      clearSections: () => {
        set({ sections: [], currentSectionIndex: -1 });
      },
      
      // Theme Actions
      setTheme: (theme) => set({ theme }),
      setFrame: (frame) => set({ frame }),
      setBackground: (background) => set({ background }),
      setSceneEffect: (sceneEffect) => set({ sceneEffect }),
      setCustomBackgroundImage: (customBackgroundImage) => set({ customBackgroundImage }),
      
      // Animation Actions
      setAnimationType: (animationType) => set({ animationType }),
      setAnimationSpeed: (animationSpeed) => set({ animationSpeed }),
      
      // UI Actions
      setAutoScrolling: (isAutoScrolling) => set({ isAutoScrolling }),
      setExpandedSectionsOpen: (isExpandedSectionsOpen) => set({ isExpandedSectionsOpen }),
      setAvatarVisible: (isAvatarVisible) => set({ isAvatarVisible }),
    }),
    {
      name: 'islamic-video-studio',
      partialize: (state) => ({
        sections: state.sections.map(s => ({
          ...s,
          mediaUrl: null, // لا يمكن حفظ blob URLs
        })),
        currentSectionIndex: state.currentSectionIndex,
        theme: state.theme,
        frame: state.frame,
        background: state.background,
        sceneEffect: state.sceneEffect,
        animationType: state.animationType,
        animationSpeed: state.animationSpeed,
      }),
    }
  )
);
