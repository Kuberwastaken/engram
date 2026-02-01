import React, { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SEO } from '@/components/SEO';
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
import { ChevronRight, Download, ExternalLink, MapPin, BookOpen, FileText, ArrowRight, Loader2 } from 'lucide-react';
import { StarField } from '@/components/StarField';
import { unifiedDataService } from '@/services/unifiedDataService';
import type { SyllabusData } from '@/services/contentFetchingService';
import { generateSectionContent } from '@/utils/pseoContentGenerator';

// Types
type PageType = 'overview' | 'placements' | 'cutoffs' | 'fees' | 'resources' | 'timeline';

const InstitutePage = () => {
    const { instituteId, branchId, topic, subjectId, type } = useParams();
    const navigate = useNavigate();

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

    // SEO Anti-Duplicate Logic: Validate Topic
    // 'resources' is a valid topic, as are the explicit list
    const validTopics = ['placements', 'cutoffs', 'fees', 'reviews', 'hostel', 'admissions', 'resources'];
    const isValidTopic = !topic || validTopics.includes(topic.toLowerCase()) || isTimelinePage || isResourcePage;

    if (!isValidTopic) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
                <h1 className="text-4xl font-bold text-red-500 mb-4">404</h1>
                <p className="text-gray-400 mb-8">Page topic "{topic}" not found for this institute.</p>
                <Button onClick={() => navigate(`/ipu/${instituteId}/${branchId}`)} variant="secondary">
                    Go to Overview
                </Button>
            </div>
        );
    }

    // --- Dynamic Content Generators (Madlibs) ---
    // --- Dynamic Content Generators (Madlibs) ---
    const generateTitle = () => {
        if (isCutoffPage) return `${institute.shortName} ${branch.code} Cutoff 2025 - JEE Mains & IPU CET Ranks`;
        if (isFeePage) return `${institute.shortName} ${branch.code} Fees Structure 2025-2026`;
        if (isPlacementPage) return `${institute.shortName} ${branch.code} Placements 2025 - Average Package & Recruiters`;

        if (topic === 'reviews') return `Student Reviews: ${institute.shortName} ${branch.code} Reality Check - Faculty, Crowd & Life`;
        if (topic === 'hostel') return `${institute.shortName} Hostel & PG Guide: Expenses & Facilities near ${institute.location.split(',')[0]}`;
        if (topic === 'admissions') return `${institute.shortName} ${branch.code} Admission 2025: Process, Eligibility & Documents`;

        if (isTimelinePage && semesterNum) return `B.Tech ${branch.code} Semester ${semesterNum} Syllabus & Subjects at ${institute.shortName}`;
        if (isTimelinePage && yearNum) return `B.Tech ${branch.code} ${yearNum === '1' ? '1st' : yearNum + 'th'} Year Syllabus & Notes - ${institute.shortName}`;
        if (isResourcePage) {
            if (type?.includes('unit')) return `${subjectId} ${type.replace('-', ' ').toUpperCase()} Notes for ${institute.shortName} - PDF Download`;
            return `${subjectId} Notes & Study Material for ${institute.shortName} ${branch.code}`;
        }
        return `${branch.name} at ${institute.name} (${institute.shortName}) - Admission, Fees, Cutoffs`;
    };

    const generateDescription = () => {
        if (isPlacementPage) return `Detailed placement report for ${branch.code} at ${institute.shortName}. Check highest/average packages, top recruiters and internship details for 2025 batch.`;
        if (isCutoffPage) return `Check ${institute.shortName} ${branch.code} Cutoffs for 2025. Delhi vs Outside Delhi rank analysis for JEE Mains to estimate your chances.`;
        if (isFeePage) return `Hidden costs in ${institute.shortName} fee structure? Check detailed 4-year expense breakdown for ${branch.code} including tuition and hostel fees.`;

        if (topic === 'reviews') return `Read honest student reviews for ${branch.name} at ${institute.name}. Know about the crowd, faculty, attendance policy and placements reality before joining.`;
        if (topic === 'hostel') return `Complete guide to hostels and PGs near ${institute.name}, ${institute.location}. Check prices for single/double seater rooms and mess food quality.`;
        if (topic === 'admissions') return `Step-by-step admission guide for ${branch.code} at ${institute.shortName}. JEE Main cutoff requirements, counseling process and document list.`;

        return `Get latest ${topic || 'details'} for ${branch.name} at ${institute.name}, ${institute.location}. Check 2025 Cutoffs, Fees, Placements and download Study Material/Notes for free.`;
    };

    // --- Components ---

    const CutoffSection = () => {
        const instituteId = institute.id.toLowerCase();

        // Handle "named" alias lookups or default
        let cutoffInfo: any = [];
        if (institute.alias) {
            for (const alias of institute.alias) {
                // simple logic to try and find match in cutoffs
                // In reality, cutoffs.json keys match institute IDs usually.
            }
        }

        // Direct match
        if (cutoffsData[instituteId as keyof typeof cutoffsData]) {
            cutoffInfo = cutoffsData[instituteId as keyof typeof cutoffsData];
        }

        return (
            <Card className="mb-8 bg-gray-900/40 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-gray-200">Cutoff Trends (Rank Analysis)</CardTitle>
                </CardHeader>
                <CardContent>
                    {cutoffInfo.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-gray-800 hover:bg-gray-800/50">
                                        <TableHead className="text-gray-400">Program</TableHead>
                                        <TableHead className="text-gray-400">Quota</TableHead>
                                        <TableHead className="text-gray-400">Category</TableHead>
                                        <TableHead className="text-gray-400">Min Rank</TableHead>
                                        <TableHead className="text-gray-400">Max Rank</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {cutoffInfo.slice(0, 10).map((row: any, idx: number) => (
                                        <TableRow key={idx} className="border-gray-800 hover:bg-gray-800/50">
                                            <TableCell className="font-medium text-gray-300">{row.program}</TableCell>
                                            <TableCell className="text-gray-400">{row.quota}</TableCell>
                                            <TableCell className="text-gray-400">{row.category}</TableCell>
                                            <TableCell className="text-gray-400">{row.min}</TableCell>
                                            <TableCell className="text-blue-400 font-bold">{row.max}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="mt-4 text-center">
                                <Button variant="ghost" className="text-blue-400 hover:text-blue-300 hover:bg-gray-800">
                                    View Complete Cutoff List <ChevronRight className="ml-2 w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-400">Detailed cutoff data for {institute.name} is being updated for 2025.</p>
                            <Button className="mt-4" variant="outline" onClick={() => window.open('https://ipu.admissions.nic.in', '_blank')}>
                                Check Official Website <ExternalLink className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                    )}
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
                <Card className="mb-8 bg-gray-900/40 border-gray-800 backdrop-blur-sm">
                    <CardHeader><CardTitle className="text-gray-200">Annual Fee Structure (Estimates)</CardTitle></CardHeader>
                    <CardContent>
                        <div className="bg-yellow-900/20 border-l-4 border-yellow-600 p-4 mb-4">
                            <p className="text-yellow-200 text-sm">
                                <strong>Note:</strong> Official 2025 fee notification for {institute.shortName} is pending. Below is the indicative structure based on GGSIPU norms.
                            </p>
                        </div>
                        <div className="prose prose-invert">
                            <ul className="list-disc pl-5 text-gray-400">
                                {(feeInfo as any).breakdown.map((item: string, idx: number) => <li key={idx}>{item}</li>)}
                            </ul>
                            <p className="mt-4 font-medium text-gray-200">Expected Total: ₹1.40 Lakhs - ₹1.70 Lakhs / Annum</p>
                        </div>
                    </CardContent>
                </Card>
            );
        }

        return (
            <Card className="mb-8 bg-gray-900/40 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-gray-200">Annual Fee Structure {instituteId === 'usict' ? '(USS)' : ''}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="bg-blue-900/20 border-l-4 border-blue-500 p-4 mb-4">
                        <p className="text-blue-200 text-sm">
                            <strong>Verified:</strong> {(feeInfo as any).note || "Official GGSIPU Fee Structure."}
                        </p>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-gray-800 hover:bg-gray-800/50">
                                <TableHead className="text-gray-400">Academic Year</TableHead>
                                <TableHead className="text-gray-400">Tuition Fee</TableHead>
                                <TableHead className="text-gray-400">Total Fee</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Object.entries((feeInfo as any)).filter(([key]) => key.includes('-')).map(([year, amount]: [string, any]) => (
                                <TableRow key={year} className="border-gray-800 hover:bg-gray-800/50">
                                    <TableCell className="text-gray-300">{year}</TableCell>
                                    <TableCell className="text-gray-300">₹{amount.tuition.toLocaleString()}</TableCell>
                                    <TableCell className="font-bold text-blue-400">₹{amount.total.toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        );
    };

    const ResourceSection = () => {
        const [syllabusContent, setSyllabusContent] = React.useState<SyllabusData | null>(null);
        const [loading, setLoading] = React.useState(false);

        // Map pSEO resource type to Subject Page Tab ID
        const typeMapping: Record<string, string> = {
            'notes': 'notes',
            'syllabus': 'syllabus',
            'pyq': 'pyqs',
            'books': 'books',
            'unit-1': 'syllabus',
            'unit-2': 'syllabus',
            'unit-3': 'syllabus',
            'unit-4': 'syllabus'
        };

        const targetTab = typeMapping[type || ''] || 'syllabus';
        const resourceTitle = type ? type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Resources';
        const isSyllabus = targetTab === 'syllabus';

        // Construct Deep Link
        const deepLink = `/subject/${subjectId}?branch=${branch.code}&semester=${semesterNum ? `sem-${semesterNum}` : 'sem-1'}&tab=${targetTab}`;

        // Fetch Syllabus Data if applicable
        React.useEffect(() => {
            if (isSyllabus && !syllabusContent) {
                setLoading(true);
                const fetch = async () => {
                    // Try to get real data
                    const data = await unifiedDataService.fetchSyllabusData(branch.code, semesterNum ? `sem-${semesterNum}` : 'sem-1', subjectId as string);
                    setSyllabusContent(data);
                    setLoading(false);
                };
                fetch();
            }
        }, [isSyllabus, subjectId, branch.code, semesterNum]);

        // Case 1: Real Syllabus Content Found (Text Mode)
        if (isSyllabus && syllabusContent && !loading) {
            const units = Object.entries(syllabusContent).filter(([key]) => !key.startsWith('_'));

            // If we actually have text units
            if (units.length > 0) {
                return (
                    <div className="space-y-6">
                        <div className="bg-blue-900/20 border-l-4 border-blue-500 p-4 mb-8">
                            <p className="text-blue-200 text-sm">
                                <strong>Official Syllabus:</strong> Below is the verified syllabus for <strong>{subjectId}</strong>.
                            </p>
                        </div>

                        {units.map(([unitKey, unitContent], index) => {
                            let contentToDisplay: string;
                            if (typeof unitContent === 'string') {
                                contentToDisplay = unitContent;
                            } else if (unitContent && typeof unitContent === 'object' && 'content' in unitContent) {
                                contentToDisplay = (unitContent as any).content;
                            } else {
                                return null;
                            }

                            return (
                                <Card key={unitKey} className="bg-gray-900/40 border-gray-800 backdrop-blur-sm mb-6">
                                    <CardHeader className="bg-gray-800/20 border-b border-gray-800/50 pb-3">
                                        <CardTitle className="text-xl text-blue-300 font-mono tracking-tight">{unitKey}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed font-mono whitespace-pre-line">
                                            {contentToDisplay}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}

                        {/* Engram Tip at Bottom */}
                        <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-md p-6 mt-8 flex gap-4 items-center">
                            <div className="shrink-0 text-3xl">💡</div>
                            <div className="text-purple-200 text-sm leading-relaxed">
                                <h4 className="font-bold text-purple-100 mb-1">Looking for Notes?</h4>
                                <p>Engram has the biggest aggregated collection of IPU notes, PYQs, and books. We're the #1 aggregator built by students, for students.</p>
                                <Button size="sm" variant="secondary" className="mt-3" onClick={() => navigate(deepLink)}>
                                    View Subject Notes <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                );
            }
        }

        // Case 2: Loading State
        if (isSyllabus && loading) {
            return (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
                    <p className="text-gray-400">Fetching latest syllabus...</p>
                </div>
            );
        }

        // Case 3: Notes / PYQs / Books OR Fallback (No Syllabus Text Found)
        return (
            <div className="space-y-6">
                <Card className="border-blue-900/50 bg-blue-900/10 backdrop-blur-sm shadow-md">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-xl text-blue-100 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-blue-400" />
                            {subjectId} {resourceTitle}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Engram Tip */}
                        <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-md p-4 mb-4 flex gap-3">
                            <div className="shrink-0">
                                <span className="text-xl">💡</span>
                            </div>
                            <p className="text-purple-200 text-sm leading-relaxed">
                                <strong>Did you know?</strong> Engram has the <strong>biggest aggregated collection</strong> of IPU notes, PYQs, and syllabus copies. We're the #1 aggregator built by students, for students.
                            </p>
                        </div>

                        <div className="text-center py-8">
                            <h3 className="text-lg font-semibold text-white mb-2">Access Full Repository</h3>
                            <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
                                Click below to view the official verified {resourceTitle} for {subjectId} on the main Engram dashboard.
                            </p>

                            <Button
                                size="lg"
                                className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-lg shadow-blue-900/20"
                                onClick={() => navigate(deepLink)}
                            >
                                <ExternalLink className="w-5 h-5" />
                                Open {resourceTitle} on Engram
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Upsell / Context */}
                <div className="prose prose-invert max-w-none bg-gray-900/40 p-6 rounded-xl border border-gray-800 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-200">Why use Engram?</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-400">
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Zero Ads & Trackers</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Open Source Platform</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Community Verified Notes</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Direct Download Links</li>
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
            { label: `Student Reviews`, url: `${base}/reviews` },
        ];

        return (
            <div className="mt-12 pt-8 border-t border-gray-800">
                <h3 className="text-xl font-bold mb-6 text-gray-200">Explore {institute.shortName} {branch.code}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {links.map(link => (
                        <Link key={link.label} to={link.url} className="text-blue-400 hover:text-blue-300 hover:underline text-sm flex items-center transition-colors">
                            <ChevronRight className="w-3 h-3 mr-1" /> {link.label}
                        </Link>
                    ))}
                </div>

                <h3 className="text-xl font-bold mb-6 mt-8 text-gray-200">Related Institutes</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {institutesData.filter(i => i.id !== institute.id).slice(0, 8).map(other => (
                        <Link key={other.id} to={`/ipu/${other.id}/${branch.code.toLowerCase()}/cutoffs`} className="text-gray-400 hover:text-blue-400 text-sm">
                            {other.shortName} {branch.code} Cutoff
                        </Link>
                    ))}
                </div>
            </div>
        );
    };

    // Use the SEO component for better meta tags
    const pageTitle = generateTitle();
    const pageDesc = generateDescription();

    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <SEO
                title={pageTitle}
                description={pageDesc}
                keywords={[
                    institute.name, institute.shortName, branch.name, branch.code,
                    'IPU', 'GGSIPU', 'Cutoffs', 'Fees', 'Placements', 'Syllabus', 'Notes'
                ]}
                url={window.location.pathname}
            />
            <StarField />
            <Helmet>
                <link rel="canonical" href={window.location.href} />
            </Helmet>

            {/* Navigation Bar */}
            <div className="border-b border-gray-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <Link to="/" className="font-bold text-xl tracking-tight text-white flex items-center gap-2">
                        ENGRAM
                    </Link>
                    <div className="text-sm text-gray-400 hidden md:block">
                        {institute.name}
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="bg-gradient-to-b from-blue-900/20 to-black py-12 border-b border-gray-800">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                    <Badge variant="secondary" className="mb-4 bg-blue-900/30 text-blue-300 hover:bg-blue-900/40 border-blue-800/50">
                        {institute.shortName} • {branch.code} • {new Date().getFullYear()}
                    </Badge>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        {pageTitle}
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        {pageDesc}
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                    {/* Full Width Content */}
                    <div className="mx-auto max-w-4xl w-full">
                        {/* Dynamic Section Injection */}
                        {isCutoffPage ? <CutoffSection /> : null}
                        {isFeePage ? <FeeSection /> : null}
                        {isResourcePage ? <ResourceSection /> : null}
                        {isTimelinePage ? (
                            <div className="prose prose-invert max-w-none bg-gray-900/20 p-6 rounded-lg shadow-sm border border-gray-800">
                                <h2 className="text-gray-100">Syllabus for {semesterNum ? `Semester ${semesterNum}` : `Year ${yearNum}`}</h2>
                                <p className="text-gray-400">
                                    Access the complete syllabus, notes, and study materials for {branch.name} {semesterNum ? `Semester ${semesterNum}` : `Year ${yearNum}`} at {institute.shortName}.
                                </p>
                                <div className="mt-6 flex flex-col gap-3">
                                    <Button className="w-full justify-between" variant="secondary" onClick={() => navigate(`/branch/${branch.code}/semester/${semesterNum ? `sem-${semesterNum}` : `year-${yearNum}`}`)}>
                                        View Full Semester Resources <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ) : null}

                        {!isCutoffPage && !isFeePage && !isResourcePage && !isTimelinePage && (
                            <Card className="bg-gray-900/20 border-gray-800 mb-12">
                                <CardHeader><CardTitle className="text-gray-200">Overview</CardTitle></CardHeader>
                                <CardContent>
                                    <p className="text-gray-400 leading-relaxed text-lg">
                                        Welcome to the <strong>ultimate aggregated resource hub</strong> for <strong>{branch.name}</strong> at <strong>{institute.name}</strong>.
                                        Engram is built by IPU students to provide what the official websites don't: <strong>Real verified notes, honest placement stats, and transparent fee structures.</strong>
                                    </p>
                                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Button variant="outline" className="h-28 flex flex-col items-center justify-center gap-2 border-gray-700 hover:bg-gray-800 hover:text-white bg-gray-900/40" onClick={() => navigate('fees')}>
                                            <span className="text-2xl font-bold text-green-400">Fees</span>
                                            <span className="text-sm text-gray-400">2025 Structure</span>
                                        </Button>
                                        <Button variant="outline" className="h-28 flex flex-col items-center justify-center gap-2 border-gray-700 hover:bg-gray-800 hover:text-white bg-gray-900/40" onClick={() => navigate('cutoffs')}>
                                            <span className="text-2xl font-bold text-purple-400">Cutoffs</span>
                                            <span className="text-sm text-gray-400">JEE Rank Analysis</span>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Detailed Unique SEO Content */}
                        {(() => {
                            // --- Helpers ---
                            const getTier = (id: string) => {
                                const t1 = ['usict', 'mait', 'msit', 'usar'];
                                const t2 = ['bpit', 'bvcoe', 'vips', 'adgitm', 'gtbit', 'jims'];
                                return t1.includes(id) ? 1 : t2.includes(id) ? 2 : 3;
                            };
                            const tier = getTier(institute.id);

                            // Call the Generator
                            const generatedContent = generateSectionContent(
                                institute,
                                branch,
                                topic,
                                tier,
                                cutoffsData,
                                feesData,
                                navigate
                            );

                            if (generatedContent) {
                                return generatedContent;
                            }

                            // 5. GENERIC / OVERVIEW (Fallback)
                            const locationVibe = institute.location.includes("Rohini") ? "Located in the student hub of Rohini, surrounded by hangout spots." :
                                institute.location.includes("Dwarka") ? "Situated in the lush green, planned sub-city of Dwarka." :
                                    `Strategically located in ${institute.location}.`;
                            // Re-calc deep link
                            const deepLink = `/subject/${subjectId || 'mathematics-1'}?branch=${branch.code}&semester=${semesterNum ? `sem-${semesterNum}` : 'sem-1'}&tab=notes`;

                            return (
                                <div className="mt-16 prose prose-invert prose-lg max-w-none">
                                    <h2 className="text-3xl font-bold text-blue-100 border-b border-gray-800 pb-4 mb-8">
                                        {institute.shortName} {branch.code}: 2025 Comprehensive Review
                                    </h2>

                                    <h3 className="text-blue-200 mt-8">Why Choose {institute.shortName} for {branch.code}?</h3>
                                    <p className="text-gray-300">
                                        <strong>{institute.name}</strong> is a standout choice for engineering in Delhi.
                                        {tier === 1 ? " With its excellent placement record and competitive peer group, it rivals lower NITs." :
                                            " It offers a balanced college life with decent placement opportunities for hardworking students."}
                                    </p>

                                    <h3 className="text-blue-200 mt-8">Campus Vibe & Infrastructure</h3>
                                    <p className="text-gray-300">
                                        {locationVibe} The campus is Wi-Fi enabled and features decent labs for {branch.code}.
                                        {tier === 1 ? " You will find a very active coding culture here with multiple societies like IEEE and ACM." :
                                            " Societies are active, though mostly student-driven."}
                                    </p>

                                    <div className="mt-12 p-8 bg-blue-900/10 border border-blue-800/30 rounded-xl text-center">
                                        <h4 className="text-xl font-bold text-white mb-4">Start Your Preparation</h4>
                                        <p className="text-gray-400 mb-6">
                                            Don't wait for classes to start. Get a headstart with verified notes for {institute.shortName}.
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                            <Button size="lg" className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate(deepLink)}>
                                                Access {branch.code} Notes
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        <InterlinkGrid />
                    </div>
                </div>
            </div>

            {/* Universal Footer - Matching Home Page */}
            <footer className="border-t border-gray-800 bg-gray-900/30 mt-20 backdrop-blur-lg">
                <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
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
                                <Link to="/" className="block text-gray-400 hover:text-blue-400 transition-colors text-sm">Home</Link>
                                <Link to="/resources" className="block text-gray-400 hover:text-blue-400 transition-colors text-sm">Resources</Link>
                                <Link to="/about" className="block text-gray-400 hover:text-blue-400 transition-colors text-sm">About</Link>
                                <Link to="/privacy" className="block text-gray-400 hover:text-blue-400 transition-colors text-sm">Privacy Policy</Link>
                            </div>
                        </div>

                        {/* Contribute */}
                        <div>
                            <h4 className="text-lg font-semibold text-white mb-4">Contribute</h4>
                            <div className="space-y-2">
                                <a href="https://github.com/kuberwastaken/engram/issues" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-400 hover:text-blue-400 transition-colors text-sm">
                                    Raise an Issue
                                </a>
                                <a href="https://github.com/kuberwastaken/engram/pulls" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-400 hover:text-blue-400 transition-colors text-sm">
                                    Add Content
                                </a>
                                <a href="https://github.com/kuberwastaken/engram" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-400 hover:text-blue-400 transition-colors text-sm">
                                    Help Make it Better
                                </a>
                            </div>
                        </div>

                        {/* Connect */}
                        <div>
                            <h4 className="text-lg font-semibold text-white mb-4">Connect</h4>
                            <div className="space-y-2">
                                <a href="https://github.com/kuberwastaken/engram" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-400 hover:text-blue-400 transition-colors text-sm">
                                    GitHub Repository
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-500 text-sm">
                            © 2026 Engram. Open source and always free.
                        </p>
                        <p className="text-gray-400 text-sm mt-4 md:mt-0 flex items-center">
                            Made with <span className="mx-1 text-red-500">❤️</span> by{' '}
                            <a href="https://kuber.studio/" target="_blank" rel="noopener noreferrer" className="ml-1 text-white hover:text-blue-400 transition-colors">
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
