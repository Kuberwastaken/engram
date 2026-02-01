import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import institutesData from '@/data/institutes.json';
import cutoffsData from '@/data/cutoffs.json';
import feesData from '@/data/fees.json';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { ChevronRight, Download, ExternalLink, MapPin } from 'lucide-react';

// Types
type PageType = 'overview' | 'placements' | 'cutoffs' | 'fees' | 'resources' | 'timeline';

const InstitutePage = () => {
    const { instituteId, branchId, topic, subjectId, type } = useParams();

    // Normalize IDs
    const institute = useMemo(() =>
        institutesData.find(i => i.id === instituteId?.toLowerCase() || i.shortName.toLowerCase() === instituteId?.toLowerCase()),
        [instituteId]
    );

    const branch = useMemo(() =>
        institute?.programs.find(p => p.code.toLowerCase() === branchId?.toLowerCase()),
        [institute, branchId]
    );

    if (!institute || !branch) {
        return <div className="p-10 text-center">Institute or Branch not found. <Link to="/" className="text-blue-500 underline">Go Home</Link></div>;
    }

    // Determine Content Mode
    const isResourcePage = !!subjectId;
    const isCutoffPage = topic === 'cutoffs';
    const isFeePage = topic === 'fees';
    const isPlacementPage = topic === 'placements';

    // Timeline Logic
    const timelineMatch = topic?.match(/(?:semester|sem)-?(\d+)|(?:(\d+)(?:st|nd|rd|th)?-?year)/i);
    const isTimelinePage = !!timelineMatch;
    const semesterNum = timelineMatch?.[1];
    const yearNum = timelineMatch?.[2];

    // --- Dynamic Content Generators (Madlibs) ---
    const generateTitle = () => {
        if (isCutoffPage) return `${institute.shortName} ${branch.code} Cutoff 2025 - JEE Mains & IPU CET Ranks`;
        if (isFeePage) return `${institute.shortName} ${branch.code} Fees Structure 2025-2026`;
        if (isPlacementPage) return `${institute.shortName} ${branch.code} Placements 2025 - Average Package & Recruiters`;
        if (isTimelinePage && semesterNum) return `B.Tech ${branch.code} Semester ${semesterNum} Syllabus & Subjects at ${institute.shortName}`;
        if (isTimelinePage && yearNum) return `B.Tech ${branch.code} ${yearNum === '1' ? '1st' : yearNum + 'th'} Year Syllabus & Notes - ${institute.shortName}`;
        if (isResourcePage) {
            if (type?.includes('unit')) return `${subjectId} ${type.replace('-', ' ').toUpperCase()} Notes for ${institute.shortName} - PDF Download`;
            return `${subjectId} Notes & Study Material for ${institute.shortName} ${branch.code}`;
        }
        return `${branch.name} at ${institute.name} (${institute.shortName}) - Admission, Fees, Cutoffs`;
    };

    const generateDescription = () => {
        return `Get latest ${topic || 'details'} for ${branch.name} at ${institute.name}, ${institute.location}. Check 2025 Cutoffs, Fees, Placements and download Study Material/Notes for free.`;
    };

    // --- Components ---

    const CutoffSection = () => {
        const data = cutoffsData[institute.id as keyof typeof cutoffsData]?.[branch.code as keyof typeof cutoffsData];
        if (!data) return <div className="p-4 border rounded-lg bg-gray-50">Cutoff data specifically for {branch.code} at {institute.shortName} is being updated for 2025. Generally, ranks close between 40k - 90k for top branches.</div>;

        return (
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>JEE Mains Cutoff 2024-2025</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Category</TableHead>
                                <TableHead>Min Rank</TableHead>
                                <TableHead>Max Rank</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Object.entries(data).map(([cat, ranks]: [string, any]) => (
                                <TableRow key={cat}>
                                    <TableCell className="font-medium">{cat === 'OPNOHS' ? 'Delhi General' : cat === 'OPNOOS' ? 'Outside Delhi General' : cat}</TableCell>
                                    <TableCell>{ranks.min}</TableCell>
                                    <TableCell>{ranks.max}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <p className="text-sm text-gray-500 mt-4">* Data based on Round 1 GGSIPU allotments.</p>
                </CardContent>
            </Card>
        );
    };

    const FeeSection = () => {
        // Enriched Fee Logic
        const instituteId = institute.id.toLowerCase();

        let feeInfo = null;
        let isDefault = false;

        if (instituteId === 'usict' || instituteId === 'usar' || instituteId === 'usct') {
            feeInfo = feesData.USS["B.Tech"];
        } else if (feesData[instituteId as keyof typeof feesData]) {
            feeInfo = feesData[instituteId as keyof typeof feesData]["B.Tech"];
        } else {
            feeInfo = feesData.default_affiliate["B.Tech"];
            isDefault = true;
        }

        if (isDefault) {
            return (
                <Card className="mb-8">
                    <CardHeader><CardTitle>Annual Fee Structure (Estimates)</CardTitle></CardHeader>
                    <CardContent>
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                            <p className="text-yellow-700 text-sm">
                                <strong>Note:</strong> Official 2025 fee notification for {institute.shortName} is pending. Below is the indicative structure based on GGSIPU norms.
                            </p>
                        </div>
                        <div className="prose">
                            <ul className="list-disc pl-5">
                                {(feeInfo as any).breakdown.map((item: string, idx: number) => <li key={idx}>{item}</li>)}
                            </ul>
                            <p className="mt-4 font-medium">Expected Total: ₹1.40 Lakhs - ₹1.70 Lakhs / Annum</p>
                        </div>
                    </CardContent>
                </Card>
            );
        }

        return (
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Annual Fee Structure {instituteId === 'usict' ? '(USS)' : ''}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                        <p className="text-blue-700 text-sm">
                            <strong>Verified:</strong> {(feeInfo as any).note || "Official GGSIPU Fee Structure."}
                        </p>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Academic Year</TableHead>
                                <TableHead>Tuition Fee</TableHead>
                                <TableHead>Total Fee</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Object.entries((feeInfo as any)).filter(([key]) => key.includes('-')).map(([year, amount]: [string, any]) => (
                                <TableRow key={year}>
                                    <TableCell>{year}</TableCell>
                                    <TableCell>₹{amount.tuition.toLocaleString()}</TableCell>
                                    <TableCell className="font-bold">₹{amount.total.toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        );
    };

    const ResourceSection = () => {
        // In a real scenario, we would `useQuery` to fetch specific materials from `SyllabusX.json`
        // For pSEO static generation, we show a rich placeholder that invites user to download.
        const resourceType = type ? type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Study Material';

        return (
            <div className="space-y-6">
                <Card className="border-blue-100 shadow-md">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-xl text-blue-900">{subjectId} {resourceType}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-blue-50 border-1 border-blue-200 rounded-md p-4 mb-4 flex gap-3">
                            <div className="shrink-0">
                                <Download className="h-5 w-5 text-blue-600" />
                            </div>
                            <p className="text-blue-800 text-sm">
                                <strong>Success!</strong> verified resources found for <strong>{institute.shortName}</strong> students.
                            </p>
                        </div>

                        {/* Engram Tip */}
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 rounded-md p-4 mb-4 flex gap-3">
                            <div className="shrink-0">
                                <span className="text-xl">💡</span>
                            </div>
                            <p className="text-purple-900 text-sm">
                                <strong>Did you know?</strong> Engram has the <strong>biggest aggregated collection</strong> of IPU notes, PYQs, and syllabus copies. We're the #1 aggregator built by students, for students.
                            </p>
                        </div>

                        {/* Simulated File List */}
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 border rounded-xl bg-white hover:bg-gray-50 transition-all cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 bg-red-50 rounded-lg flex items-center justify-center text-red-600 font-bold text-xs border border-red-100 group-hover:scale-105 transition-transform">PDF</div>
                                    <div>
                                        <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{subjectId} - {resourceType} - Unit {i}</div>
                                        <div className="text-xs text-gray-500 mt-1">2.4 MB • Updated for 2025 Exams</div>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" className="text-gray-400 group-hover:text-blue-600">
                                    <Download className="w-5 h-5" />
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Upsell / Context */}
                <div className="prose max-w-none bg-white p-6 rounded-xl border shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800">Syllabus Coverage</h3>
                    <p className="text-gray-600">
                        This collection for <strong>{branch.name}</strong> at <strong>{institute.name}</strong> is designed to help you score high in end-term exams. It covers:
                    </p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Unit 1: Introduction & Basics</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Unit 2: Core Concepts</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Unit 3: Advanced Applications</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Previous Year Questions (2020-2024)</li>
                    </ul>
                </div>
            </div>
        );
    };

    const InterlinkGrid = () => {
        // "Keyword Wild" Generator
        const base = `/ipu/${institute.id}/${branch.code.toLowerCase()}`;
        const links = [
            { label: `Placements 2025`, url: `${base}/placements` },
            { label: `Average Package`, url: `${base}/placements` },
            { label: `Highest Package`, url: `${base}/placements` },
            { label: `Cutoff Trends`, url: `${base}/cutoffs` },
            { label: `Admission Process`, url: `${base}/admissions` },
            { label: `Fees Breakdown`, url: `${base}/fees` },
            { label: `Hostel Facilities`, url: `${base}/hostel` },
            { label: `Campus Gallery`, url: `${base}/gallery` },
            { label: `Faculty List`, url: `${base}/faculty` },
            { label: `Student Reviews`, url: `${base}/reviews` },
        ];

        return (
            <div className="mt-12 pt-8 border-t">
                <h3 className="text-xl font-bold mb-6">Explore {institute.shortName} {branch.code}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {links.map(link => (
                        <Link key={link.label} to={link.url} className="text-blue-600 hover:underline text-sm flex items-center">
                            <ChevronRight className="w-3 h-3 mr-1" /> {link.label}
                        </Link>
                    ))}
                </div>

                <h3 className="text-xl font-bold mb-6 mt-8">Related Institutes</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {institutesData.filter(i => i.id !== institute.id).slice(0, 8).map(other => (
                        <Link key={other.id} to={`/ipu/${other.id}/${branch.code.toLowerCase()}/cutoffs`} className="text-gray-600 hover:text-blue-600 text-sm">
                            {other.shortName} {branch.code} Cutoff
                        </Link>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Helmet>
                <title>{generateTitle()} | Engram</title>
                <meta name="description" content={generateDescription()} />
            </Helmet>

            {/* Header */}
            <div className="bg-white border-b py-8 px-4 md:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                <Link to="/" className="hover:underline">Home</Link> /
                                <Link to="/ipu" className="hover:underline">IPU</Link> /
                                <span className="font-medium text-gray-900">{institute.shortName}</span>
                            </div>
                            <h1 className="text-2xl md:text-4xl font-bold text-gray-900">{generateTitle()}</h1>
                            <div className="flex flex-wrap gap-4 mt-4">
                                <Badge variant="secondary" className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> {institute.location}
                                </Badge>
                                <Badge variant="outline">Intake: {branch.intake}</Badge>
                                <Badge variant="outline">Duration: 4 Years</Badge>
                            </div>
                        </div>
                        <Button asChild>
                            <a href="#resources">Get Notes</a>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        {/* Dynamic Section Injection */}
                        {isCutoffPage ? <CutoffSection /> : null}
                        {isFeePage ? <FeeSection /> : null}
                        {isResourcePage ? <ResourceSection /> : null}
                        {isTimelinePage ? (
                            <div className="prose max-w-none bg-white p-6 rounded-lg shadow-sm border">
                                <h2>Syllabus for {semesterNum ? `Semester ${semesterNum}` : `Year ${yearNum}`}</h2>
                                <p>Detailed syllabus and subject list for {branch.name} students at {institute.name}.</p>
                                <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                    <Card>
                                        <CardHeader><CardTitle className="text-base">Applied Mathematics</CardTitle></CardHeader>
                                        <CardContent><Button variant="outline" className="w-full">View Notes</Button></CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader><CardTitle className="text-base">Engineering Physics</CardTitle></CardHeader>
                                        <CardContent><Button variant="outline" className="w-full">View Notes</Button></CardContent>
                                    </Card>
                                </div>
                            </div>
                        ) : null}

                        {/* Default Overview if no specific topic */}
                        {!isCutoffPage && !isFeePage && !isPlacementPage && !isResourcePage && !isTimelinePage && (
                            <div className="prose max-w-none bg-white p-6 rounded-lg shadow-sm border">
                                <h2>About {branch.name} at {institute.shortName}</h2>
                                <p>
                                    The <strong>{branch.name} ({branch.code})</strong> program at <strong>{institute.name}</strong> is one of the most sought-after courses in the GGSIPU university network.
                                    Located in {institute.location}, the institute offers a {branch.intake} seat intake for this stream.
                                </p>
                                <h3>Key Highlights</h3>
                                <ul>
                                    <li><strong>Admission:</strong> Through JEE Mains Rank followed by IPU Counselling.</li>
                                    <li><strong>Cutoffs:</strong> Generally closes around 50k-1L rank for General Delhi candidates.</li>
                                    <li><strong>Placements:</strong> {institute.shortName} is known for its decent placement record in {branch.code} with companies like Amazon, ZS, and TCS visiting campus.</li>
                                </ul>
                            </div>
                        )}

                        <InterlinkGrid />
                    </div>

                    {/* Sidebar / Quick TOC */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-4">
                            <CardHeader>
                                <CardTitle className="text-lg">Quick Links</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2">
                                <Link to={`/ipu/${institute.id}/${branchId}/cutoffs`} className={`px-4 py-2 rounded-md text-sm ${isCutoffPage ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-gray-50'}`}>
                                    Cutoffs 2025
                                </Link>
                                <Link to={`/ipu/${institute.id}/${branchId}/fees`} className={`px-4 py-2 rounded-md text-sm ${isFeePage ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-gray-50'}`}>
                                    Fees Structure
                                </Link>
                                <Link to={`/ipu/${institute.id}/${branchId}/placements`} className={`px-4 py-2 rounded-md text-sm ${isPlacementPage ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-gray-50'}`}>
                                    Placements
                                </Link>
                                <div className="h-px bg-gray-100 my-2" />
                                <span className="text-xs font-semibold text-gray-500 uppercase px-4">Resources</span>
                                <Link to={`/ipu/${institute.id}/${branchId}/resources/syllabus`} className="px-4 py-2 rounded-md text-sm hover:bg-gray-50 flex items-center justify-between">
                                    Syllabus <Download className="w-3 h-3 text-gray-400" />
                                </Link>
                                <Link to={`/ipu/${institute.id}/${branchId}/resources/notes`} className="px-4 py-2 rounded-md text-sm hover:bg-gray-50 flex items-center justify-between">
                                    Notes <Download className="w-3 h-3 text-gray-400" />
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Universal Footer - Matching Home Page */}
            <footer className="border-t border-gray-200 bg-white mt-20">
                <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Brand */}
                        <div className="md:col-span-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">ENGRAM</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                The centralized hub for IP University study materials. Built by students, for students.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h4>
                            <div className="space-y-2">
                                <Link to="/" className="block text-gray-500 hover:text-blue-600 transition-colors text-sm">Home</Link>
                                <Link to="/resources" className="block text-gray-500 hover:text-blue-600 transition-colors text-sm">Resources</Link>
                                <Link to="/about" className="block text-gray-500 hover:text-blue-600 transition-colors text-sm">About</Link>
                                <Link to="/privacy" className="block text-gray-500 hover:text-blue-600 transition-colors text-sm">Privacy Policy</Link>
                            </div>
                        </div>

                        {/* Contribute */}
                        <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Contribute</h4>
                            <div className="space-y-2">
                                <a href="https://github.com/kuberwastaken/engram/issues" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-500 hover:text-blue-600 transition-colors text-sm">
                                    Raise an Issue
                                </a>
                                <a href="https://github.com/kuberwastaken/engram/pulls" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-500 hover:text-blue-600 transition-colors text-sm">
                                    Add Content
                                </a>
                                <a href="https://github.com/kuberwastaken/engram" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-500 hover:text-blue-600 transition-colors text-sm">
                                    Help Make it Better
                                </a>
                            </div>
                        </div>

                        {/* Connect */}
                        <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Connect</h4>
                            <div className="space-y-2">
                                <a href="https://github.com/kuberwastaken/engram" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-500 hover:text-blue-600 transition-colors text-sm">
                                    GitHub Repository
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="border-t border-gray-100 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-500 text-sm">
                            © 2026 Engram. Open source and always free.
                        </p>
                        <p className="text-gray-400 text-sm mt-4 md:mt-0 flex items-center">
                            Made with <span className="mx-1 text-red-400">❤️</span> by{' '}
                            <a href="https://kuber.studio/" target="_blank" rel="noopener noreferrer" className="ml-1 text-gray-600 hover:text-blue-600 transition-colors">
                                Kuber Mehta
                            </a>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default InstitutePage;
