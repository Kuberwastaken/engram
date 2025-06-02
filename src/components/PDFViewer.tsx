import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Loader2, X, ArrowLeft } from 'lucide-react';
import { GoogleDriveFile } from '@/services/unifiedDataService';
import { studyXDataService } from '@/services/studyXDataService';
import { toast } from '@/hooks/use-toast';
import { formatSubjectName } from '@/lib/utils';

interface PDFViewerProps {
  file: GoogleDriveFile;
  showPreview?: boolean;
  className?: string;
  subjectName?: string;
  materialType?: string;
  showSourceTag?: boolean;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ file, showPreview = true, className = "", subjectName = "", materialType = "", showSourceTag = false }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [embedError, setEmbedError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Get file info using the service helper methods
  const fileName = studyXDataService.getFileName(file);
  const fileId = studyXDataService.getFileId(file);

  // SVG Icons
  const DownloadIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  const EyeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: `Downloading ${fileName}...`,
    });
    window.open(studyXDataService.getDownloadUrl(file), '_blank');
  };
  const handleOpenFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFullscreen(true);
    setIsLoading(true);
  };

  const handleCloseFullscreen = () => {
    setIsFullscreen(false);
    setIsLoading(false);
    setEmbedError(false);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    console.log('Card clicked! Opening fullscreen PDF reader for:', fileName);
    // Open fullscreen PDF reader when clicking on the card
    setIsFullscreen(true);
    setIsLoading(true);
  };

  const handleOpenInDrive = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Eye icon clicked! Opening Google Drive preview for:', fileName);
    
    // Open Google Drive preview in new tab
    if (file.webViewUrl) {
      console.log('Opening webViewUrl:', file.webViewUrl);
      window.open(file.webViewUrl, '_blank');
    } else if (fileId) {
      const viewUrl = studyXDataService.getViewUrl(fileId);
      console.log('Opening viewUrl:', viewUrl);
      window.open(viewUrl, '_blank');
    } else {
      console.log('No view URL available');
      toast({
        title: "Preview Unavailable",
        description: "Cannot open preview for this file.",
        variant: "destructive"
      });
    }
  };

  const handleEmbedLoad = () => {
    setIsLoading(false);
    setEmbedError(false);
  };

  const handleEmbedError = () => {
    setIsLoading(false);
    setEmbedError(true);
  };  // Full-screen PDF reader component
  const FullscreenPDFReader = () => {
    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleCloseFullscreen();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      // Add class to body to prevent scrolling
      document.body.classList.add('pdf-fullscreen-open');
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.classList.remove('pdf-fullscreen-open');
      };
    }, []);

    return (
      <div 
        className="fixed inset-0 w-screen h-screen bg-black flex flex-col overflow-hidden"
        style={{ 
          zIndex: 999999,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh'
        }}
      >
        {/* Minimal black top bar with subtle stars */}
        <div className="relative flex items-center justify-between px-6 py-2 bg-black border-b border-gray-800/30 h-12 flex-shrink-0">
          {/* Subtle stars background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-2 left-10 w-1 h-1 bg-white/30 rounded-full animate-pulse"></div>
            <div className="absolute top-4 right-20 w-0.5 h-0.5 bg-white/20 rounded-full"></div>
            <div className="absolute top-3 left-1/4 w-0.5 h-0.5 bg-white/25 rounded-full animate-pulse"></div>
            <div className="absolute top-5 right-1/3 w-1 h-1 bg-white/15 rounded-full"></div>
            <div className="absolute top-2 left-3/4 w-0.5 h-0.5 bg-white/35 rounded-full animate-pulse"></div>
            <div className="absolute top-6 left-1/2 w-0.5 h-0.5 bg-white/20 rounded-full"></div>
          </div>
          
          {/* Left side - Back button and path */}
          <div className="flex items-center space-x-4 relative z-10">
            <button
              onClick={handleCloseFullscreen}
              className="p-1.5 rounded bg-gray-900/50 hover:bg-gray-800/70 transition-colors border border-gray-700/50"
            >
              <ArrowLeft className="w-4 h-4 text-gray-300" />
            </button>            <div className="text-sm text-gray-300">
              <span className="opacity-60">{formatSubjectName(subjectName)}</span>
              {materialType && (
                <>
                  <span className="mx-2 opacity-40">/</span>
                  <span className="opacity-60">{materialType.toUpperCase()}</span>
                </>
              )}
              <span className="mx-2 opacity-40">/</span>
              <span className="text-white font-medium">{fileName}</span>
            </div>
          </div>

          {/* Right side - Simple controls */}
          <div className="flex items-center space-x-3 relative z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              className="px-3 py-1 bg-gray-800/50 hover:bg-gray-700/70 border border-gray-600/50 rounded text-gray-300 text-sm transition-colors"
            >
              Download
            </button>            <div className="text-xs text-gray-400">
              {showSourceTag && file.source ? `By ${file.source}` : 'Press ESC to close'}
            </div>
          </div>
        </div>        {/* PDF content area - maximized for readability */}
        <div className="flex-1 relative w-full h-full overflow-hidden bg-black">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-20">
              <div className="text-center">
                <Loader2 className="w-16 h-16 animate-spin text-purple-400 mx-auto mb-6" />
                <p className="text-purple-200 text-xl">Loading PDF...</p>
                <div className="mt-3 text-purple-300/70">Press ESC to close</div>
              </div>
            </div>
          )}
          
          {embedError ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-24 h-24 text-purple-400 mx-auto mb-8" />
                <h3 className="text-3xl font-medium text-purple-200 mb-6">
                  Unable to preview this PDF
                </h3>
                <p className="text-purple-300/70 mb-8 max-w-lg text-lg">
                  This file cannot be embedded in the viewer. You can download it or open it in a new tab.
                </p>
                <div className="flex gap-6 justify-center">
                  <button
                    onClick={handleDownload}
                    className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-lg"
                  >
                    Download PDF
                  </button>
                  <button
                    onClick={() => {
                      if (file.webViewUrl) {
                        window.open(file.webViewUrl, '_blank');
                      } else if (fileId) {
                        window.open(studyXDataService.getViewUrl(fileId), '_blank');
                      }
                    }}
                    className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-purple-200 rounded-lg transition-colors text-lg"
                  >
                    Open in New Tab
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <iframe
              src={file.previewUrl || studyXDataService.getEmbedUrl(fileId)}
              className="w-full h-full border-0 block"
              onLoad={handleEmbedLoad}
              onError={handleEmbedError}
              title={fileName}
              style={{ 
                backgroundColor: '#000',
                minHeight: '100%',
                width: '100%',
                height: '100%',
                display: 'block',
                border: 'none',
                margin: 0,
                padding: 0
              }}
              allowFullScreen
              frameBorder="0"
            />
          )}
        </div>
      </div>
    );
  };
  return (
    <>
      <Card 
        className={`bg-gray-900/20 border-gray-800/30 hover:bg-gray-800/40 hover:border-gray-600/50 transition-all duration-200 cursor-pointer group ${className}`}
        onClick={handleCardClick}
        title="Click to open in fullscreen PDF reader"
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <FileText className="w-4 h-4 text-blue-400 mr-2" />
                <h4 className="text-gray-300 font-medium group-hover:text-white transition-colors">{fileName}</h4>
              </div>              <p className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors">
                PDF Document • Click to open fullscreen reader
                {showSourceTag && file.source && (
                  <span className="ml-2 px-2 py-0.5 bg-gray-700/50 text-gray-300 text-xs rounded border border-gray-600/30">
                    {file.source}
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-3 ml-4" onClick={(e) => e.stopPropagation()}>
              {showPreview && fileId && (
                <div onClick={handleOpenInDrive} title="Open in Google Drive">
                  <EyeIcon />
                </div>
              )}
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload();
                }}
                title="Download PDF"
              >
                <DownloadIcon />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fullscreen PDF Reader - Rendered using Portal for proper layering */}
      {isFullscreen && createPortal(<FullscreenPDFReader />, document.body)}
    </>
  );
};

export default PDFViewer;
