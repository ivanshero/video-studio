import { useState } from 'react';
import { ModeSelection } from './components/ModeSelection/ModeSelection';
import { CameraStudio } from './components/CameraStudio/CameraStudio';
import { MobileView } from './components/MobileView/MobileView';
import { TelegramDesigner } from './components/TelegramDesigner/TelegramDesigner';
import { PresentationMode } from './components/PresentationMode/PresentationMode';
import './App.css';

type AppMode = 'selection' | 'camera' | 'presentation' | 'mobile' | 'telegram';

function App() {
  const [mode, setMode] = useState<AppMode>('selection');

  const handleModeSelect = (selectedMode: 'camera' | 'presentation' | 'mobile' | 'telegram') => {
    setMode(selectedMode);
  };

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
  return <PresentationMode onBack={() => setMode('selection')} />;
}

export default App;
