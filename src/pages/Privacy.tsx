import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Github, Shield, AlertTriangle, BookOpen, Scale, Users, Globe } from 'lucide-react';
import { StarField } from '@/components/StarField';
import { useNavigate } from 'react-router-dom';

const Privacy = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: "Content Ownership & Attribution",
      icon: <BookOpen className="w-6 h-6 text-blue-400" />,
      content: [
        "ENGRAM does not own any of the educational content provided through this platform.",
        "All study materials, notes, and resources are sourced from publicly available platforms including DotNotes.in, FifteenFourteen, and SyllabusX.live.",
        "Full credit and ownership of content belongs to the original creators and platforms.",
        "We aggregate and organize existing materials to improve accessibility for IPU engineering students.",
        "If you are a content creator and wish to have your material removed, please contact us immediately."
      ]
    },
    {
      title: "Open Source Nature",
      icon: <Github className="w-6 h-6 text-green-400" />,
      content: [
        "ENGRAM is an open-source project released under the Apache License 2.0.",
        "The source code is publicly available on GitHub for transparency and community collaboration.",
        "Anyone can view, modify, and contribute to the project while respecting the license terms.",
        "We encourage community contributions to improve the platform for all engineering students.",
        "Being open source ensures the platform remains free and accessible to everyone."
      ]
    },
    {
      title: "Apache License 2.0",
      icon: <Scale className="w-6 h-6 text-purple-400" />,
      content: [
        "This project is licensed under the Apache License, Version 2.0.",
        "You may obtain a copy of the License at: http://www.apache.org/licenses/LICENSE-2.0",
        "Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.",
        "See the License for the specific language governing permissions and limitations under the License.",
        "Commercial use, modification, distribution, and private use are permitted under this license."
      ]
    },
    {
      title: "No Liability Disclaimer",
      icon: <AlertTriangle className="w-6 h-6 text-red-400" />,
      content: [
        "ENGRAM is provided 'as is' without any warranties or guarantees of any kind.",
        "We do not guarantee the accuracy, completeness, or reliability of any content on this platform.",
        "Users access and use this platform at their own risk and discretion.",
        "ENGRAM and its contributors shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from the use of this platform.",
        "We are not responsible for any errors in content, broken links, or unavailable materials from source platforms.",
        "This platform is educational in nature and should not be the sole source for academic preparation."
      ]
    },
    {
      title: "Third-Party Content",
      icon: <Globe className="w-6 h-6 text-orange-400" />,
      content: [
        "Content is sourced from third-party educational platforms and websites.",
        "We do not control or monitor the content provided by these external sources.",
        "Links to external websites are provided for convenience and do not constitute endorsement.",
        "Users should verify information independently before making academic decisions.",
        "We are not responsible for the privacy practices or content of linked websites.",
        "External content may be subject to different terms of service and privacy policies."
      ]
    },
    {
      title: "Community & Contributions",
      icon: <Users className="w-6 h-6 text-cyan-400" />,
      content: [
        "ENGRAM is built by students, for students, as a community-driven initiative.",
        "Contributors maintain ownership of their contributions while granting usage rights under the Apache 2.0 License.",
        "We welcome contributions that improve the platform for the engineering student community.",
        "All contributors are expected to respect intellectual property rights and licensing terms.",
        "Community guidelines promote respectful, constructive collaboration.",
        "We reserve the right to moderate contributions to maintain platform quality and legal compliance."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden grain">
      <StarField />
        {/* Floating Header */}
      <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-7xl">
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
      </header>      {/* Main Content */}
      <main className="pt-24 pb-8 px-3 sm:px-4 lg:px-6">
        <div className="container mx-auto max-w-[95vw] xl:max-w-[90vw] 2xl:max-w-[85vw]">
          {/* Page Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-red-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
              Privacy & Legal Information
            </h1>
            <p className="text-lg text-gray-400 max-w-4xl mx-auto leading-relaxed">
              Important information about content ownership, licensing, liability, and your rights when using ENGRAM.
              Please read this information carefully before using the platform.
            </p>
          </div>

          {/* Important Notice */}
          <Card className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 backdrop-blur-xl mb-8">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-xl font-bold text-red-400 mb-2">
                    Important Notice
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    ENGRAM is an educational aggregation platform that organizes existing study materials from various sources. 
                    We do not claim ownership of any content and strongly encourage users to support the original creators 
                    and platforms. This platform is provided for educational purposes only.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>          {/* Legal Sections */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 mb-12">
            {sections.map((section, index) => (
              <Card 
                key={section.title}
                className="bg-gray-900/20 border border-gray-800/30 backdrop-blur-xl hover:border-gray-700/50 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    {section.icon}
                    <h3 className="text-xl font-bold text-gray-200">
                      {section.title}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0 mt-2"></div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          {item}
                        </p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* License Information */}
          <Card className="bg-gray-900/20 border border-gray-800/30 backdrop-blur-xl mb-8">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-200 mb-6 text-center">
                Apache License 2.0 - Key Points
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-green-400" />
                  </div>
                  <h4 className="font-semibold text-green-400 mb-2">Commercial Use</h4>
                  <p className="text-xs text-gray-400">Permitted for commercial purposes</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-6 h-6 text-blue-400" />
                  </div>
                  <h4 className="font-semibold text-blue-400 mb-2">Modification</h4>
                  <p className="text-xs text-gray-400">Can be modified and redistributed</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-purple-400" />
                  </div>
                  <h4 className="font-semibold text-purple-400 mb-2">Distribution</h4>
                  <p className="text-xs text-gray-400">Can be distributed freely</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-3">
                    <Scale className="w-6 h-6 text-orange-400" />
                  </div>
                  <h4 className="font-semibold text-orange-400 mb-2">Private Use</h4>
                  <p className="text-xs text-gray-400">Permitted for private use</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-gray-700/30 backdrop-blur-xl">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-200 mb-6 text-center">
                Questions or Concerns?
              </h2>
              <div className="text-center space-y-4">
                <p className="text-gray-300 leading-relaxed max-w-3xl mx-auto">
                  If you have questions about this privacy policy, content ownership, licensing, 
                  or wish to request content removal, please reach out to us through GitHub.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                    onClick={() => window.open('https://github.com/kuberwastaken/engram/issues', '_blank')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    Open GitHub Issue
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/resources')}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    View Resources
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Last Updated */}
          <div className="text-center mt-8 text-gray-500 text-sm">
            <p>Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Privacy;
