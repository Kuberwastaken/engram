
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, Download, Github, ExternalLink, Eye } from 'lucide-react';
import { StarField } from '@/components/StarField';
import { toast } from '@/hooks/use-toast';

const Subject = () => {
  const { name } = useParams<{ name: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('syllabus');

  const branch = searchParams.get('branch');
  const semester = searchParams.get('semester');
  const subjectName = decodeURIComponent(name || '');

  const tabs = [
    { id: 'syllabus', label: 'SYLLABUS' },
    { id: 'notes', label: 'NOTES' },
    { id: 'pyqs', label: 'PYQS' },
    { id: 'lab', label: 'LAB' },
    { id: 'books', label: 'BOOKS' },
    { id: 'akash', label: 'AKASH' },
    { id: 'videos', label: 'VIDEOS' },
  ];

  // Mock resource data
  const resourcesData: Record<string, any> = {
    syllabus: {
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
    },
    notes: [
      { name: 'Chapter_1_Introduction.pdf', contributor: 'Akash Kumar' },
      { name: 'Chapter_2_Fundamentals.pdf', contributor: 'Priya Sharma' },
      { name: 'Complete_Notes.pdf', contributor: 'Rohit Singh' },
      { name: 'Quick_Revision_Notes.pdf', contributor: 'Ananya Gupta' },
    ],
    pyqs: [
      { name: 'PYQ_2023.pdf', contributor: 'Student Council' },
      { name: 'PYQ_2022.pdf', contributor: 'Student Council' },
      { name: 'PYQ_2021.pdf', contributor: 'Student Council' },
      { name: 'Solved_PYQs.pdf', contributor: 'Teaching Assistant' },
    ],
    lab: [
      { name: 'Lab_Manual.pdf', contributor: 'Faculty' },
      { name: 'Experiment_1.pdf', contributor: 'Lab Instructor' },
      { name: 'Sample_Code.zip', contributor: 'Senior Student' },
      { name: 'Lab_Report_Template.pdf', contributor: 'Department' },
    ],
    books: [
      { name: 'Reference_Book_1.pdf', contributor: 'Digital Library' },
      { name: 'Handbook.pdf', contributor: 'Department' },
      { name: 'Additional_Reading.pdf', contributor: 'Faculty' },
    ],
    akash: {
      name: 'Complete_Akash_Notes.pdf',
      contributor: 'Akash Kumar',
      description: 'Comprehensive notes covering all units with detailed explanations and examples.'
    },
    videos: [
      { name: 'Introduction to Fundamentals', videoId: 'dQw4w9WgXcQ', contributor: 'Faculty' },
      { name: 'Core Concepts Explained', videoId: 'dQw4w9WgXcQ', contributor: 'TA Team' },
      { name: 'Advanced Problem Solving', videoId: 'dQw4w9WgXcQ', contributor: 'Student Helper' },
    ],
  };

  const handleDownload = (fileName: string) => {
    toast({
      title: "Download Started",
      description: `Downloading ${fileName}...`,
    });
    
    console.log(`Downloading: /materials/${branch}/${semester}/${subjectName}/${activeTab}/${fileName}`);
  };

  const handleView = (fileName: string) => {
    toast({
      title: "Opening Viewer",
      description: `Opening ${fileName} in viewer...`,
    });
    
    console.log(`Viewing: /materials/${branch}/${semester}/${subjectName}/${activeTab}/${fileName}`);
  };

  const handleOpenPdf = (fileName: string) => {
    const url = `/materials/${branch}/${semester}/${subjectName}/${activeTab}/${fileName}`;
    window.open(url, '_blank');
  };

  const isMobile = window.innerWidth < 768;

  const renderTabContent = (tabId: string) => {
    if (tabId === 'syllabus') {
      return (
        <div className="space-y-6">
          <Accordion type="single" collapsible className="w-full">
            {resourcesData.syllabus.units.map((unit: any, index: number) => (
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
              <p>• Internal Assessment: {resourcesData.syllabus.assessment.internal}</p>
              <p>• End Semester Exam: {resourcesData.syllabus.assessment.endSem}</p>
              <p>• Practical/Lab: {resourcesData.syllabus.assessment.practical}</p>
            </div>
          </div>
        </div>
      );
    }

    if (tabId === 'videos') {
      const videos = resourcesData.videos || [];
      
      if (videos.length === 0) {
        return (
          <div className="text-center py-8">
            <p className="text-gray-400">No videos available for this section yet.</p>
          </div>
        );
      }

      return (
        <div className="space-y-6">
          {videos.map((video: any, index: number) => (
            <Card
              key={index}
              className="bg-gray-900/20 border-gray-800/30 hover:bg-gray-900/30 transition-all duration-200"
            >
              <CardContent className="p-6">
                <h4 className="text-gray-300 font-medium mb-3">{video.name}</h4>
                <div className="aspect-video mb-4">
                  <iframe
                    className="w-full h-full rounded-lg"
                    src={`https://www.youtube.com/embed/${video.videoId}`}
                    title={video.name}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <p className="text-sm text-gray-500">
                  Contributed by: {video.contributor}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (tabId === 'akash') {
      const akashBook = resourcesData.akash;
      
      return (
        <div className="space-y-4">
          <Card className="bg-gray-900/20 border-gray-800/30 hover:bg-gray-900/30 transition-all duration-200">
            <CardContent className="p-6">
              <h4 className="text-gray-300 font-medium mb-2">{akashBook.name}</h4>
              <p className="text-gray-400 mb-4">{akashBook.description}</p>
              <p className="text-sm text-gray-500 mb-4">
                Contributed by: {akashBook.contributor}
              </p>
              <div className="flex flex-wrap gap-3">
                {!isMobile && (
                  <>
                    <Button
                      onClick={() => handleView(akashBook.name)}
                      className="bg-blue-600/80 hover:bg-blue-500/80 text-white"
                      size="sm"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button
                      onClick={() => handleOpenPdf(akashBook.name)}
                      className="bg-gray-700/80 hover:bg-gray-600/80 text-white"
                      size="sm"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open PDF
                    </Button>
                  </>
                )}
                <Button
                  onClick={() => handleDownload(akashBook.name)}
                  className="bg-gray-800/50 hover:bg-gray-700/50 text-white border border-gray-700/30"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    const resources = resourcesData[tabId] || [];
    
    if (resources.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-400">No resources available for this section yet.</p>
          <p className="text-sm text-gray-500 mt-2">
            Contribute by adding materials to help fellow students!
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {resources.map((resource: any, index: number) => (
          <Card
            key={index}
            className="bg-gray-900/20 border-gray-800/30 hover:bg-gray-900/30 transition-all duration-200"
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="text-gray-300 font-medium mb-1">{resource.name}</h4>
                  <p className="text-sm text-gray-500">
                    Contributed by: {resource.contributor}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 ml-4">
                  {!isMobile && (
                    <>
                      <Button
                        onClick={() => handleView(resource.name)}
                        className="bg-blue-600/80 hover:bg-blue-500/80 text-white"
                        size="sm"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button
                        onClick={() => handleOpenPdf(resource.name)}
                        className="bg-gray-700/80 hover:bg-gray-600/80 text-white"
                        size="sm"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open PDF
                      </Button>
                    </>
                  )}
                  <Button
                    onClick={() => handleDownload(resource.name)}
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
        ))}
      </div>
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
