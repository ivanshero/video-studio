import type { Section } from '../../types';
import { useState, useEffect } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import './SectionDisplay.css';

interface SectionDisplayProps {
  section: Section;
}

export function SectionDisplay({ section }: SectionDisplayProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPdfExpanded, setIsPdfExpanded] = useState(false);

  // Load article content for link type
  useEffect(() => {
    if (section.mediaType === 'link' && section.linkUrl) {
      setIsLoading(true);
      // For demo purposes - in production, use a proxy server
      setIsLoading(false);
    }
  }, [section.linkUrl, section.mediaType]);

  const renderMedia = () => {
    switch (section.mediaType) {
      case 'image':
        return section.mediaUrl && (
          <div className="section-media">
            <img src={section.mediaUrl} alt={section.title} />
          </div>
        );

      case 'video':
        return section.mediaUrl && (
          <div className="section-media video">
            <video controls autoPlay muted>
              <source src={section.mediaUrl} />
            </video>
          </div>
        );

      case 'audio':
        return section.mediaUrl && (
          <div className="section-audio">
            <div className="audio-visualizer">
              <span>🎵</span>
              <span className="audio-title">{section.mediaName || 'ملف صوتي'}</span>
            </div>
            <audio controls autoPlay>
              <source src={section.mediaUrl} />
            </audio>
          </div>
        );

      case 'link':
        return section.linkUrl && (
          <div className="section-link">
            {isLoading ? (
              <div className="loading-spinner">جاري التحميل...</div>
            ) : (
              <div className="link-preview">
                <a href={section.linkUrl} target="_blank" rel="noopener noreferrer">
                  🔗 {section.linkUrl}
                </a>
              </div>
            )}
          </div>
        );

      case 'pdf':
        return section.mediaUrl && (
          <div className={`section-pdf ${isPdfExpanded ? 'expanded' : ''}`}>
            <div className="pdf-header">
              <span className="pdf-icon">📄</span>
              <span className="pdf-name">{section.mediaName || 'ملف PDF'}</span>
              <button 
                className="pdf-expand-btn"
                onClick={() => setIsPdfExpanded(!isPdfExpanded)}
                title={isPdfExpanded ? 'تصغير' : 'تكبير'}
              >
                {isPdfExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
            </div>
            <iframe 
              src={`${section.mediaUrl}#toolbar=1&navpanes=0&scrollbar=1`}
              className="pdf-viewer"
              title="PDF Viewer"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`section-display media-${section.mediaType}`}>
      {/* Title */}
      {section.title && (
        <h2 className="section-title">{section.title}</h2>
      )}

      {/* Media Content */}
      {renderMedia()}

      {/* Text Content */}
      {section.content && (
        <div className="section-content">
          <p>{section.content}</p>
        </div>
      )}
    </div>
  );
}
