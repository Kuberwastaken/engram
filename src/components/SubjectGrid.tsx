
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { studyXDataService } from '@/services/studyXDataService';
import { Loader2 } from 'lucide-react';
import { formatSubjectName } from '@/lib/utils';

interface SubjectGridProps {
  branch: string;
  semester: string;
}

export const SubjectGrid: React.FC<SubjectGridProps> = ({ branch, semester }) => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Convert semester format to StudyX format
        // URL format: 1st -> SEM1, 2nd -> SEM2, 3rd -> SEM3, etc.
        // URL format: sem-1 -> SEM1, sem-2 -> SEM2, etc.
        let semesterKey = semester.toUpperCase();
        if (semesterKey.includes('1ST') || semesterKey.includes('SEM-1')) {
          semesterKey = 'SEM1';
        } else if (semesterKey.includes('2ND') || semesterKey.includes('SEM-2')) {
          semesterKey = 'SEM2';
        } else if (semesterKey.includes('3RD') || semesterKey.includes('SEM-3')) {
          semesterKey = 'SEM3';
        } else if (semesterKey.includes('4TH') || semesterKey.includes('SEM-4')) {
          semesterKey = 'SEM4';
        } else if (semesterKey.includes('5TH') || semesterKey.includes('SEM-5')) {
          semesterKey = 'SEM5';
        } else if (semesterKey.includes('6TH') || semesterKey.includes('SEM-6')) {
          semesterKey = 'SEM6';
        } else if (semesterKey.includes('7TH') || semesterKey.includes('SEM-7')) {
          semesterKey = 'SEM7';
        } else if (semesterKey.includes('8TH') || semesterKey.includes('SEM-8')) {
          semesterKey = 'SEM8';
        } else {
          // Fallback for direct SEM format
          semesterKey = semester.replace(/sem-?/i, 'SEM').toUpperCase();
        }
        
        const availableSubjects = await studyXDataService.getAvailableSubjects(branch, semesterKey);
        setSubjects(availableSubjects);
      } catch (err) {
        console.error('Error loading subjects:', err);
        setError('Failed to load subjects');
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };

    if (branch && semester) {
      loadSubjects();
    }
  }, [branch, semester]);

  const handleSubjectClick = (subject: string) => {
    const encodedSubject = encodeURIComponent(subject);
    navigate(`/subject/${encodedSubject}?branch=${branch}&semester=${semester}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-gray-400">Loading subjects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Error loading subjects: {error}</p>
        <p className="text-gray-500 text-sm mt-2">Please try refreshing the page.</p>
      </div>
    );
  }

  if (subjects.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No subjects found for this combination.</p>
        <p className="text-gray-500 text-sm mt-2">Materials for {branch} - {semester} semester are not yet available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {subjects.map((subject, index) => (
        <Card
          key={subject}
          className="bg-gray-900/20 border border-gray-800/30 backdrop-blur-xl hover:bg-gray-900/30 transition-all duration-300 cursor-pointer cosmic-hover animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
          onClick={() => handleSubjectClick(subject)}
        >
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">{formatSubjectName(subject)}</h3>
            <p className="text-gray-500 text-sm">
              Click to access notes, PYQs, and more resources
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
