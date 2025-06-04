import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, Github, BookOpen, FileText, Loader2, Download, ExternalLink, Eye, Play } from 'lucide-react';
import { StarField } from '@/components/StarField';
import { toast } from '@/hooks/use-toast';
import { unifiedDataService } from '@/services/unifiedDataService';
import type { GoogleDriveFile } from '@/services/unifiedDataService';
import { type SyllabusData, type VideoData } from '@/services/contentFetchingService';
import MaterialsList from '@/components/MaterialsList';
import PDFViewer from '@/components/PDFViewer';
import { formatSubjectName } from '@/lib/utils';

// Component that auto-opens PDF in fullscreen for single Akash files
const AutoOpenPDFCard: React.FC<{
  file: GoogleDriveFile;
  subjectName: string;
  materialType: string;
  showSourceTag: boolean;
}> = ({ file, subjectName, materialType, showSourceTag }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-open the PDF in fullscreen after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFullscreen(true);
      setIsLoading(true);
    }, 1000); // Give a moment for the user to see the card

    return () => clearTimeout(timer);
  }, []);

  // Close fullscreen handler
  const handleCloseFullscreen = () => {
    setIsFullscreen(false);
    setIsLoading(false);
  };

  // Fullscreen PDF Reader component (similar to PDFViewer's implementation)
  const FullscreenPDFReader = () => {
    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleCloseFullscreen();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      document.body.classList.add('pdf-fullscreen-open');
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.classList.remove('pdf-fullscreen-open');
      };
    }, []);

    const fileName = unifiedDataService.getFileName(file);
    const fileId = unifiedDataService.getFileId(file);

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
        {/* Header */}
        <div className="relative flex items-center justify-between px-6 py-2 bg-black border-b border-gray-800/30 h-12 flex-shrink-0">
          <div className="flex items-center space-x-4 relative z-10">
            <button
              onClick={handleCloseFullscreen}
              className="p-1.5 rounded bg-gray-900/50 hover:bg-gray-800/70 transition-colors border border-gray-700/50"
            >
              <ArrowLeft className="w-4 h-4 text-gray-300" />
            </button>
            <div className="text-sm text-gray-300">
              <span className="opacity-60">{formatSubjectName(subjectName)}</span>
              <span className="mx-2 opacity-40">/</span>
              <span className="opacity-60">{materialType.toUpperCase()}</span>
              <span className="mx-2 opacity-40">/</span>
              <span className="text-white font-medium">{fileName}</span>
            </div>
          </div>
          <div className="flex items-center space-x-3 relative z-10">
            <div className="text-xs text-gray-400">
              Press ESC to close
            </div>
          </div>
        </div>
        
        {/* PDF content */}
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
          
          <iframe
            src={file.previewUrl || unifiedDataService.getEmbedUrl(fileId)}
            className="w-full h-full border-0 block"
            onLoad={() => setIsLoading(false)}
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
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Show preview card */}
      <Card className="bg-gray-900/20 border-2 border-blue-500/50 hover:bg-gray-800/40 hover:border-blue-400/70 transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <FileText className="w-4 h-4 text-blue-400 mr-2" />
                <h4 className="text-gray-300 font-medium">{unifiedDataService.getFileName(file)}</h4>
              </div>
              <p className="text-sm text-gray-400">
                PDF Document • Auto-opening in fullscreen...
                {showSourceTag && file.source && (
                  <span className="ml-2 px-2 py-0.5 bg-gray-700/50 text-gray-300 text-xs rounded border border-gray-600/30">
                    {file.source}
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fullscreen PDF Reader */}
      {isFullscreen && createPortal(<FullscreenPDFReader />, document.body)}
    </>
  );
};

