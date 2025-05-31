
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Github } from 'lucide-react';
import { StarField } from '@/components/StarField';
import { SubjectGrid } from '@/components/SubjectGrid';

const BranchSemester = () => {
  const { branch, semester } = useParams<{ branch: string; semester: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Convert URL params back to original format
  const branchName = branch?.toUpperCase() || '';
  const semesterName = semester?.replace('sem-', '') + (
    semester?.includes('1') ? 'st' :
    semester?.includes('2') ? 'nd' :
    semester?.includes('3') ? 'rd' : 'th'
  ) || '';

  useEffect(() => {
    // Validate the route params
    const validBranches = ['AIDS', 'AIML', 'CIVIL', 'CSE', 'ECE', 'EEE', 'IT', 'MECH'];
    const validSemesters = ['1st', '2nd', '3rd', '4th', '5th', '6th'];
    
    if (!validBranches.includes(branchName) || !validSemesters.includes(semesterName)) {
      navigate('/');
      return;
    }

    // Update localStorage with current selection
    localStorage.setItem('engram-preferences', JSON.stringify({ 
      branch: branchName, 
      semester: semesterName 
    }));

    setLoading(false);
  }, [branchName, semesterName, navigate]);

  const resetAndGoHome = () => {
    localStorage.removeItem('engram-preferences');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <StarField />
      
      {/* Top Navigation Bar */}
      <header className="fixed top-0 w-full bg-black/40 backdrop-blur-xl border-b border-gray-800/30 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-full bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/30 transition-all duration-300 hover:scale-105"
            onClick={() => window.open('https://github.com/kuberwastaken/engram', '_blank')}
          >
            <Github className="w-5 h-5 text-gray-300" />
          </Button>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetAndGoHome}
              className="text-gray-400 hover:text-white hover:bg-gray-800/30 transition-all"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
          
          <div className="w-10 h-10" />
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              {branchName}
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-2">
              {semesterName} Semester
            </p>
            <p className="text-gray-500">
              Select a subject to access study materials
            </p>
          </div>

          {/* Subject Grid */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <SubjectGrid branch={branchName} semester={semesterName} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default BranchSemester;
