import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAppStore } from './stores/useAppStore';
import { ModeSelection } from './components/ModeSelection/ModeSelection';
import { CameraStudio } from './components/CameraStudio/CameraStudio';
import { MobileView } from './components/MobileView/MobileView';
import { TelegramDesigner } from './components/TelegramDesigner/TelegramDesigner';
import { ControlPanel } from './components/ControlPanel/ControlPanel';
import { PresentationArea } from './components/PresentationArea/PresentationArea';
import { AvatarDisplay } from './components/AvatarDisplay/AvatarDisplay';
import { ExpandedSections } from './components/ExpandedSections/ExpandedSections';
import './App.css';

type AppMode = 'selection' | 'camera' | 'presentation' | 'mobile' | 'telegram';

function App() {
  const [mode, setMode] = useState<AppMode>('selection');
  const [expandedOpen, setExpandedOpen] = useState(false);
  
  const { 
    theme, 
    background,
    nextSection, 
    prevSection,
    setAutoScrolling,
    isAutoScrolling,
    isAvatarVisible,
    setAvatarVisible,
  } = useAppStore();

  const handleModeSelect = (selectedMode: 'camera' | 'presentation' | 'mobile' | 'telegram') => {
    setMode(selectedMode);
  };

  // Keyboard shortcuts (only for presentation mode)
  useEffect(() => {
    if (mode !== 'presentation') return;
    
    let scrollInterval: number | null = null;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'arrowright':
          e.preventDefault();
          nextSection();
          break;
        case 'arrowleft':
          e.preventDefault();
          prevSection();
          break;
        case 'f':
          e.preventDefault();
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
          } else {
            document.exitFullscreen();
          }
          break;
        case 's':
          if (!isAutoScrolling) {
            setAutoScrolling(true);
            scrollInterval = window.setInterval(() => {
              nextSection();
            }, 3000);
          }
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 's' && scrollInterval) {
        setAutoScrolling(false);
        clearInterval(scrollInterval);
        scrollInterval = null;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (scrollInterval) clearInterval(scrollInterval);
    };
  }, [mode, nextSection, prevSection, setAutoScrolling, isAutoScrolling]);

  // Mode Selection Screen
  if (mode === 'selection') {
    return <ModeSelection onSelectMode={handleModeSelect} />;
  }

  // Camera Mode
  if (mode === 'camera') {
    return <CameraStudio onBack={() => setMode('selection')} />;
  }

  // Mobile Mode
  if (mode === 'mobile') {
    return <MobileView onBack={() => setMode('selection')} />;
  }

  // Telegram Designer Mode
  if (mode === 'telegram') {
    return <TelegramDesigner onBack={() => setMode('selection')} />;
  }

  // Presentation Mode (without camera)
  return (
    <div className="app" data-theme={theme} data-background={background}>
      <ControlPanel onExpandedClick={() => setExpandedOpen(true)} />
      <PresentationArea />
      
      {/* Expanded Sections Modal */}
      <ExpandedSections 
        isOpen={expandedOpen} 
        onClose={() => setExpandedOpen(false)} 
      />
      
      {/* Avatar Display */}
      <AnimatePresence>
        {isAvatarVisible && (
          <AvatarDisplay 
            isVisible={isAvatarVisible} 
            onClose={() => setAvatarVisible(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
