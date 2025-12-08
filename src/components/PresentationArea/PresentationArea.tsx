import { useAppStore } from '../../stores/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { SceneEffects } from '../SceneEffects/SceneEffects';
import { IslamicFrame } from '../IslamicFrame/IslamicFrame';
import { WelcomeScreen } from '../WelcomeScreen/WelcomeScreen';
import { SectionDisplay } from '../SectionDisplay/SectionDisplay';
import { backgrounds } from '../../utils/constants';
import './PresentationArea.css';

export function PresentationArea() {
  const { 
    sections, 
    currentSectionIndex, 
    background, 
    customBackgroundImage,
    sceneEffect,
    animationType,
    animationSpeed 
  } = useAppStore();

  const currentSection = sections[currentSectionIndex];
  const currentBg = backgrounds.find(b => b.id === background);

  // Build background style
  const getBackgroundStyle = () => {
    if (background === 'custom-image' && customBackgroundImage) {
      return {
        backgroundImage: `url(${customBackgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    if (currentBg?.isGradient && currentBg.gradient) {
      return {
        background: currentBg.gradient,
      };
    }
    return {
      backgroundColor: currentBg?.color || '#0a0a0f',
    };
  };

  const getAnimationVariants = () => {
    const duration = animationSpeed;
    
    switch (animationType) {
      case 'slide-right':
        return {
          initial: { x: 100, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: -100, opacity: 0 },
          transition: { duration }
        };
      case 'slide-up':
        return {
          initial: { y: 100, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: -100, opacity: 0 },
          transition: { duration }
        };
      case 'zoom':
        return {
          initial: { scale: 0.5, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 1.5, opacity: 0 },
          transition: { duration }
        };
      case 'rotate':
        return {
          initial: { rotate: -10, opacity: 0 },
          animate: { rotate: 0, opacity: 1 },
          exit: { rotate: 10, opacity: 0 },
          transition: { duration }
        };
      case 'flip':
        return {
          initial: { rotateY: 90, opacity: 0 },
          animate: { rotateY: 0, opacity: 1 },
          exit: { rotateY: -90, opacity: 0 },
          transition: { duration }
        };
      case 'fade':
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration }
        };
    }
  };

  const variants = getAnimationVariants();
  const bgStyle = getBackgroundStyle();

  return (
    <main 
      className="presentation-area" 
      data-background={background}
      data-effect={sceneEffect}
      style={bgStyle}
    >
      {/* Scene Effects Background */}
      <SceneEffects effect={sceneEffect} />
      
      {/* Islamic Frame */}
      <IslamicFrame />
      
      {/* Content Area */}
      <div className="content-wrapper">
        <AnimatePresence mode="wait">
          {!currentSection ? (
            <motion.div
              key="welcome"
              {...variants}
            >
              <WelcomeScreen />
            </motion.div>
          ) : (
            <motion.div
              key={currentSection.id}
              {...variants}
            >
              <SectionDisplay section={currentSection} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress Bar */}
      {sections.length > 0 && (
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${((currentSectionIndex + 1) / sections.length) * 100}%` 
            }}
          />
        </div>
      )}
    </main>
  );
}
