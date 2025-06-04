import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Github, Heart, Code, Users, Zap } from 'lucide-react';
import { StarField } from '@/components/StarField';

const About = () => {
  const navigate = useNavigate();

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
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              About ENGRAM
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Engineers' Random Access Memory - Born from frustration, built for students
            </p>
          </div>

          {/* Story Section */}
          <Card className="bg-gray-900/20 border border-gray-800/30 backdrop-blur-xl mb-8">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Heart className="w-6 h-6 text-red-400" />
                <h2 className="text-2xl font-bold text-gray-200">Our Story</h2>
              </div>
              <div className="space-y-4 text-gray-300 leading-relaxed">                <p>
                  ENGRAM (Engineers' Random Access Memory) was born from a moment of pure frustration. 
                  Created by <a 
                    href="https://x.com/Kuberwastaken" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 font-medium hover:text-blue-300 transition-colors duration-200 underline decoration-blue-400/30 hover:decoration-blue-300/50"
                  >
                    Kuber Mehta
                  </a> during the chaos 
                  of exam preparation, when juggling multiple websites, dealing with frequent downtimes, 
                  scattered WhatsApp groups, and endless Google Drive links became unbearable.
                </p>
                <p>
                  What started as a random hunch just before an exam has evolved into something much bigger - 
                  an intuitive, open-source solution that IPU engineering students truly deserve.
                </p>
                <p>
                  We serve one of the largest groups of engineering colleges in the world, and we believe 
                  every student deserves access to a platform that is <span className="text-green-400 font-medium">open</span>, 
                  <span className="text-blue-400 font-medium"> collaborative</span>, and 
                  <span className="text-purple-400 font-medium"> excellent</span> for all.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Mission Section */}
          <Card className="bg-gray-900/20 border border-gray-800/30 backdrop-blur-xl mb-8">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-6 h-6 text-yellow-400" />
                <h2 className="text-2xl font-bold text-gray-200">Our Mission</h2>
              </div>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  We're here to solve a real problem: the scattered, random, and frankly distracting 
                  nature of existing study resources. During exam time, students shouldn't have to 
                  worry about broken links, slow websites, or hunting through dozens of chat groups.
                </p>
                <p>
                  ENGRAM consolidates everything into one clean, fast, and reliable platform. 
                  No more distractions, no more frustration - just the materials you need, 
                  when you need them.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Features Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-gray-900/20 border border-gray-800/30 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Code className="w-5 h-5 text-green-400" />
                  <h3 className="text-xl font-semibold text-gray-200">Open Source</h3>
                </div>
                <p className="text-gray-400">
                  Built with transparency in mind. Every line of code is open for inspection, 
                  contribution, and improvement by the community.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/20 border border-gray-800/30 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-5 h-5 text-blue-400" />
                  <h3 className="text-xl font-semibold text-gray-200">Community Driven</h3>
                </div>
                <p className="text-gray-400">
                  Made by students, for students. We rely on contributions from the community 
                  to keep growing and improving.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Technical Details */}
          <Card className="bg-gray-900/20 border border-gray-800/30 backdrop-blur-xl mb-8">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Code className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-gray-200">Built With</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-3xl">⚛️</div>
                  <h4 className="font-semibold text-gray-300">React + TypeScript</h4>
                  <p className="text-sm text-gray-500">Modern, type-safe frontend</p>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl">🎨</div>
                  <h4 className="font-semibold text-gray-300">Tailwind CSS</h4>
                  <p className="text-sm text-gray-500">Beautiful, responsive design</p>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl">🚀</div>
                  <h4 className="font-semibold text-gray-300">Vite</h4>
                  <p className="text-sm text-gray-500">Lightning-fast development</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer Links */}
          <div className="text-center space-y-4">
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/resources')}
                className="bg-gray-800/30 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white"
              >
                View Resources
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/privacy')}
                className="bg-gray-800/30 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white"
              >
                Privacy Policy
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open('https://github.com/kuberwastaken/engram', '_blank')}
                className="bg-gray-800/30 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white"
              >
                <Github className="w-4 h-4 mr-2" />
                Contribute
              </Button>
            </div>
            
            <p className="text-sm text-gray-500 max-w-2xl mx-auto">
              Made with ❤️ for IPU engineering students. Together, we're building something better.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
