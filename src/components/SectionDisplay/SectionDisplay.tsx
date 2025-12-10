import type { Section } from '../../types';
import { useState, useEffect } from 'react';
import { Maximize2, Minimize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import './SectionDisplay.css';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface SectionDisplayProps {
  section: Section;
}

export function SectionDisplay({ section }: SectionDisplayProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPdfExpanded, setIsPdfExpanded] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Load article content for link type
  useEffect(() => {
    if (section.mediaType === 'link' && section.linkUrl) {
      setIsLoading(true);
      // For demo purposes - in production, use a proxy server
      setIsLoading(false);
    }
  }, [section.linkUrl, section.mediaType]);

  // Reset page when section changes
  useEffect(() => {
    setCurrentPage(1);
    setNumPages(null);
  }, [section.id]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

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
              <div className="pdf-controls">
                {numPages && numPages > 1 && (
                  <div className="pdf-nav">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage <= 1}
                    >
                      <ChevronRight size={16} />
                    </button>
                    <span>{currentPage} / {numPages}</span>
                    <button 
                      onClick={() => setCurrentPage(p => Math.min(numPages, p + 1))}
                      disabled={currentPage >= numPages}
                    >
                      <ChevronLeft size={16} />
                    </button>
                  </div>
                )}
                <button 
                  className="pdf-expand-btn"
                  onClick={() => setIsPdfExpanded(!isPdfExpanded)}
                  title={isPdfExpanded ? 'تصغير' : 'تكبير'}
                >
                  {isPdfExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
              </div>
            </div>
            <div className="pdf-viewer-container">
              <Document
                file={section.mediaUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<div className="pdf-loading">جاري تحميل PDF...</div>}
                error={<div className="pdf-error">فشل في تحميل الملف</div>}
              >
                <Page 
                  pageNumber={currentPage} 
                  width={isPdfExpanded ? 800 : 500}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                />
              </Document>
            </div>
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
