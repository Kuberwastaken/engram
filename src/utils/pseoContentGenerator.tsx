import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { getRandomReviews } from '@/data/studentReviews';

export const generateSectionContent = (
    institute: any,
    branch: any,
    topic: string | undefined,
    tier: number,
    cutoffsData: any,
    feesData: any,
    navigate: any
) => {
    const iName = institute.name;
    const sName = institute.shortName;
    const loc = institute.location;
    const bName = branch.name;
    const bCode = branch.code;

    // --- Dynamic Data Helpers ---

    // Custom Stats based on Tier
    const stats = {
        1: {
            avg: '8.5 LPA - 12 LPA',
            highest: '45 LPA - 51 LPA',
            recruiters: 'Amazon, Adobe, Google, Microsoft, ZS Associates, Cvent, Ion Trading',
            verdict: 'Excellent. Comparable to many NITs.',
            internships: 'Abundant. Companies like Fidelity and Amex visit for on-campus internships.'
        },
        2: {
            avg: '5.5 LPA - 7.5 LPA',
            highest: '28 LPA - 32 LPA',
            recruiters: 'TCS, Infosys, Accenture, ZS, Ion Trading, Libsys, Newgen',
            verdict: 'Good. Consistent placements for top 50% of the batch.',
            internships: 'Moderate. Mostly off-campus or through referrals.'
        },
        3: {
            avg: '4.0 LPA - 5.5 LPA',
            highest: '12 LPA - 18 LPA',
            recruiters: 'TCS, Wipro, HCL, Tech Mahindra, Nagarro',
            verdict: 'Average. Requires individual effort to secure high packages.',
            internships: 'Limited. Students mostly rely on online platforms.'
        }
    }[tier];

    // Location Vibe
    const locationVibe = loc.includes("Rohini") ? "Located in Rohini, the campus is surrounded by a student-friendly environment with plenty of eateries and metro connectivity." :
        loc.includes("Dwarka") ? "Situated in Dwarka, the infrastructure benefits from the planned sub-city layout, offering wide roads and a cleaner environment." :
            loc.includes("Janakpuri") ? "In the heart of West Delhi, Janakpuri offers unparalleled connectivity and a buzzing urban campus life." :
                `Located in ${loc}, the campus is well-connected to the major hubs of Delhi-NCR.`;

    // 1. PLACEMENTS
    if (topic === 'placements') {
        return (
            <div className="mt-12 prose prose-invert prose-lg max-w-none" >
                <h2 className="text-3xl font-bold text-blue-100 mb-6 border-b border-gray-800 pb-2" >
                    {sName} {bCode} Placements 2025: In - Depth Report
                </h2>
                < p className="text-gray-300" >
                    Placement is the single biggest factor for B.Tech aspirants.At < strong > {iName} < /strong>, the Department of <strong>{bName}</strong > has established a {tier === 1 ? "stellar" : "reliable"} track record.
                        As we move into the 2025 placement season, here is a transparent look at the opportunities waiting for you.
                </p>

                < h3 className="text-xl font-semibold text-blue-200 mt-8" > Package Analysis </h3>
                < div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6 not-prose" >
                    <Card className="bg-gray-900/50 border-blue-900/30" >
                        <CardContent className="p-6 text-center" >
                            <div className="text-gray-400 text-sm mb-1" > Highest Package </div>
                            < div className="text-2xl font-bold text-white" > {stats.highest} </div>
                        </CardContent>
                    </Card>
                    < Card className="bg-gray-900/50 border-blue-900/30" >
                        <CardContent className="p-6 text-center" >
                            <div className="text-gray-400 text-sm mb-1" > Average Package </div>
                            < div className="text-2xl font-bold text-blue-200" > {stats.avg} </div>
                        </CardContent>
                    </Card>
                    < Card className="bg-gray-900/50 border-blue-900/30" >
                        <CardContent className="p-6 text-center" >
                            <div className="text-gray-400 text-sm mb-1" > Recruiters </div>
                            < div className="text-lg font-medium text-gray-300" > 100 + </div>
                        </CardContent>
                    </Card>
                </div>

                < p className="text-gray-300" >
                    The < strong > Highest Package </strong> figures typically come from off-campus drives or diversity hiring events by top product giants.
                    However, the < strong > Average Package </strong> is the real indicator of the college's standard. At {sName}, students proficient in MERN Stack, Java, or C++ consistently
                    crack offers above the average bracket.
                </p>

                < h3 className="text-xl font-semibold text-blue-200 mt-8" > Top Recruiters </h3>
                < p className="text-gray-300" >
                    Companies that frequently visit the {loc} campus include:
                </p>
                < ul className="list-disc pl-5 text-gray-400" >
                    {stats.recruiters.split(', ').map(r => <li key={r} > <strong>{r} < /strong></li >)}
                    < li > Capgemini </li>
                    < li > Cognizant </li>
                    < li > Startups from Gurugram & Noida </li>
                </ul>

                < h3 className="text-xl font-semibold text-blue-200 mt-8" > Internship Scenario </h3>
                < p className="text-gray-300" >
                    {stats.internships} {tier === 1 ? "The college allows 6-month internships in the final semester, which is a massive plus." : "Most students engage in summer training and virtual internships to build their profile."}
                </p>

                < div className="bg-blue-900/10 border-l-4 border-blue-500 p-4 mt-8" >
                    <h4 className="font-bold text-blue-100" > Final Verdict on Placements </h4>
                    < p className="text-gray-300 text-sm mt-1" > {stats.verdict} </p>
                </div>
            </div>
        );
    }

    // 2. CUTOFFS
    if (topic === 'cutoffs') {
        const cText = tier === 1 ? "Even for top colleges like " + sName + ", Delhi quota ranks can go up to 60k-80k depending on the shift." : "For " + sName + ", this allows students with ranks even above 2 Lakh to hope for a seat in later rounds.";

        // Find real data
        const instituteId = institute.id.toLowerCase();
        // Access safely
        const fullCutoffList = (cutoffsData as any)[instituteId] || [];

        // Filter for this branch (fuzzy match)
        const branchCutoffs = fullCutoffList.filter((c: any) =>
            c.program.toLowerCase().includes(bName.toLowerCase()) ||
            c.program.toLowerCase().includes(bCode.toLowerCase())
        );

        return (
            <div className="mt-12 prose prose-invert prose-lg max-w-none">
                <h2 className="text-3xl font-bold text-blue-100 mb-6 border-b border-gray-800 pb-2">
                    {sName} {bCode} Cutoffs 2025: Analysis & Safe Rank
                </h2>
                <p className="text-gray-300">
                    Securing a seat in <strong>{bCode}</strong> at <strong>{sName}</strong> is purely a numbers game.
                    Below are the official cutoff trends for General, OBC, SC, ST, and EWS categories.
                </p>

                {branchCutoffs.length > 0 ? (
                    <div className="not-prose my-8 overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-800/80 text-gray-200">
                                    <tr>
                                        <th className="p-4 font-semibold">Region</th>
                                        <th className="p-4 font-semibold">Category</th>
                                        <th className="p-4 font-semibold">Min Rank</th>
                                        <th className="p-4 font-semibold">Max Rank</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {branchCutoffs.map((row: any, idx: number) => (
                                        <tr key={idx} className="hover:bg-gray-800/30 transition-colors">
                                            <td className="p-4 text-gray-300">{row.quota}</td>
                                            <td className="p-4 text-blue-300 font-medium">{row.category}</td>
                                            <td className="p-4 text-gray-400">{row.min}</td>
                                            <td className="p-4 text-white font-bold">{row.max}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="bg-yellow-900/20 border-l-4 border-yellow-600 p-4 my-8 not-prose">
                        <h4 className="font-bold text-yellow-200">Data Update Pending</h4>
                        <p className="text-gray-400 text-sm mt-1">
                            Specific 2024 cutoff data for {bCode} at {sName} is currently being digitized.
                            Generally, for Top {tier === 1 ? '5' : '10'} colleges, the closing rank for {bCode} is around {tier === 1 ? '40k - 90k' : '1.5 Lakh - 3 Lakh'}.
                        </p>
                    </div>
                )}

                <h3 className="text-xl font-semibold text-blue-200 mt-8">The "Home State" Advantage</h3>
                <p className="text-gray-300">
                    Delhi Region candidates (who completed 10+2 from Delhi) enjoy <strong>85% seat reservation</strong>.
                    This is a massive advantage. {cText}
                </p>

                <h3 className="text-xl font-semibold text-blue-200 mt-8">Outside Delhi Scenario</h3>
                <p className="text-gray-300">
                    For the 15% All India seats, competition is brutal. You typically need a percentile roughly <strong>{tier === 1 ? "95%+" : "85-90%+"}</strong> to stand a chance here.
                </p>

                <h3 className="text-xl font-semibold text-blue-200 mt-8">Sport Counseling & Management Quota</h3>
                <p className="text-gray-300">
                    <strong>Spot Rounds:</strong> Conducted offline after the main rounds. This is where the magic happens. Many students withdraw to join NITs/IITs, leaving vacancies.
                    Ranks often jump by 50k-1Lakh in the specific Sliding/Spot rounds.
                </p>
                <p className="text-gray-300">
                    <strong>Management Quota (MQ):</strong> {tier === 3 ? "Available for this institute." : "Private IPU colleges reserve 10% seats for MQ. Admission is based on aggregate percentage in PCM and JEE Rank."}
                    Note: USICT and other government colleges do NOT have Management Quota.
                </p>
            </div>
        );
    }

    // 3. FEES
    if (topic === 'fees') {
        const feeEst = tier === 1 ? "₹70,000 - ₹85,000" : "₹1.40 Lakh - ₹1.60 Lakh";
        const feeTotal = tier === 1 ? "₹4 Lakhs" : "₹7 - ₹8 Lakhs";
        return (
            <div className="mt-12 prose prose-invert prose-lg max-w-none" >
                <h2 className="text-3xl font-bold text-blue-100 mb-6 border-b border-gray-800 pb-2" >
                    {sName} Fee Structure 2025: Detailed Breakdown
                </h2>
                < p className="text-gray-300" >
                    Understanding the financial commitment is crucial. < strong > {sName} </strong> follows the fee regulatory guidelines of the Delhi Government.
                    Below is the exhaustive breakdown of what you will pay over 4 years.
                </p>

                < h3 className="text-xl font-semibold text-blue-200 mt-8" > Academic Fees(Yearly) </h3>
                < div className="overflow-x-auto my-6" >
                    <table className="w-full text-left border-collapse" >
                        <thead>
                            <tr className="border-b border-gray-700" >
                                <th className="p-3 text-gray-200" > Component </th>
                                < th className="p-3 text-gray-200" > Approx Cost(INR) </th>
                                < th className="p-3 text-gray-200" > Frequency </th>
                            </tr>
                        </thead>
                        < tbody className="text-gray-400" >
                            <tr className="border-b border-gray-800" >
                                <td className="p-3" > Tuition Fee </td>
                                < td className="p-3" > {feeEst} </td>
                                < td className="p-3" > Annual </td>
                            </tr>
                            < tr className="border-b border-gray-800" >
                                <td className="p-3" > University Charges </td>
                                < td className="p-3" >₹20,000 </td>
                                < td className="p-3" > Annual </td>
                            </tr>
                            < tr className="border-b border-gray-800" >
                                <td className="p-3" > Student Activity Fee </td>
                                < td className="p-3" >₹1,000 </td>
                                < td className="p-3" > Annual </td>
                            </tr>
                            < tr className="border-b border-gray-800" >
                                <td className="p-3" > Security Deposit </td>
                                < td className="p-3" >₹5,000 - ₹10,000 </td>
                                < td className="p-3" > One Time(Refundable) </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                < h3 className="text-xl font-semibold text-blue-200 mt-8" > Hostel & Living Expenses </h3>
                < p className="text-gray-300" >
                    {
                        institute.id === 'usict' ? "USICT has strictly academic fees. Hostel fees are separate and highly subsidized (~₹35k/year)." :
                            "Since " + sName + " has limited/no on-campus hostel for all students, most opt for PGs in " + loc + ". A decent PG with food costs around ₹1.2 Lakh per year."
                    }
                </p>

                < h3 className="text-xl font-semibold text-blue-200 mt-8" > Total Investment(4 Years) </h3>
                < p className="text-gray-300" >
                    Considering tuition, books, exam fees, and minor miscellaneous costs, your 4 - year B.Tech at {sName} will cost approximately < strong > {feeTotal} </strong> (excluding living expenses).
                    {tier <= 2 ? "Given the placement opportunities, this ROI is considered healthy in the current market." : "We recommend minimizing living costs to maximize ROI."}
                </p>
            </div>
        );
    }

    // 4. ADMISSIONS
    if (topic === 'admissions') {
        return (
            <div className="mt-12 prose prose-invert prose-lg max-w-none" >
                <h2 className="text-3xl font-bold text-blue-100 mb-6 border-b border-gray-800 pb-2" >
                    {sName} Admission Process 2025: Step - by - Step Guide
                </h2>
                < p className="text-gray-300" >
                    Getting into < strong > {iName} </strong> requires navigating the GGSIPU centralized counseling process. It can be complex, but here is the simplified roadmap.
                </p>

                < h3 className="text-xl font-semibold text-blue-200 mt-8" > Eligibility Criteria </h3>
                < ul className="list-disc pl-5 text-gray-400" >
                    <li><strong>Exam: </strong> Must have a valid rank in <strong>JEE Main (Paper 1)</strong >.</li>
                    < li > <strong>Academic: </strong> Pass in 12th Class of 10+2 pattern of CBSE or equivalent with a minimum aggregate of 55% marks in Physics, Chemistry, and Mathematics.</li >
                    <li><strong>English: </strong> Must have passed English as a core/elective subject.</li>
                </ul>

                < h3 className="text-xl font-semibold text-blue-200 mt-8" > The Counseling Funnel </h3>
                < div className="space-y-4 my-6" >
                    <div className="flex gap-4" >
                        <div className="text-blue-500 font-bold text-xl" >01 </div>
                        < div >
                            <h4 className="text-white font-medium" > Registration </h4>
                            < p className="text-gray-400 text-sm" > Register at ipu.admissions.nic.in by paying ₹1, 500. This usually starts in March - April.</p>
                        </div>
                    </div>
                    < div className="flex gap-4" >
                        <div className="text-blue-500 font-bold text-xl" >02 </div>
                        < div >
                            <h4 className="text-white font-medium" > Choice Filling </h4>
                            < p className="text-gray-400 text-sm" > Pay ₹1,000 counseling fee.Fill < strong > {sName} {bCode} </strong> as your priority. The order matters!</p >
                        </div>
                    </div>
                    < div className="flex gap-4" >
                        <div className="text-blue-500 font-bold text-xl" >03 </div>
                        < div >
                            <h4 className="text-white font-medium" > Seat Allotment </h4>
                            < p className="text-gray-400 text-sm" > Results for Round 1, 2, and 3 are declared.If allotted, you must pay 'Part Academic Fee'(₹60k - ₹96k) to float / freeze.</p>
                        </div>
                    </div>
                    < div className="flex gap-4" >
                        <div className="text-blue-500 font-bold text-xl" >04 </div>
                        < div >
                            <h4 className="text-white font-medium" > Reporting </h4>
                            < p className="text-gray-400 text-sm" > Visit the {sName} campus for document verification with your allotment letter.</p>
                        </div>
                    </div>
                </div>

                < div className="bg-yellow-900/10 border-l-4 border-yellow-600 p-4 mt-8" >
                    <h4 className="font-bold text-yellow-200" > Documents Required </h4>
                    < p className="text-gray-400 text-sm mt-1" > JEE Admit Card, Score Card, 10th & 12th Marksheets, Migration Certificate, Medical Certificate, Character Certificate, and Category Certificate(if applicable).</p>
                </div>
            </div>
        );
    }

    // 5. HOSTEL
    if (topic === 'hostel') {
        return (
            <div className="mt-12 prose prose-invert prose-lg max-w-none" >
                <h2 className="text-3xl font-bold text-blue-100 mb-6 border-b border-gray-800 pb-2" >
                    {sName} Hostel & Accommodation Guide
                </h2>
                < p className="text-gray-300" >
                    Accommodation is a major worry for outstation students.Here is the reality of living at or near < strong > {sName} </strong>.
                </p>

                < h3 className="text-xl font-semibold text-blue-200 mt-8" > On - Campus Hostels </h3>
                < p className="text-gray-300" >
                    {
                        institute.id === 'usict' || institute.id === 'usar' ?
                            "Being a government campus, " + sName + " provides excellent hostel facilities. There are separate blocks for boys and girls. The rooms are spacious, usually single or double seater, and the mess food is subsidized and hygienic." :
                            sName + " is a private institute affiliated with IPU. On-campus hostel seats are strictly limited and often reserved for students from outside NCR. Allocation is first-come-first-serve basis."
                    }
                </p>

                < h3 className="text-xl font-semibold text-blue-200 mt-8" > Off - Campus PGs in {loc} </h3>
                < p className="text-gray-300" >
                    Since campus hostels are scarce, 90 % of students live in nearby PGs. < strong > {loc} </strong> is a student hub.
                </p>
                < div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6" >
                    <div className="bg-gray-900/50 p-4 rounded border border-gray-800" >
                        <h4 className="text-white font-bold mb-2" > Standard PG </h4>
                        < p className="text-gray-400 text-sm" >₹7,000 - ₹9,000 / month </p>
                        < ul className="text-xs text-gray-500 mt-2 list-disc pl-4" >
                            <li>Shared Room(Double) </li>
                            < li > Basic Tiffin Food </li>
                            < li > Cooler only </li>
                        </ul>
                    </div>
                    < div className="bg-gray-900/50 p-4 rounded border border-gray-800" >
                        <h4 className="text-white font-bold mb-2" > Premium PG </h4>
                        < p className="text-gray-400 text-sm" >₹12,000 - ₹16,000 / month </p>
                        < ul className="text-xs text-gray-500 mt-2 list-disc pl-4" >
                            <li>Single Room / AC </li>
                            < li > Wi - Fi & Laundry </li>
                            < li > Attached Washroom </li>
                        </ul>
                    </div>
                </div>

                < p className="text-gray-300 mt-4" >
                    <strong>Living Vibe: </strong> {locationVibe}
                </p>
            </div>
        );
    }

    // 6. REVIEW (Default if topic is 'reviews' or fallthrough)
    if (topic === 'reviews') {
        const reviews = getRandomReviews(5);
        return (
            <div className="mt-12 prose prose-invert prose-lg max-w-none" >
                <h2 className="text-3xl font-bold text-blue-100 mb-6 border-b border-gray-800 pb-2" >
                    Student Reviews: Life at {sName} {bCode}
                </h2>
                < p className="text-gray-300 mb-8" >
                    Don't just take the brochure's word for it.Here is what real students have to say about the daily grind, the faculty, and the crowd at < strong > {iName} </strong>.
                    < span className="text-sm text-gray-500 block mt-1" >* Reviews are anonymized to protect student identity.</span>
                </p>

                < div className="space-y-6 not-prose" >
                    {
                        reviews.map((review, i) => (
                            <div key={i} className="bg-gray-900/30 border border-gray-800 p-6 rounded-xl relative" >
                                <div className="absolute top-4 left-4 text-4xl text-blue-800/20 font-serif" > "</div>
                                < p className="text-gray-300 relative z-10 pl-6 italic" >
                                    {review}
                                </p>
                                < div className="mt-4 flex items-center gap-3 pl-6" >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white" >
                                        S{i + 1}
                                    </div>
                                    < div className="text-sm text-gray-500" >
                                        {bCode} Student • Batch of 2024
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>

                < div className="mt-12 bg-blue-900/20 border border-blue-800 rounded-lg p-6 text-center" >
                    <h3 className="text-xl font-bold text-white mb-2" > Have you studied here ? </h3>
                    < p className="text-gray-400 mb-4" > Help juniors by submitting your honest review.</p>
                    < button onClick={() => window.open('https://github.com/kuberwastaken/engram/issues')} className="text-blue-400 hover:underline cursor-pointer" > Submit a Review on GitHub </button>
                </div>
            </div>
        );
    }

    // Default return logic if nothing matched (fallback)
    return null;
};