const Subject = () => {
  const { name } = useParams<{ name: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('syllabus');
  const [materials, setMaterials] = useState<Record<string, GoogleDriveFile[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for syllabus and videos data
  const [syllabusData, setSyllabusData] = useState<SyllabusData | null>(null);
  const [videosData, setVideosData] = useState<VideoData[] | null>(null);
  const [syllabusLoading, setSyllabusLoading] = useState(false);
  const [videosLoading, setVideosLoading] = useState(false);
  const [syllabusError, setSyllabusError] = useState<string | null>(null);
  const [videosError, setVideosError] = useState<string | null>(null);

  const branch = searchParams.get('branch');
  const semester = searchParams.get('semester');
  const subjectName = decodeURIComponent(name || '');

  const tabs = [
    { id: 'syllabus', label: 'SYLLABUS' },
    { id: 'notes', label: 'NOTES' },
    { id: 'pyqs', label: 'PYQS' },
    { id: 'books', label: 'BOOKS' },
    { id: 'lab', label: 'LAB' },
    { id: 'akash', label: 'AKASH' },
    { id: 'videos', label: 'VIDEOS' },
  ];

  // Load materials from Google Drive
  useEffect(() => {
    const loadMaterials = async () => {
      if (!branch || !semester || !subjectName) {
        setError('Missing required parameters');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Loading materials for:', { branch, semester, subjectName });
        
        const organizedMaterials = await unifiedDataService.getOrganizedMaterials(
          branch, 
          semester, 
          subjectName
        );
        
        console.log('Organized materials received:', organizedMaterials);
        
        // Log each material type and count
        Object.keys(organizedMaterials).forEach(type => {
          console.log(`${type}: ${organizedMaterials[type].length} files`);
        });
        
        setMaterials(organizedMaterials);
        setError(null);
      } catch (err) {
        console.error('Error loading materials:', err);
        setError('Failed to load materials');
        toast({
          title: "Error",
          description: "Failed to load materials. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadMaterials();
  }, [branch, semester, subjectName]);

  // Load syllabus data when syllabus tab is active
  useEffect(() => {
    const loadSyllabusData = async () => {
      if (activeTab !== 'syllabus' || !branch || !semester || !subjectName) {
        return;
      }

      if (syllabusData) {
        return; // Already loaded
      }

      try {
        setSyllabusLoading(true);
        setSyllabusError(null);
        console.log('Loading syllabus data for:', { branch, semester, subjectName });
        
        const data = await unifiedDataService.fetchSyllabusData(branch, semester, subjectName);
        setSyllabusData(data);
      } catch (err) {
        console.error('Error loading syllabus:', err);
        setSyllabusError('Failed to load syllabus data');
        toast({
          title: "Error",
          description: "Failed to load syllabus. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setSyllabusLoading(false);
      }
    };

    loadSyllabusData();
  }, [activeTab, branch, semester, subjectName, syllabusData]);

  // Load videos data when videos tab is active
  useEffect(() => {
    const loadVideosData = async () => {
      if (activeTab !== 'videos' || !branch || !semester || !subjectName) {
        return;
      }

      if (videosData) {
        return; // Already loaded
      }

      try {
        setVideosLoading(true);
        setVideosError(null);
        console.log('Loading videos data for:', { branch, semester, subjectName });
        
        const data = await unifiedDataService.fetchVideosData(branch, semester, subjectName);
        setVideosData(data);
      } catch (err) {
        console.error('Error loading videos:', err);
        setVideosError('Failed to load videos data');
        toast({
          title: "Error",
          description: "Failed to load videos. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setVideosLoading(false);
      }
    };

    loadVideosData();
  }, [activeTab, branch, semester, subjectName, videosData]);

  const renderTabContent = (tabId: string) => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
            <p className="text-gray-400">Loading materials...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <div className="text-center">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">Unable to load materials</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 hover:bg-blue-700"
            >
              Try Again
            </Button>
          </div>
        </div>
      );
    }

    // Handle syllabus separately with real data
    if (tabId === 'syllabus') {
      if (syllabusLoading) {
        return (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
              <p className="text-gray-400">Loading syllabus...</p>
            </div>
          </div>
        );
      }

      if (syllabusError || !syllabusData) {
        return (
          <div className="text-center py-12">
            <div className="text-center">
              <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">Unable to load syllabus</h3>
              <p className="text-gray-500 mb-4">{syllabusError || 'No syllabus data available'}</p>
              <Button 
                onClick={() => {
                  setSyllabusData(null);
                  setSyllabusError(null);
                }} 
                className="bg-blue-600 hover:bg-blue-700"
              >
                Try Again
              </Button>
            </div>
          </div>
        );
      }

      // Render real syllabus data
      const units = Object.entries(syllabusData);
      
      return (
        <div className="space-y-8">
          <Accordion type="multiple" className="w-full">
            {units.map(([unitKey, unitContent], index) => (
              <AccordionItem key={unitKey} value={`item-${index}`} className="border-gray-800/30">
                <AccordionTrigger className="text-gray-200 hover:text-white hover:no-underline font-medium tracking-wide text-lg" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                  {unitKey}
                </AccordionTrigger>
                <AccordionContent className="text-gray-100 leading-relaxed whitespace-pre-line text-base md:text-lg px-4 py-3 bg-gray-900 rounded-lg shadow-inner" style={{ lineHeight: 1.85, letterSpacing: '0.01em', fontFamily: 'Helvetica, Arial, sans-serif' }}>
                  {unitContent}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          {units.length === 0 && (
            <div className="text-center py-8">
              <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No syllabus content available</p>
            </div>
          )}
        </div>
      );
    }

    // Handle videos with real data
    if (tabId === 'videos') {
      if (videosLoading) {
        return (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
              <p className="text-gray-400">Loading videos...</p>
            </div>
          </div>
        );
      }

      if (videosError || !videosData) {
        return (
          <div className="text-center py-12">
            <div className="text-center">
              <Play className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">Unable to load videos</h3>
              <p className="text-gray-500 mb-4">{videosError || 'No video data available'}</p>
              <Button 
                onClick={() => {
                  setVideosData(null);
                  setVideosError(null);
                }} 
                className="bg-blue-600 hover:bg-blue-700"
              >
                Try Again
              </Button>
            </div>
          </div>
        );
      }

      // Render real videos data
      if (videosData.length === 0) {
        return (
          <div className="text-center py-8">
            <Play className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No video content available for this subject</p>
          </div>
        );
      }

      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videosData.map((video, index) => (
              <Card key={index} className="bg-gray-900/30 border border-gray-800/30 hover:border-gray-700/50 transition-all duration-300 hover:scale-105">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Video Thumbnail */}
                    {video.thumbnailUrl && (
                      <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
                        <img 
                          src={video.thumbnailUrl} 
                          alt={video.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <Play className="w-12 h-12 text-white opacity-80" />
                        </div>
                      </div>
                    )}
                    
                    {/* Video Info */}
                    <div>
                      <h3 className="font-semibold text-gray-200 text-sm mb-1 line-clamp-2">
                        {video.title}
                      </h3>
                      {video.author && (
                        <p className="text-xs text-gray-400 mb-2">
                          by {video.author}
                        </p>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {video.embedUrl && (
                        <Button 
                          size="sm" 
                          className="flex-1 bg-red-600 hover:bg-red-700 text-xs"
                          onClick={() => window.open(video.embedUrl, '_blank')}
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Watch
                        </Button>
                      )}
                      {video.playlistUrl && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 text-xs"
                          onClick={() => window.open(video.playlistUrl, '_blank')}
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Playlist
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    // Handle Akash tab: auto-open PDF if only one Akash file exists
    if (tabId === 'akash') {
      const akashMaterials = materials['akash'] || [];
      
      if (akashMaterials.length === 1) {
        const akashFile = akashMaterials[0];
        
        // Return auto-opening PDF viewer component with a ref to trigger fullscreen
        return (
          <div className="space-y-3">
            <AutoOpenPDFCard
              file={akashFile}
              subjectName={formatSubjectName(subjectName)}
              materialType="akash"
              showSourceTag={true}
            />
            <div className="text-center py-4">
              <p className="text-gray-300 text-sm">
                📄 Single Akash PDF detected - Opening automatically in fullscreen...
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Press ESC to close the fullscreen reader
              </p>
            </div>
          </div>
        );
      }
    }

    // Render materials from Google Drive
    const tabMaterials = materials[tabId] || [];
    return (
      <MaterialsList 
        materials={tabMaterials} 
        subjectName={formatSubjectName(subjectName)}
        materialType={tabId}
      />
    );
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden grain">
      <StarField />
      
      {/* Floating Header */}
      <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-4xl">
        <div className="bg-gray-900/20 backdrop-blur-xl border border-gray-800/30 rounded-2xl px-6 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-gray-300 hover:text-white hover:bg-gray-800/30"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <div className="text-sm text-gray-400">
                <span className="text-gray-300">{branch}</span> • <span className="text-gray-300">{semester}</span>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-full bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/30 transition-all duration-300 hover:scale-105"
              onClick={() => window.open('https://github.com/kuberwastaken/engram', '_blank')}
            >
              <Github className="w-5 h-5 text-gray-300" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-8 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Subject Header */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
              {formatSubjectName(subjectName)}
            </h1>
          </div>

          {/* Tabbed Interface */}
          <Card className="bg-gray-900/20 border border-gray-800/30 backdrop-blur-xl">
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 lg:grid-cols-7 w-full bg-gray-800/30 p-1">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="text-xs lg:text-sm data-[state=active]:bg-gray-700/50 data-[state=active]:text-white text-gray-400"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {tabs.map((tab) => (
                  <TabsContent key={tab.id} value={tab.id} className="mt-6">
                    <div className="animate-fade-in">
                      {renderTabContent(tab.id)}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Subject;
