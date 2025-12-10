import type { Section } from '../../types';
import { useState, useEffect, useRef } from 'react';
import { Maximize2, Minimize2, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import './SectionDisplay.css';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Store PDF pages globally to persist between section switches
const pdfPageCache: Record<string, number> = {};

interface SectionDisplayProps {
  section: Section;
}

export function SectionDisplay({ section }: SectionDisplayProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPdfExpanded, setIsPdfExpanded] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pdfScale, setPdfScale] = useState(1.0);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  
  // Get cached page or default to 1
  const [currentPage, setCurrentPage] = useState(() => {
    return section.id && pdfPageCache[section.id] ? pdfPageCache[section.id] : 1;
  });

  // Load article content for link type
  useEffect(() => {
    if (section.mediaType === 'link' && section.linkUrl) {
      setIsLoading(true);
      setIsLoading(false);
    }
  }, [section.linkUrl, section.mediaType]);

  // Load cached page when section changes
  useEffect(() => {
    if (section.mediaType === 'pdf' && section.id) {
      const cachedPage = pdfPageCache[section.id];
      if (cachedPage) {
        setCurrentPage(cachedPage);
      }
    }
  }, [section.id, section.mediaType]);

  // Save current page to cache
  useEffect(() => {
    if (section.id && section.mediaType === 'pdf') {
      pdfPageCache[section.id] = currentPage;
    }
  }, [currentPage, section.id, section.mediaType]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  // Handle scroll to change pages
  const handlePdfScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;
    
    // Check if scrolled to bottom - go to next page
    if (scrollTop + clientHeight >= scrollHeight - 10 && numPages && currentPage < numPages) {
      setCurrentPage(p => p + 1);
      container.scrollTop = 0;
    }
    // Check if scrolled to top - go to previous page
    else if (scrollTop <= 10 && currentPage > 1) {
      setCurrentPage(p => p - 1);
      container.scrollTop = scrollHeight - clientHeight;
    }
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
                {/* Zoom Controls */}
                <div className="pdf-zoom">
                  <button 
                    onClick={() => setPdfScale(s => Math.max(0.5, s - 0.1))}
                    disabled={pdfScale <= 0.5}
                    title="تصغير"
                  >
                    <ZoomOut size={16} />
                  </button>
                  <span>{Math.round(pdfScale * 100)}%</span>
                  <button 
                    onClick={() => setPdfScale(s => Math.min(2, s + 0.1))}
                    disabled={pdfScale >= 2}
                    title="تكبير"
                  >
                    <ZoomIn size={16} />
                  </button>
                </div>
                
                {/* Page Navigation */}
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
                
                {/* Expand Button */}
                <button 
                  className="pdf-expand-btn"
                  onClick={() => setIsPdfExpanded(!isPdfExpanded)}
                  title={isPdfExpanded ? 'تصغير' : 'تكبير'}
                >
                  {isPdfExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
              </div>
            </div>
            <div 
              className="pdf-viewer-container"
              ref={pdfContainerRef}
              onScroll={handlePdfScroll}
            >
              <Document
                file={section.mediaUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<div className="pdf-loading">جاري تحميل PDF...</div>}
                error={<div className="pdf-error">فشل في تحميل الملف</div>}
              >
                <Page 
                  pageNumber={currentPage} 
                  scale={pdfScale}
                  width={isPdfExpanded ? 700 : 450}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
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
