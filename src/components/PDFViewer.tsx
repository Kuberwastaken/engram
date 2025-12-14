import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Loader2, X, ArrowLeft, Download, Eye, ExternalLink } from 'lucide-react';
import { GoogleDriveFile } from '@/services/unifiedDataService';
import { unifiedDataService } from '@/services/unifiedDataService';
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
  const fileName = unifiedDataService.getFileName(file);
  const fileId = unifiedDataService.getFileId(file);

  // Determine if we can show a preview or at least open it
  const canPreview = showPreview && fileId;
  const canOpenExternal = !canPreview && (file.webViewUrl || fileId);

  // SVG Icons
  // SVG Icons


  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: `Downloading ${fileName}...`,
    });
    window.open(unifiedDataService.getDownloadUrl(file), '_blank');
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
      const viewUrl = unifiedDataService.getViewUrl(fileId);
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
            </button>

            {/* Desktop: Show full path */}
            <div className="hidden md:block text-sm text-gray-300">
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

            {/* Mobile: Show only file name */}
            <div className="md:hidden text-sm text-gray-300">
              <span className="text-white font-medium">{fileName}</span>
            </div>
          </div>

          {/* Right side - Simple controls */}
          <div className="flex items-center space-x-3 relative z-10">
            {/* Desktop: Show download button with text */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              className="hidden md:flex px-3 py-1 bg-gray-800/50 hover:bg-gray-700/70 border border-gray-600/50 rounded text-gray-300 text-sm transition-colors"
            >
              Download
            </button>

            {/* Mobile: Show download button as icon only */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              className="md:hidden p-1.5 rounded bg-gray-900/50 hover:bg-gray-800/70 transition-colors border border-gray-700/50"
              title="Download PDF"
            >
              <Download className="w-4 h-4 text-gray-300" />
            </button>

            <div className="hidden md:block text-xs text-gray-400">
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
                        window.open(unifiedDataService.getViewUrl(fileId), '_blank');
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
              src={file.previewUrl || unifiedDataService.getEmbedUrl(fileId)}
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
        className={`bg-gray-900/20 border-gray-800/30 backdrop-blur-sm hover:bg-gray-800/40 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer group flex flex-col h-full ${className}`}
        onClick={handleCardClick}
      >
        <CardContent className="p-5 flex-1 flex flex-col justify-between">
          <div className="mb-4">
            <h4 className="text-gray-200 font-mono font-semibold text-lg leading-relaxed break-words group-hover:text-blue-200 transition-colors">
              {fileName}
            </h4>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-800/50 mt-auto">
            <div className="flex items-center">

              {showSourceTag && file.source && (
                <span className="text-[10px] text-blue-300/70 px-2 py-0.5 bg-blue-500/5 rounded-full border border-blue-500/10">
                  {file.source}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              {canPreview ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-md transition-all"
                  onClick={handleOpenInDrive}
                  title="Preview"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              ) : canOpenExternal ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-md transition-all"
                  onClick={handleOpenInDrive}
                  title="Open Externally"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              ) : null}

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-500 hover:text-green-400 hover:bg-green-500/10 rounded-md transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload();
                }}
                title="Download"
              >
                <Download className="w-4 h-4" />
              </Button>
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
