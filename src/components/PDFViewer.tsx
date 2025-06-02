import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Loader2 } from 'lucide-react';
import { GoogleDriveFile, studyXDataService } from '@/services/studyXDataService';
import { toast } from '@/hooks/use-toast';

interface PDFViewerProps {
  file: GoogleDriveFile;
  showPreview?: boolean;
  className?: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ file, showPreview = true, className = "" }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [embedError, setEmbedError] = useState(false);
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

  const handleEmbedLoad = () => {
    setIsLoading(false);
    setEmbedError(false);
  };

  const handleEmbedError = () => {
    setIsLoading(false);
    setEmbedError(true);
  };

  return (
    <Card className={`bg-gray-900/20 border-gray-800/30 hover:bg-gray-900/30 transition-all duration-200 ${className}`}>      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <FileText className="w-4 h-4 text-blue-400 mr-2" />              <h4 className="text-gray-300 font-medium">{fileName}</h4>
            </div>
            <p className="text-sm text-gray-500">
              PDF Document • Google Drive
            </p>
          </div><div className="flex items-center gap-3 ml-4">
            {showPreview && fileId && (
              <Dialog>
                <DialogTrigger asChild>
                  <div onClick={() => setIsLoading(true)}>
                    <EyeIcon />
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl w-full h-[80vh] bg-gray-900 border-gray-800">
                  <DialogHeader>
                    <DialogTitle className="text-gray-200">{fileName}</DialogTitle>
                  </DialogHeader>
                  <div className="flex-1 relative">
                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
                        <div className="text-center">
                          <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-2" />
                          <p className="text-gray-400">Loading PDF...</p>
                        </div>
                      </div>
                    )}
                    {embedError ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-300 mb-2">
                            Unable to preview this PDF
                          </h3>
                          <p className="text-gray-500 mb-4">
                            This file cannot be embedded. You can still download it.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <iframe
                        src={file.previewUrl || studyXDataService.getEmbedUrl(fileId)}
                        className="w-full h-full border-0 rounded-lg"
                        onLoad={handleEmbedLoad}
                        onError={handleEmbedError}
                        title={fileName}
                      />
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            )}
            
            <div onClick={handleDownload}>
              <DownloadIcon />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PDFViewer;
