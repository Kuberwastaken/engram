
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface SubjectGridProps {
  branch: string;
  semester: string;
}

export const SubjectGrid: React.FC<SubjectGridProps> = ({ branch, semester }) => {
  const navigate = useNavigate();

  // Mock subject data for all branches and semesters
  const subjectsData: Record<string, Record<string, string[]>> = {
    AIDS: {
      '1st': ['Applied Mathematics I', 'Applied Physics I', 'Applied Chemistry I', 'Engineering Graphics', 'Basic Electrical Engineering'],
      '2nd': ['Applied Mathematics II', 'Applied Physics II', 'Applied Chemistry II', 'Programming Fundamentals', 'Workshop Practice'],
      '3rd': ['Data Structures', 'Digital Logic Design', 'Computer Organization', 'Discrete Mathematics', 'Operating Systems'],
      '4th': ['Database Management Systems', 'Computer Networks', 'Software Engineering', 'Theory of Computation', 'Machine Learning'],
      '5th': ['Artificial Intelligence', 'Deep Learning', 'Natural Language Processing', 'Computer Vision', 'Data Science'],
      '6th': ['Big Data Analytics', 'Intelligent Systems', 'Robotics', 'IoT Applications', 'Capstone Project']
    },
    AIML: {
      '1st': ['Applied Mathematics I', 'Applied Physics I', 'Applied Chemistry I', 'Engineering Graphics', 'Basic Electrical Engineering'],
      '2nd': ['Applied Mathematics II', 'Applied Physics II', 'Applied Chemistry II', 'Programming Fundamentals', 'Workshop Practice'],
      '3rd': ['Data Structures', 'Digital Logic Design', 'Computer Organization', 'Statistics & Probability', 'Linear Algebra'],
      '4th': ['Machine Learning', 'Database Management Systems', 'Computer Networks', 'Software Engineering', 'Pattern Recognition'],
      '5th': ['Deep Learning', 'Natural Language Processing', 'Computer Vision', 'Reinforcement Learning', 'Neural Networks'],
      '6th': ['Advanced ML Algorithms', 'AI Ethics', 'Intelligent Agents', 'Research Methodology', 'Major Project']
    },
    CSE: {
      '1st': ['Applied Mathematics I', 'Applied Physics I', 'Applied Chemistry I', 'Engineering Graphics', 'Basic Electrical Engineering'],
      '2nd': ['Applied Mathematics II', 'Applied Physics II', 'Applied Chemistry II', 'Programming Fundamentals', 'Workshop Practice'],
      '3rd': ['Data Structures', 'Digital Logic Design', 'Computer Organization', 'Discrete Mathematics', 'Operating Systems'],
      '4th': ['Database Management Systems', 'Computer Networks', 'Software Engineering', 'Theory of Computation', 'Web Technologies'],
      '5th': ['Compiler Design', 'Computer Graphics', 'Distributed Systems', 'Information Security', 'Mobile Computing'],
      '6th': ['Cloud Computing', 'Blockchain Technology', 'Advanced Algorithms', 'Research Project', 'Industry Training']
    },
    ECE: {
      '1st': ['Applied Mathematics I', 'Applied Physics I', 'Applied Chemistry I', 'Engineering Graphics', 'Basic Electrical Engineering'],
      '2nd': ['Applied Mathematics II', 'Applied Physics II', 'Applied Chemistry II', 'Electronic Devices', 'Network Analysis'],
      '3rd': ['Analog Electronics', 'Digital Electronics', 'Signals & Systems', 'Electromagnetic Theory', 'Electronic Measurements'],
      '4th': ['Microprocessors', 'Communication Systems', 'Control Systems', 'VLSI Design', 'Digital Signal Processing'],
      '5th': ['Embedded Systems', 'Antenna Theory', 'Microwave Engineering', 'Optical Communication', 'Power Electronics'],
      '6th': ['Wireless Communication', 'Satellite Communication', 'Advanced Electronics', 'Project Work', 'Industrial Training']
    },
    EEE: {
      '1st': ['Applied Mathematics I', 'Applied Physics I', 'Applied Chemistry I', 'Engineering Graphics', 'Basic Electrical Engineering'],
      '2nd': ['Applied Mathematics II', 'Applied Physics II', 'Applied Chemistry II', 'Circuit Analysis', 'Electrical Machines I'],
      '3rd': ['Electrical Machines II', 'Power Systems I', 'Electrical Measurements', 'Control Systems', 'Power Electronics'],
      '4th': ['Power Systems II', 'Switchgear & Protection', 'Electrical Drives', 'Utilization of Electrical Energy', 'Economic Operation'],
      '5th': ['High Voltage Engineering', 'Power System Analysis', 'Renewable Energy', 'Smart Grid Technology', 'Energy Management'],
      '6th': ['Power Quality', 'Electric Vehicles', 'Industrial Automation', 'Major Project', 'Electrical Safety']
    },
    IT: {
      '1st': ['Applied Mathematics I', 'Applied Physics I', 'Applied Chemistry I', 'Engineering Graphics', 'Basic Electrical Engineering'],
      '2nd': ['Applied Mathematics II', 'Applied Physics II', 'Applied Chemistry II', 'Programming Fundamentals', 'Workshop Practice'],
      '3rd': ['Data Structures', 'Digital Logic Design', 'Computer Organization', 'Database Systems', 'Object Oriented Programming'],
      '4th': ['Computer Networks', 'Software Engineering', 'Web Technologies', 'Information Security', 'System Administration'],
      '5th': ['Cloud Computing', 'Mobile Application Development', 'Big Data Analytics', 'DevOps', 'Enterprise Systems'],
      '6th': ['Cyber Security', 'IT Project Management', 'Emerging Technologies', 'Capstone Project', 'Industry Internship']
    },
    MECH: {
      '1st': ['Applied Mathematics I', 'Applied Physics I', 'Applied Chemistry I', 'Engineering Graphics', 'Basic Electrical Engineering'],
      '2nd': ['Applied Mathematics II', 'Applied Physics II', 'Applied Chemistry II', 'Engineering Mechanics', 'Workshop Practice'],
      '3rd': ['Strength of Materials', 'Thermodynamics', 'Fluid Mechanics', 'Manufacturing Processes', 'Material Science'],
      '4th': ['Heat Transfer', 'Machine Design', 'Internal Combustion Engines', 'Production Technology', 'Mechanical Vibrations'],
      '5th': ['Refrigeration & Air Conditioning', 'Automobile Engineering', 'Industrial Engineering', 'CAD/CAM', 'Finite Element Analysis'],
      '6th': ['Robotics', 'Renewable Energy Systems', 'Advanced Manufacturing', 'Project Management', 'Major Project']
    },
    CIVIL: {
      '1st': ['Applied Mathematics I', 'Applied Physics I', 'Applied Chemistry I', 'Engineering Graphics', 'Basic Electrical Engineering'],
      '2nd': ['Applied Mathematics II', 'Applied Physics II', 'Applied Chemistry II', 'Engineering Mechanics', 'Building Materials'],
      '3rd': ['Strength of Materials', 'Fluid Mechanics', 'Surveying', 'Concrete Technology', 'Structural Analysis I'],
      '4th': ['Structural Analysis II', 'Soil Mechanics', 'Water Resources Engineering', 'Transportation Engineering', 'Design of Structures'],
      '5th': ['Foundation Engineering', 'Environmental Engineering', 'Construction Management', 'Earthquake Engineering', 'Steel Structures'],
      '6th': ['Advanced Concrete Design', 'Bridge Engineering', 'Town Planning', 'Project Work', 'Quantity Surveying']
    }
  };

  const subjects = subjectsData[branch]?.[semester] || [];

  const handleSubjectClick = (subject: string) => {
    const encodedSubject = encodeURIComponent(subject);
    navigate(`/subject/${encodedSubject}?branch=${branch}&semester=${semester}`);
  };

  if (subjects.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No subjects found for this combination.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {subjects.map((subject, index) => (
        <Card
          key={subject}
          className="bg-gray-900/20 border border-gray-800/30 backdrop-blur-xl hover:bg-gray-900/30 transition-all duration-300 cursor-pointer orbital-ring animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
          onClick={() => handleSubjectClick(subject)}
        >
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">{subject}</h3>
            <p className="text-gray-500 text-sm">
              Click to access notes, PYQs, and more resources
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
