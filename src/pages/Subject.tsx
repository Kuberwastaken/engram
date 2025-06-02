
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, Github, BookOpen, FileText, Loader2, Download, ExternalLink, Eye } from 'lucide-react';
import { StarField } from '@/components/StarField';
import { toast } from '@/hooks/use-toast';
import { studyXDataService, GoogleDriveFile } from '@/services/studyXDataService';
import MaterialsList from '@/components/MaterialsList';

const Subject = () => {
  const { name } = useParams<{ name: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('notes');
  const [materials, setMaterials] = useState<Record<string, GoogleDriveFile[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const branch = searchParams.get('branch');
  const semester = searchParams.get('semester');
  const subjectName = decodeURIComponent(name || '');

  const tabs = [
    { id: 'notes', label: 'NOTES' },
    { id: 'pyqs', label: 'PYQS' },
    { id: 'books', label: 'BOOKS' },
    { id: 'lab', label: 'LAB' },
    { id: 'akash', label: 'AKASH' },
    { id: 'syllabus', label: 'SYLLABUS' },
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
        const organizedMaterials = await studyXDataService.getOrganizedMaterials(
          branch, 
          semester, 
          subjectName
        );
        
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

  // Mock syllabus data (since syllabus isn't available in Google Drive data)
  const mockSyllabus = {
    units: [
      {
        title: "Unit I - Fundamentals",
        content: "Introduction to basic concepts, historical background, and fundamental principles. This unit covers the foundational knowledge required for understanding the subject."
      },
      {
        title: "Unit II - Core Concepts", 
        content: "Detailed study of core methodologies, theories, and practical applications. Advanced problem-solving techniques and analytical methods."
      },
      {
        title: "Unit III - Advanced Topics",
        content: "Advanced concepts, modern developments, and research trends. Contemporary applications and emerging technologies in the field."
      },
      {
        title: "Unit IV - Applications",
        content: "Real-world applications, case studies, and industry practices. Project-based learning and practical implementations."
      }
    ],
    assessment: {
      internal: "30 marks",
      endSem: "70 marks", 
      practical: "As applicable"
    }
  };

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

    // Handle syllabus separately since it's not in Google Drive data
    if (tabId === 'syllabus') {
      return (
        <div className="space-y-6">
          <Accordion type="single" collapsible className="w-full">
            {mockSyllabus.units.map((unit: any, index: number) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-gray-800/30">
                <AccordionTrigger className="text-gray-300 hover:text-white hover:no-underline">
                  {unit.title}
                </AccordionTrigger>
                <AccordionContent className="text-gray-400 leading-relaxed">
                  {unit.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="mt-8 p-6 bg-gray-900/30 rounded-lg border border-gray-800/30">
            <h4 className="text-lg font-semibold text-gray-300 mb-4">Assessment Pattern</h4>
            <div className="space-y-2 text-gray-400">
              <p>• Internal Assessment: {mockSyllabus.assessment.internal}</p>
              <p>• End Semester Exam: {mockSyllabus.assessment.endSem}</p>
              <p>• Practical/Lab: {mockSyllabus.assessment.practical}</p>
            </div>
          </div>
        </div>
      );
    }

    // Handle videos separately (not implemented yet)
    if (tabId === 'videos') {
      return (
        <div className="text-center py-8">
          <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">Video materials coming soon!</p>
          <p className="text-sm text-gray-500 mt-2">
            We're working on integrating video content.
          </p>
        </div>
      );
    }

    // Render materials from Google Drive
    const tabMaterials = materials[tabId] || [];
    return <MaterialsList materials={tabMaterials} />;
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
              {subjectName}
            </h1>
            <p className="text-gray-400">{branch} - {semester} Semester</p>
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
