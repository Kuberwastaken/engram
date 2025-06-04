import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Github, BookOpen, Users, Download, Star, Code, ExternalLink, AlertCircle, Heart, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StarField } from '@/components/StarField';

const Index = () => {
  const [branch, setBranch] = useState('');
  const [semester, setSemester] = useState('');
  const [isScrolled, setIsScrolled] = useState(false); // New state for scroll detection
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile menu state
  const [isMenuClosing, setIsMenuClosing] = useState(false); // Animation state
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
const [isSearching, setIsSearching] = useState(false);

  const branches = [
    'AIDS', 'AIML', 'CIVIL', 'CSE', 'ECE', 'EEE', 'IT', 'MECH'
  ];

  const semesters = ['1st', '2nd', '3rd', '4th', '5th', '6th'];

  // Function to handle smooth menu closing
  const closeMobileMenu = () => {
    setIsMenuClosing(true);
    setTimeout(() => {
      setIsMobileMenuOpen(false);
      setIsMenuClosing(false);
    }, 300); // Match CSS animation duration
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      // Navigate to search results page with the query
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearching(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

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
  // Effect for mobile menu behavior
  useEffect(() => {
    const handleResize = () => {
      // Close mobile menu on desktop resize
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    // Prevent body scroll when menu is open
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      // Reset body scroll on cleanup
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);
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
              >              {/* Logo */}
              <div className="flex items-center">
                <img 
                  src="/assets/web-app-manifest-192x192.png" 
                  alt="ENGRAM" 
                  className={`transition-all duration-500 ease-out
                    ${isScrolled ? 'h-7' : 'h-8'}
                  `}
                />
              </div>
              <div className="flex items-center">
  <div className="relative transition-all duration-500 ease-out">
  <input
    type="text"
    placeholder="Search notes, subjects..."
    value={searchQuery}
    onChange={handleSearchChange}
    onKeyPress={handleKeyPress}
    className={`bg-white/90 text-black placeholder-gray-500 rounded-full shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-400 transition-all duration-500 ease-out ${
      isScrolled ? 'w-56 h-6 text-sm px-4' : 'w-96 h-12 text-base px-6'
    }`}
    disabled={isSearching}
  />
  <button
    onClick={handleSearchSubmit}
    disabled={isSearching || !searchQuery.trim()}
    className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ease-in-out ${
      isSearching || !searchQuery.trim()
        ? 'opacity-40 cursor-not-allowed'
        : 'opacity-100 hover:scale-110'
    }`}
  >
    {isSearching ? (
      <svg
        className="animate-spin h-5 w-5 text-gray-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`text-gray-600 ${
          isScrolled ? 'h-4 w-4' : 'h-5 w-5'
        } transition-all duration-300`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    )}
  </button>
</div>
</div>
              

              {/* Centered Navigation - Desktop Only */}
              <nav className="hidden md:flex items-center space-x-8">
                <span 
                  className="text-sm font-medium text-gray-400 hover:text-white cursor-pointer transition-colors duration-200"
                  onClick={() => navigate('/')}
                >
                  Home
                </span>
                <span 
                  className="text-sm font-medium text-gray-400 hover:text-white cursor-pointer transition-colors duration-200"
                  onClick={() => navigate('/about')}
                >
                  About
                </span>
                <span 
                  className="text-sm font-medium text-gray-400 hover:text-white cursor-pointer transition-colors duration-200"
                  onClick={() => navigate('/resources')}
                >
                  Resources
                </span>
                <span 
                  className="text-sm font-medium text-gray-400 hover:text-white cursor-pointer transition-colors duration-200"
                  onClick={() => navigate('/privacy')}
                >
                  Privacy
                </span>
              </nav>
              
              {/* Desktop GitHub Button */}
              <Button
                variant="ghost"
                size="icon"
                className={`hidden md:flex rounded-full transition-all duration-300 ease-out hover:scale-105
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
                  `}
                />
              </Button>

              {/* Mobile Hamburger Menu */}
              <Button
                variant="ghost"
                size="icon"
                className={`md:hidden rounded-full transition-all duration-300 ease-out hover:scale-105
                  ${isScrolled 
                    ? 'w-9 h-9 bg-gray-800/60 hover:bg-gray-700/60 border border-gray-700/30' 
                    : 'w-10 h-10 hover:bg-gray-800/40'
                  }`
                }
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X 
                    className={`text-gray-300 transition-all duration-300 ease-out
                      ${isScrolled ? 'w-4 h-4' : 'w-5 h-5'}
                    `}
                  />
                ) : (
                  <Menu 
                    className={`text-gray-300 transition-all duration-300 ease-out
                      ${isScrolled ? 'w-4 h-4' : 'w-5 h-5'}
                    `}
                  />
                )}
              </Button>              </div>
            </div>
          </div>
        </div>
      </header>      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Dark Backdrop Overlay */}
          <div 
            className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40 animate-fade-in"
            onClick={closeMobileMenu}
          />
            {/* Slide-in Menu Panel */}
          <div 
            className={`md:hidden fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-black/90 backdrop-blur-xl border-l border-gray-800/50 z-50 ${
              isMenuClosing ? 'slide-out-right' : 'slide-in-right'
            }`}
            data-mobile-menu
          >            {/* Menu Header */}
            <div className="flex items-center justify-end p-4 border-b border-gray-800/50">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/30 transition-all duration-300 hover:scale-105"
                onClick={closeMobileMenu}
              >
                <X className="w-5 h-5 text-gray-300" />
              </Button>
            </div>{/* Menu Items */}
            <nav className="p-6 space-y-2">
              <div 
                className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-800/50 cursor-pointer transition-all duration-200 group"
                onClick={() => {
                  navigate('/');
                  closeMobileMenu();
                }}
              >
                <div className="w-10 h-10 rounded-lg bg-gray-700/30 flex items-center justify-center group-hover:bg-gray-600/40 transition-colors">
                  <BookOpen className="w-5 h-5 text-gray-300" />
                </div>
                <div>
                  <span className="text-white font-medium block">Home</span>
                  <span className="text-gray-400 text-sm">Main dashboard</span>
                </div>
              </div>
              
              <div 
                className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-800/50 cursor-pointer transition-all duration-200 group"
                onClick={() => {
                  navigate('/about');
                  closeMobileMenu();
                }}
              >
                <div className="w-10 h-10 rounded-lg bg-gray-700/30 flex items-center justify-center group-hover:bg-gray-600/40 transition-colors">
                  <Heart className="w-5 h-5 text-gray-300" />
                </div>
                <div>
                  <span className="text-white font-medium block">About</span>
                  <span className="text-gray-400 text-sm">Our story & mission</span>
                </div>
              </div>
              
              <div 
                className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-800/50 cursor-pointer transition-all duration-200 group"
                onClick={() => {
                  navigate('/resources');
                  closeMobileMenu();
                }}
              >
                <div className="w-10 h-10 rounded-lg bg-gray-700/30 flex items-center justify-center group-hover:bg-gray-600/40 transition-colors">
                  <Code className="w-5 h-5 text-gray-300" />
                </div>
                <div>
                  <span className="text-white font-medium block">Resources</span>
                  <span className="text-gray-400 text-sm">Data sources & info</span>
                </div>
              </div>
              
              <div 
                className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-800/50 cursor-pointer transition-all duration-200 group"
                onClick={() => {
                  navigate('/privacy');
                  closeMobileMenu();
                }}
              >
                <div className="w-10 h-10 rounded-lg bg-gray-700/30 flex items-center justify-center group-hover:bg-gray-600/40 transition-colors">
                  <AlertCircle className="w-5 h-5 text-gray-300" />
                </div>
                <div>
                  <span className="text-white font-medium block">Privacy</span>
                  <span className="text-gray-400 text-sm">Privacy policy</span>
                </div>
              </div>
              
              {/* Separator */}
              <div className="border-t border-gray-700/50 my-6"></div>
              
              {/* GitHub Link */}
              <div 
                className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-800/50 cursor-pointer transition-all duration-200 group"
                onClick={() => {
                  window.open('https://github.com/kuberwastaken/engram', '_blank');
                  closeMobileMenu();
                }}
              >
                <div className="w-10 h-10 rounded-lg bg-gray-700/30 flex items-center justify-center group-hover:bg-gray-600/40 transition-colors">
                  <Github className="w-5 h-5 text-gray-300" />
                </div>
                <div className="flex-1">
                  <span className="text-white font-medium block">GitHub Repository</span>
                  <span className="text-gray-400 text-sm">Contribute & star ⭐</span>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-500" />
              </div>
            </nav>            {/* Menu Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-800/50 bg-gradient-to-t from-black/50 to-transparent">
              <p className="text-center text-gray-400 text-sm">
                Made with ❤️ for IPU students
              </p>
            </div>
          </div>
        </>
      )}      {/* Main Content */}
      <main className="pb-16 px-3 sm:px-4 lg:px-6 pt-32">
        <div className="container mx-auto max-w-[95vw] xl:max-w-[90vw] 2xl:max-w-[85vw]">          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in w-full mx-auto mt-8 px-2 sm:px-4">            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mx-auto leading-tight mb-8">
              <span className="block">
                The Centralized, No BS hub for
              </span>
              <span className="block">
                IP University Resources
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-5xl mx-auto">
              Built for students, by students. No Trackers, No Ads and Open Source
            </p>
          </div>          {/* Selection Interface */}
          <div className="max-w-2xl lg:max-w-3xl mx-auto mb-32">            <Card className="bg-gray-900/20 border border-gray-800/30 backdrop-blur-xl shadow-2xl cosmic-hover transition-all duration-500 hover:shadow-cosmic">
              <CardContent className="p-6 sm:p-8 lg:p-12">
                <div className="space-y-8">
                  {/* Branch Selection */}
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-200 tracking-wide">
                      Select Your Branch
                    </label>
                    <Select value={branch} onValueChange={setBranch}>
                      <SelectTrigger className="bg-gray-800/30 border-gray-700/30 text-white h-14 text-base hover:bg-gray-800/50 transition-all duration-300 hover:border-gray-600/50 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20">
                        <SelectValue placeholder="Choose your branch" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900/95 border-gray-700/50 backdrop-blur-xl">
                        {branches.map((b) => (
                          <SelectItem 
                            key={b} 
                            value={b} 
                            className="text-white hover:bg-gray-800/50 focus:bg-gray-800/50 transition-colors"
                          >
                            {b}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Semester Selection with proper spacing */}
                  <div className="space-y-4 mt-8">
                    <label className="block text-sm font-semibold text-gray-200 tracking-wide">
                      Select Semester
                    </label>
                    <Select value={semester} onValueChange={setSemester}>
                      <SelectTrigger className="bg-gray-800/30 border-gray-700/30 text-white h-14 text-base hover:bg-gray-800/50 transition-all duration-300 hover:border-gray-600/50 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20">
                        <SelectValue placeholder="Choose semester" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900/95 border-gray-700/50 backdrop-blur-xl">
                        {semesters.map((s) => (
                          <SelectItem 
                            key={s} 
                            value={s} 
                            className="text-white hover:bg-gray-800/50 focus:bg-gray-800/50 transition-colors"
                          >
                            {s} Semester
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Reset Button with enhanced styling */}
                  {(branch || semester) && (
                    <div className="pt-6 animate-fade-in">                      <Button
                        variant="outline"
                        className="w-full border-gray-700/50 text-gray-300 hover:bg-gray-800/30 hover:text-white transition-all duration-300 h-12 hover:border-gray-600/50"
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
          <div className="space-y-16 animate-fade-in" style={{ animationDelay: '0.2s' }}>            <div className="text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Everything You Need to Excel
              </h2>
              <p className="text-gray-400 text-lg max-w-3xl mx-auto">
                Comprehensive study materials curated by students, for students
              </p>
            </div>            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-none mx-auto">
              {/* Large Card */}
              <Card className="md:col-span-2 xl:col-span-2 bg-gray-900/20 border border-gray-800/30 backdrop-blur-xl hover:bg-gray-900/30 transition-all duration-300">
                <CardContent className="p-6 lg:p-8">
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
                <div className="text-3xl font-bold text-white mb-2">10,000+</div>
                <div className="text-gray-400 text-sm">Study Materials</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">∞</div>
                <div className="text-gray-400 text-sm">No Ads, Open Source</div>
              </div>
            </div>
          </div>
        </div>
      </main>      {/* Footer */}
      <footer className="border-t border-gray-800/30 bg-gray-900/20 backdrop-blur-xl mt-20">
        <div className="container mx-auto max-w-[95vw] xl:max-w-[90vw] 2xl:max-w-[85vw] px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <h3 className="text-xl font-bold text-white mb-4">ENGRAM</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                The centralized hub for IP University study materials. Built by students, for students.
              </p>
            </div>            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <div className="space-y-2">
                <span 
                  className="block text-gray-400 hover:text-white transition-colors text-sm cursor-pointer"
                  onClick={() => navigate('/')}
                >
                  Home
                </span>
                <span 
                  className="block text-gray-400 hover:text-white transition-colors text-sm cursor-pointer"
                  onClick={() => navigate('/resources')}
                >
                  Resources
                </span>
                <span className="block text-gray-400 hover:text-white transition-colors text-sm cursor-pointer">About</span>
                <span 
                  className="block text-gray-400 hover:text-white transition-colors text-sm cursor-pointer"
                  onClick={() => navigate('/privacy')}
                >
                  Privacy Policy
                </span>
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
              © {new Date().getFullYear()} Engram. Open source and always free.
            </p><p className="text-gray-400 text-sm mt-4 md:mt-0 flex items-center">
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
