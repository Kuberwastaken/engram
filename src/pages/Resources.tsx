import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Github, ExternalLink, BookOpen, Database, Globe } from 'lucide-react';
import { StarField } from '@/components/StarField';
import { useNavigate } from 'react-router-dom';

const Resources = () => {
  const navigate = useNavigate();

  const sources = [
    {
      name: "DotNotes.in",
      url: "https://dotnotes.in",
      description: "Comprehensive study materials and notes for engineering students across multiple branches and semesters.",
      icon: <BookOpen className="w-8 h-8 text-blue-400" />,
      color: "from-blue-500/20 to-blue-600/10"
    },
    {
      name: "FifteenFourteen",
      url: "https://fifteenforteen.vercel.app/",
      description: "First-year engineering materials including applied mathematics, physics, chemistry, and foundational subjects.",
      icon: <Database className="w-8 h-8 text-purple-400" />,
      color: "from-purple-500/20 to-purple-600/10"
    },
    {
      name: "SyllabusX.live",
      url: "https://syllabusx.live",
      description: "Detailed syllabus information and academic structure for various engineering programs and courses.",
      icon: <Globe className="w-8 h-8 text-green-400" />,
      color: "from-green-500/20 to-green-600/10"
    }
  ];

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
          {/* Page Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
              Resources & Sources
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              ENGRAM wouldn't exist without these incredible platforms that made educational content accessible to engineering students everywhere.
            </p>
          </div>

          {/* Acknowledgment Section */}
          <Card className="bg-gray-900/20 border border-gray-800/30 backdrop-blur-xl mb-8">
            <CardContent className="p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-200 mb-4">
                  Standing on the Shoulders of Giants
                </h2>
                <p className="text-gray-300 leading-relaxed mb-6">
                  These platforms have been tirelessly serving the engineering student community, 
                  providing quality educational content when it was needed most. ENGRAM exists 
                  to unify and enhance access to their valuable resources, creating a seamless 
                  experience for IPU engineering students.
                </p>
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-gray-700/30">
                  <p className="text-sm text-gray-400 italic">
                    "If I have seen further, it is by standing on the shoulders of giants." - Isaac Newton
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {sources.map((source, index) => (
              <Card 
                key={source.name}
                className="bg-gray-900/20 border border-gray-800/30 backdrop-blur-xl hover:border-gray-700/50 transition-all duration-300 hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${source.color} flex items-center justify-center mb-4 mx-auto`}>
                    {source.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-200 text-center mb-3">
                    {source.name}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4 text-center">
                    {source.description}
                  </p>
                  <div className="text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(source.url, '_blank')}
                      className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Site
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* About ENGRAM Section */}
          <Card className="bg-gray-900/20 border border-gray-800/30 backdrop-blur-xl">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-gray-200 mb-6 text-center">
                About ENGRAM
              </h2>
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p className="text-lg">
                  <span className="font-semibold text-white">ENGRAM</span> (Engineers' Random Access Memory) 
                  was born from a moment of frustration just before an exam when 
                  <span className="text-blue-400 font-medium"> Kuber Mehta</span> found himself 
                  jumping between multiple websites, dealing with servers that went down often, 
                  scrolling through chaotic WhatsApp groups, and hunting for scattered Google Drive links 
                  just to study for a single exam.
                </p>
                
                <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-lg p-4 border border-gray-700/30">
                  <p className="text-sm text-gray-400">
                    💡 <span className="font-medium text-orange-400">The Problem:</span> Random and scattered UI across multiple platforms, 
                    frankly distracting interfaces during crucial exam time, and unreliable access to study materials.
                  </p>
                </div>

                <p>
                  ENGRAM offers an <span className="font-semibold text-green-400">intuitive, open-source solution</span> 
                  that IPU engineering students truly deserve. With one of the largest groups of engineering 
                  colleges in the world, IPU students needed a platform that is:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                  <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                    <h4 className="font-semibold text-blue-400 mb-2">Open</h4>
                    <p className="text-sm text-gray-400">Transparent, community-driven, and accessible to everyone</p>
                  </div>
                  <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                    <h4 className="font-semibold text-purple-400 mb-2">Collaborative</h4>
                    <p className="text-sm text-gray-400">Built by students, for students, with continuous contributions</p>
                  </div>
                  <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                    <h4 className="font-semibold text-green-400 mb-2">Great for All</h4>
                    <p className="text-sm text-gray-400">Designed to serve every branch and semester effectively</p>
                  </div>
                </div>

                <p className="text-center text-gray-400 italic">
                  "Sometimes the best solutions come from the simplest frustrations. 
                  ENGRAM is proof that student problems deserve student solutions."
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center mt-8">
            <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-gray-700/30 backdrop-blur-xl">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-200 mb-3">
                  Want to Contribute?
                </h3>
                <p className="text-gray-400 mb-4">
                  ENGRAM is open source and thrives on community contributions. 
                  Help us make it even better for future engineering students.
                </p>
                <Button
                  onClick={() => window.open('https://github.com/kuberwastaken/engram', '_blank')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Github className="w-4 h-4 mr-2" />
                  Contribute on GitHub
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Resources;
