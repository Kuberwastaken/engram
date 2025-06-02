import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, Download, ExternalLink, FileText, Loader2, Globe } from 'lucide-react';
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

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: `Downloading ${fileName}...`,
    });
    window.open(studyXDataService.getDownloadUrl(file), '_blank');
  };

  const handleView = () => {
    if (file.webViewUrl) {
      window.open(file.webViewUrl, '_blank');
    } else if (fileId) {
      window.open(studyXDataService.getViewUrl(fileId), '_blank');
    } else {
      toast({
        title: "Error",
        description: "Unable to view this file",
        variant: "destructive"
      });
    }
  };

  const handleWebView = () => {
    if (file.webViewUrl) {
      window.open(file.webViewUrl, '_blank');
    } else {
      toast({
        title: "Error",
        description: "Web view not available for this file",
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
  };

  return (
    <Card className={`bg-gray-900/20 border-gray-800/30 hover:bg-gray-900/30 transition-all duration-200 ${className}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <FileText className="w-4 h-4 text-blue-400 mr-2" />              <h4 className="text-gray-300 font-medium">{fileName}</h4>
            </div>
            <p className="text-sm text-gray-500">
              PDF Document • Google Drive
            </p>
          </div>
          <div className="flex flex-wrap gap-2 ml-4">
            {showPreview && fileId && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="bg-blue-600/80 hover:bg-blue-500/80 text-white"
                    size="sm"
                    onClick={() => setIsLoading(true)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
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
                            This file cannot be embedded. You can still view or download it.
                          </p>                          <div className="flex gap-2 justify-center">
                            <Button onClick={handleWebView} className="bg-green-600 hover:bg-green-700" disabled={!file.webViewUrl}>
                              <Globe className="w-4 h-4 mr-2" />
                              Web View
                            </Button>
                            <Button onClick={handleView} className="bg-blue-600 hover:bg-blue-700">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Open in Google Drive
                            </Button>
                            <Button onClick={handleDownload} variant="outline">
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>                    ) : (
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
              </Dialog>            )}
            
            <Button
              onClick={handleWebView}
              className="bg-green-600/80 hover:bg-green-500/80 text-white"
              size="sm"
              disabled={!file.webViewUrl}
            >
              <Globe className="w-4 h-4 mr-2" />
              Web View
            </Button>
            
            <Button
              onClick={handleView}
              className="bg-gray-700/80 hover:bg-gray-600/80 text-white"
              size="sm"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open
            </Button>
            
            <Button
              onClick={handleDownload}
              className="bg-gray-800/50 hover:bg-gray-700/50 text-white border border-gray-700/30"
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PDFViewer;
