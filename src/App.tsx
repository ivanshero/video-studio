import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAppStore } from './stores/useAppStore';
import { ControlPanel } from './components/ControlPanel/ControlPanel';
import { PresentationArea } from './components/PresentationArea/PresentationArea';
import { AvatarDisplay } from './components/AvatarDisplay/AvatarDisplay';
import './App.css';

function App() {
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

  // Keyboard shortcuts
  useEffect(() => {
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
  }, [nextSection, prevSection, setAutoScrolling, isAutoScrolling]);

  return (
    <div className="app" data-theme={theme} data-background={background}>
      <ControlPanel />
      <PresentationArea />
      
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
