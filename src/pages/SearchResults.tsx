import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { StarField } from '@/components/StarField';

interface DotNote {
  id: string;
  title: string;
  type: string;
  branch: string;
  semester: string;
  subject: string;
  viewUrl: string;
  downloadUrl: string;
  originalFolder: string;
}

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<DotNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const query = new URLSearchParams(location.search).get('q') || '';

  useEffect(() => {
    const fetchDotNotes = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/Content-Meta/Dotnotes.json');
        const data = await res.json();
        const results: DotNote[] = [];

        // Step 1: Flatten the nested JSON
        for (const branch in data.branches) {
          const semesters = data.branches[branch];
          for (const semester in semesters) {
            const subjects = semesters[semester];
            for (const subject in subjects) {
              const sources = subjects[subject];
              for (const type in sources) {
                const files = sources[type];
                files.forEach((file: any) => {
                  results.push({
                    id: file.id,
                    title: file.name,
                    type,
                    branch,
                    semester,
                    subject,
                    viewUrl: file.viewUrl,
                    downloadUrl: file.downloadUrl,
                    originalFolder: file.originalFolder,
                  });
                });
              }
            }
          }
        }

        // Step 2: Filter by query
        const filtered = results.filter((item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.branch.toLowerCase().includes(query.toLowerCase()) ||
          item.semester.toLowerCase().includes(query.toLowerCase()) ||
          item.subject.toLowerCase().includes(query.toLowerCase()) ||
          item.type.toLowerCase().includes(query.toLowerCase())
        );

        setSearchResults(filtered);
      } catch (error) {
        console.error('Failed to load dot notes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (query) fetchDotNotes();
  }, [query]);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden grain">
        <StarField />
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white"
        >
          <ArrowLeft size={18} />
          Back
        </Button>

        <h1 className="text-2xl sm:text-3xl font-bold mb-6">
          Search Results for "{query}"
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((result) => (
              <Card
                key={result.id}
                className="bg-gray-900/20 border border-gray-800/30 hover:bg-gray-900/30 transition-all cursor-pointer"
                onClick={() => window.open(result.viewUrl, '_blank')}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <BookOpen className="text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{result.title}</h3>
                      <p className="text-gray-400 text-sm">
                        {result.branch} • {result.semester} • {result.subject} • {result.type}
                      </p>
                      <a
                        href={result.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-300 underline text-sm mt-1 block"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No results found for "{query}"</p>
            <Button
              variant="outline"
              className="mt-4 border-gray-700 text-gray-300 hover:text-white"
              onClick={() => navigate('/')}
            >
              Return Home
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
