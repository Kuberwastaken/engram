import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Github, BookOpen, Users, Download, Star, Code, ExternalLink, AlertCircle, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StarField } from '@/components/StarField';

const Index = () => {
  const [branch, setBranch] = useState('');
  const [semester, setSemester] = useState('');
  const [isScrolled, setIsScrolled] = useState(false); // New state for scroll detection
  const navigate = useNavigate();

  const branches = [
    'AIDS', 'AIML', 'CIVIL', 'CSE', 'ECE', 'EEE', 'IT', 'MECH'
  ];

  const semesters = ['1st', '2nd', '3rd', '4th', '5th', '6th'];

  // Load preferences from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('engram-preferences');
    if (saved) {
      try {
        const { branch: savedBranch, semester: savedSemester } = JSON.parse(saved);
        if (savedBranch && savedSemester) {
          setBranch(savedBranch);
          setSemester(savedSemester);
          // Auto-navigate to saved selection
          const branchSlug = savedBranch.toLowerCase();
          const semesterSlug = savedSemester.replace(/(\d+)/, 'sem-$1').replace('st', '').replace('nd', '').replace('rd', '').replace('th', '');
          navigate(`/${branchSlug}/${semesterSlug}`);
        }
      } catch (error) {
        console.error('Failed to load preferences:', error);
      }
    }
  }, [navigate]);

  // Save preferences and navigate when both are selected
  useEffect(() => {
    if (branch && semester) {
      localStorage.setItem('engram-preferences', JSON.stringify({ branch, semester }));
        // Navigate to the new route format
      const branchSlug = branch.toLowerCase();
      const semesterSlug = semester.replace(/(\d+)/, 'sem-$1').replace('st', '').replace('nd', '').replace('rd', '').replace('th', '');
      navigate(`/${branchSlug}/${semesterSlug}`);
    }
  }, [branch, semester, navigate]);

  // Effect for scroll detection with debouncing for smoother performance
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const offset = window.scrollY;
          setIsScrolled(offset > 100); // Increased threshold for better UX
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const resetPreferences = () => {
    localStorage.removeItem('engram-preferences');
    setBranch('');
    setSemester('');
  };
  
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <StarField />
      
      {/* Navigation Bar - Clean floating design */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="transition-all duration-500 ease-out">
          <div 
            className={`transition-all duration-500 ease-out
              ${isScrolled 
                ? 'mx-auto mt-4 max-w-2xl px-4' 
                : 'mx-0 mt-0 px-0'
              }`
            }
          >
            <div 
              className={`transition-all duration-500 ease-out
                ${isScrolled 
                  ? 'bg-black/70 backdrop-blur-md border border-gray-800/50 rounded-full px-6 py-3' 
                  : 'bg-transparent border-b border-gray-800/70 px-4 py-4'
                }`
              }
            >
              <div 
                className={`flex justify-between items-center transition-all duration-500 ease-out
                  ${isScrolled 
                    ? 'gap-8' 
                    : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
                  }`
                }
              >
              {/* Logo */}
              <div className="flex items-center">
                <span 
                  className={`font-bold text-white transition-all duration-500 ease-out
                    ${isScrolled ? 'text-lg' : 'text-xl'}
                  `}
                >
                  ENGRAM
                </span>
              </div>
              
              {/* Centered Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                <span className="text-sm font-medium text-gray-400 hover:text-white cursor-pointer transition-colors duration-200">Home</span>
                <span className="text-sm font-medium text-gray-400 hover:text-white cursor-pointer transition-colors duration-200">Resources</span>
                <span className="text-sm font-medium text-gray-400 hover:text-white cursor-pointer transition-colors duration-200">About</span>
              </nav>
              
              {/* GitHub Button */}
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full transition-all duration-300 ease-out hover:scale-105
                  ${isScrolled 
                    ? 'w-9 h-9 bg-gray-800/60 hover:bg-gray-700/60 border border-gray-700/30' 
                    : 'w-10 h-10 hover:bg-gray-800/40'
                  }`
                }
                onClick={() => window.open('https://github.com/kuberwastaken/engram', '_blank')}
              >
                <Github 
                  className={`text-gray-300 transition-all duration-300 ease-out
                    ${isScrolled ? 'w-4 h-4' : 'w-5 h-5'}
                  `}                />
              </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-16 px-6 pt-20">
        <div className="container mx-auto max-w-7xl">
          {/* Hero Section */}
          <div className="text-center mb-20 animate-fade-in max-w-5xl mx-auto">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent tracking-tight">
              ENGRAM
            </h1>
            <p className="text-2xl md:text-3xl lg:text-4xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light mb-4">
              The centralized, No BS Open-Source hub for IP University study materials.
            </p>
            <p className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto">
              Built for students, by students. Access notes, previous year questions, lab manuals, and more.
            </p>
          </div>

          {/* Selection Interface */}
          <div className="max-w-lg mx-auto mb-32">
            <Card className="bg-gray-900/20 border border-gray-800/30 backdrop-blur-xl shadow-2xl">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-300">
                      Select Your Branch
                    </label>
                    <Select value={branch} onValueChange={setBranch}>
                      <SelectTrigger className="bg-gray-800/30 border-gray-700/30 text-white h-12 text-base hover:bg-gray-800/50 transition-all">
                        <SelectValue placeholder="Choose your branch" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900/95 border-gray-700/50 backdrop-blur-xl">
                        {branches.map((b) => (
                          <SelectItem 
                            key={b} 
                            value={b} 
                            className="text-white hover:bg-gray-800/50 focus:bg-gray-800/50"
                          >
                            {b}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-300">
                      Select Semester
                    </label>
                    <Select value={semester} onValueChange={setSemester}>
                      <SelectTrigger className="bg-gray-800/30 border-gray-700/30 text-white h-12 text-base hover:bg-gray-800/50 transition-all">
                        <SelectValue placeholder="Choose semester" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900/95 border-gray-700/50 backdrop-blur-xl">
                        {semesters.map((s) => (
                          <SelectItem 
                            key={s} 
                            value={s} 
                            className="text-white hover:bg-gray-800/50 focus:bg-gray-800/50"
                          >
                            {s} Semester
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {(branch || semester) && (
                    <div className="pt-4">
                      <Button
                        variant="outline"
                        className="w-full border-gray-700/50 text-gray-300 hover:bg-gray-800/30 hover:text-white transition-all h-11"
                        onClick={resetPreferences}
                      >
                        Reset Preferences
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features Section - Bento Grid */}
          <div className="space-y-16 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Everything You Need to Excel
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Comprehensive study materials curated by students, for students
              </p>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {/* Large Card */}
              <Card className="md:col-span-2 lg:col-span-2 bg-gray-900/20 border border-gray-800/30 backdrop-blur-xl hover:bg-gray-900/30 transition-all duration-300">
                <CardContent className="p-8">
                  <BookOpen className="w-12 h-12 text-blue-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-3">Comprehensive Notes</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Access detailed notes for all subjects across 8 engineering branches. 
                    From fundamentals to advanced topics, we've got you covered.
                  </p>
                </CardContent>
              </Card>

              {/* Small Card */}
              <Card className="bg-gray-900/20 border border-gray-800/30 backdrop-blur-xl hover:bg-gray-900/30 transition-all duration-300">
                <CardContent className="p-6">
                  <Star className="w-10 h-10 text-yellow-400 mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">Premium Quality</h3>
                  <p className="text-gray-400 text-sm">
                    Curated and verified content from top performers
                  </p>
                </CardContent>
              </Card>

              {/* Small Card */}
              <Card className="bg-gray-900/20 border border-gray-800/30 backdrop-blur-xl hover:bg-gray-900/30 transition-all duration-300">
                <CardContent className="p-6">
                  <Download className="w-10 h-10 text-green-400 mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">Instant Access</h3>
                  <p className="text-gray-400 text-sm">
                    Download resources instantly, no registration required
                  </p>
                </CardContent>
              </Card>

              {/* Medium Card */}
              <Card className="md:col-span-1 lg:col-span-2 bg-gray-900/20 border border-gray-800/30 backdrop-blur-xl hover:bg-gray-900/30 transition-all duration-300">
                <CardContent className="p-6">
                  <Users className="w-10 h-10 text-purple-400 mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">Community Driven</h3>
                  <p className="text-gray-400">
                    Built by students who understand your academic challenges. 
                    Contribute your own materials to help fellow students.
                  </p>
                </CardContent>
              </Card>

              {/* Large Card */}
              <Card className="md:col-span-2 lg:col-span-2 bg-gray-900/20 border border-gray-800/30 backdrop-blur-xl hover:bg-gray-900/30 transition-all duration-300">
                <CardContent className="p-8">
                  <Code className="w-12 h-12 text-indigo-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-3">Open Source</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Completely open source and transparent. Contribute code, report issues, 
                    or suggest improvements on GitHub.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">8</div>
                <div className="text-gray-400 text-sm">Engineering Branches</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">6</div>
                <div className="text-gray-400 text-sm">Semesters Covered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">100+</div>
                <div className="text-gray-400 text-sm">Study Materials</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">∞</div>
                <div className="text-gray-400 text-sm">Always Free</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/30 bg-gray-900/20 backdrop-blur-xl mt-20">
        <div className="container mx-auto max-w-6xl px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <h3 className="text-xl font-bold text-white mb-4">ENGRAM</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                The centralized hub for IP University study materials. Built by students, for students.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <div className="space-y-2">
                <a href="/" className="block text-gray-400 hover:text-white transition-colors text-sm">Home</a>
                <a href="/resources" className="block text-gray-400 hover:text-white transition-colors text-sm">Resources</a>
                <a href="/about" className="block text-gray-400 hover:text-white transition-colors text-sm">About</a>
                <a href="/privacy" className="block text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
              </div>
            </div>

            {/* Contribute */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Contribute</h4>
              <div className="space-y-2">
                <a 
                  href="https://github.com/kuberwastaken/engram/issues" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-400 hover:text-white transition-colors text-sm"
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Raise an Issue
                </a>
                <a 
                  href="https://github.com/kuberwastaken/engram/pulls" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-400 hover:text-white transition-colors text-sm"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Add Content
                </a>
                <a 
                  href="https://github.com/kuberwastaken/engram" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-400 hover:text-white transition-colors text-sm"
                >
                  <Github className="w-4 h-4 mr-2" />
                  Help Make it Better
                </a>
              </div>
            </div>

            {/* Connect */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Connect</h4>
              <div className="space-y-2">
                <a 
                  href="https://github.com/kuberwastaken/engram" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-400 hover:text-white transition-colors text-sm"
                >
                  <Github className="w-4 h-4 mr-2" />
                  GitHub Repository
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800/30 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © 2024 Engram. Open source and always free.
            </p>
            <p className="text-gray-400 text-sm mt-4 md:mt-0 flex items-center">
              Made with <Heart className="w-4 h-4 mx-1 text-red-400" /> by{' '}
              <a 
                href="https://kuber.studio/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-1 text-white hover:text-blue-400 transition-colors"
              >
                Kuber Mehta
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
