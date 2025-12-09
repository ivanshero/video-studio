import { useAppStore } from '../../stores/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import './ExpandedSections.css';

interface ExpandedSectionsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExpandedSections({ isOpen, onClose }: ExpandedSectionsProps) {
  const {
    sections,
    currentSectionIndex,
    setCurrentSection,
    deleteSection,
    reorderSections,
  } = useAppStore();

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      reorderSections(index, index - 1);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < sections.length - 1) {
      reorderSections(index, index + 1);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="expanded-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="expanded-modal"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="expanded-header">
              <h2>جميع الأقسام ({sections.length})</h2>
              <button onClick={onClose} className="close-btn">
                <X size={24} />
              </button>
            </div>

            <div className="expanded-list">
              {sections.length === 0 ? (
                <div className="empty-state">
                  <p>لا توجد أقسام بعد. أضف قسم جديد لتبدأ!</p>
                </div>
              ) : (
                sections.map((section, index) => (
                  <motion.div
                    key={section.id}
                    className={`section-item ${
                      currentSectionIndex === index ? 'active' : ''
                    }`}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="section-number">{index + 1}</div>

                    <div
                      className="section-content"
                      onClick={() => {
                        setCurrentSection(index);
                        onClose();
                      }}
                    >
                      <h3>{section.title || `القسم ${index + 1}`}</h3>
                      <p>
                        {section.content.substring(0, 60)}
                        {section.content.length > 60 ? '...' : ''}
                      </p>
                      {section.mediaType !== 'none' && (
                        <span className="media-badge">
                          {section.mediaType === 'image' && '📷'}
                          {section.mediaType === 'video' && '🎥'}
                          {section.mediaType === 'audio' && '🎵'}
                          {section.mediaType === 'link' && '🔗'}
                          {section.mediaType === 'pdf' && '📄'}
                          {' '}
                          {section.mediaName || section.mediaType}
                        </span>
                      )}
                    </div>

                    <div className="section-actions">
                      <button
                        className="action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveUp(index);
                        }}
                        disabled={index === 0}
                        title="نقل للأعلى"
                      >
                        <ChevronUp size={18} />
                      </button>
                      <button
                        className="action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveDown(index);
                        }}
                        disabled={index === sections.length - 1}
                        title="نقل للأسفل"
                      >
                        <ChevronDown size={18} />
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSection(section.id);
                        }}
                        title="حذف"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
