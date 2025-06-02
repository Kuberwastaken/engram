// Browser-compatible Enhanced Subject Mapper
// Core mapping logic without Node.js dependencies

/**
 * Enhanced Subject Mapper Class (Browser Compatible)
 * Handles mapping between StudyX full names and DotNotes abbreviations
 */
export class EnhancedSubjectMapper {
    private directMappings: { [key: string]: string };
    private reverseMappings: { [key: string]: string };
    private patternMappings: Array<{ pattern: RegExp; dotNotesCode: string }>;
    private keywordMappings: { [key: string]: string[] };
    private branchContext: { [key: string]: string[] };

    constructor() {
        // Direct mappings - exact known relationships
        this.directMappings = {
            // Basic Sciences (SEM1-2)
            'applied-chemistry': 'APC',
            'applied-mathematics-1': 'APM1', 
            'applied-mathematics-2': 'APM2',
            'applied-physics-1': 'APP1',
            'applied-physics-2': 'APP2',
            'basic-chemistry': 'APC', // Alternative name
            
            // Core Programming
            'programming-in-c': 'PIC',
            'programming-in-java': 'PIJ',
            'programming-in-python': 'PIP',
            'cpp-programming': 'OOPS', // C++ often mapped to OOPS
            'object-oriented-programming-using-c-p-p': 'OOPS',
            
            // Core CS Subjects
            'data-structures': 'DS',
            'database-management-system': 'DBMS',
            'operating-systems': 'OS',
            'computer-networks': 'CN',
            'artificial-intelligence': 'AI',
            'compiler-design': 'CD',
            'design-and-analysis-of-algorithm': 'DAA',
            'theory-of-computation': 'TOC',
            'software-engineering': 'SE',
            
            // Mathematics & Computational
            'discrete-mathematics': 'DM',
            'computational-methods': 'CM',
            'probability-statistics-and-linear-programming': 'PSLA',
            
            // Electronics & Communications
            'digital-logic-and-computer-design': 'DLCD',
            'digital-signal-and-image-processing': 'DSP',
            'analog-and-digital-communications': 'ADC',
            'microprocessors-and-microcontrollers': 'MPMC',
            'advanced-microprocessors-arm-and-interfacing': 'MPMC',
            
            // Engineering Fundamentals
            'engineering-mechanics': 'EM',
            'environmental-studies': 'EVS',
            'communications-skills': 'CS',
            'technical-writing': 'TW',
            'human-values-and-ethics': 'HVPE',
            'indian-constitution': 'IC',
            'indian-knowledge-system': 'IKS',
            'engineering-graphics': 'EG',
            'workshop-practice': 'WP',
            'workshop-technology': 'WP', // Alternative name
            
            // Advanced Topics
            'advanced-java-programming': 'ADVJ',
            'visual-basic-dot-net': 'VBNET',
            'web-technologies': 'WET',
            'data-warehousing-and-data-mining': 'DMD',
            
            // Additional Common Mappings
            'electronic-circuits': 'ECMC',
            'electrical-engineering': 'EE',
            'machine-learning': 'ML',
            'network-analysis-and-synthesis': 'NAS',
            'power-electronics': 'PE',
            'electromagnetic-theory': 'EMT',
            'manufacturing-processes': 'MP',
            'material-science': 'MIE',
            'advanced-computer-architecture': 'ACA'
        };

        // Reverse mappings for better DotNotes → StudyX resolution
        this.reverseMappings = {
            'EG': 'engineering-graphics',
            'WP': 'workshop-practice', 
            'WT': 'workshop-technology',
            'MP': 'manufacturing-processes',
            'MIE': 'material-science',
            'PE': 'power-electronics',
            'EMT': 'electromagnetic-theory',
            'NAS': 'network-analysis-and-synthesis',
            'ML': 'machine-learning',
            'EE': 'electrical-engineering',
            'ECMC': 'electronic-circuits',
            'ACA': 'advanced-computer-architecture',
            'ES': 'environmental-studies', // Alternative abbreviation
            'UHV': 'universal-human-values',
            'MAM': 'mathematics-and-modeling',
            'CRST': 'computer-system-and-technology',
            'SSMDA': 'signals-systems-and-data-analytics',
            'MWT': 'mobile-and-wireless-technology',
            'IIOT': 'industrial-internet-of-things',
            'IICT': 'information-and-communication-technology',
            'SPM': 'software-project-management',
            'SNS': 'social-networks-and-security',
            'TLWAD': 'technical-writing-and-documentation'
        };

        // Pattern-based mappings for fuzzy matching
        this.patternMappings = [
            // Programming patterns
            { pattern: /programming.*c(?!sharp|pp)/i, dotNotesCode: 'PIC' },
            { pattern: /programming.*java/i, dotNotesCode: 'PIJ' },
            { pattern: /programming.*python/i, dotNotesCode: 'PIP' },
            { pattern: /c\+\+|cpp|object.*oriented/i, dotNotesCode: 'OOPS' },
            
            // Mathematics patterns
            { pattern: /applied.*math.*1/i, dotNotesCode: 'APM1' },
            { pattern: /applied.*math.*2/i, dotNotesCode: 'APM2' },
            { pattern: /discrete.*math/i, dotNotesCode: 'DM' },
            { pattern: /probability.*statistics/i, dotNotesCode: 'PSLA' },
            
            // Physics/Chemistry patterns
            { pattern: /applied.*physics.*1/i, dotNotesCode: 'APP1' },
            { pattern: /applied.*physics.*2/i, dotNotesCode: 'APP2' },
            { pattern: /applied.*chemistry|basic.*chemistry/i, dotNotesCode: 'APC' },
            
            // Core CS patterns
            { pattern: /data.*structure/i, dotNotesCode: 'DS' },
            { pattern: /database.*management/i, dotNotesCode: 'DBMS' },
            { pattern: /operating.*system/i, dotNotesCode: 'OS' },
            { pattern: /computer.*network/i, dotNotesCode: 'CN' },
            { pattern: /artificial.*intelligence/i, dotNotesCode: 'AI' },
            { pattern: /compiler.*design/i, dotNotesCode: 'CD' },
            { pattern: /algorithm.*design|design.*algorithm/i, dotNotesCode: 'DAA' },
            { pattern: /theory.*computation/i, dotNotesCode: 'TOC' },
            { pattern: /software.*engineering/i, dotNotesCode: 'SE' },
            
            // Electronics patterns
            { pattern: /digital.*logic/i, dotNotesCode: 'DLCD' },
            { pattern: /microprocessor/i, dotNotesCode: 'MPMC' },
            { pattern: /digital.*signal/i, dotNotesCode: 'DSP' },
            
            // General patterns
            { pattern: /environmental.*studies/i, dotNotesCode: 'EVS' },
            { pattern: /communication.*skill/i, dotNotesCode: 'CS' },
            { pattern: /technical.*writing/i, dotNotesCode: 'TW' },
            { pattern: /human.*values/i, dotNotesCode: 'HVPE' },
            { pattern: /indian.*constitution/i, dotNotesCode: 'IC' },
            { pattern: /web.*tech/i, dotNotesCode: 'WET' }
        ];

        // Keyword-based scoring for advanced matching
        this.keywordMappings = {
            'APC': ['chemistry', 'chemical', 'applied'],
            'APM1': ['mathematics', 'math', 'applied', '1'],
            'APM2': ['mathematics', 'math', 'applied', '2'],
            'APP1': ['physics', 'applied', '1'],
            'APP2': ['physics', 'applied', '2'],
            'PIC': ['programming', 'c', 'language'],
            'PIJ': ['programming', 'java', 'language'],
            'PIP': ['programming', 'python', 'language'],
            'DS': ['data', 'structures', 'structure'],
            'DBMS': ['database', 'management', 'system'],
            'OS': ['operating', 'system', 'systems'],
            'CN': ['computer', 'networks', 'network'],
            'AI': ['artificial', 'intelligence'],
            'CD': ['compiler', 'design'],
            'DAA': ['algorithm', 'analysis', 'design'],
            'TOC': ['theory', 'computation'],
            'SE': ['software', 'engineering'],
            'DM': ['discrete', 'mathematics'],
            'CM': ['computational', 'methods'],
            'OOPS': ['object', 'oriented', 'cpp', 'c++'],
            'DLCD': ['digital', 'logic', 'computer', 'design'],
            'MPMC': ['microprocessor', 'microcontroller'],
            'DSP': ['digital', 'signal', 'processing'],
            'EVS': ['environmental', 'studies'],
            'CS': ['communication', 'skills'],
            'TW': ['technical', 'writing'],
            'HVPE': ['human', 'values', 'ethics'],
            'IC': ['indian', 'constitution'],
            'IKS': ['indian', 'knowledge', 'system'],
            'WET': ['web', 'technologies'],
            'ADC': ['analog', 'digital', 'communication'],
            'ADVJ': ['advanced', 'java'],
            'VBNET': ['visual', 'basic', 'net'],
            'DMD': ['data', 'warehousing', 'mining']
        };

        // Branch-specific context for disambiguation
        this.branchContext = {
            'CSE': ['programming', 'software', 'algorithm', 'data', 'computer'],
            'ECE': ['electronics', 'communication', 'signal', 'digital', 'analog'],
            'EEE': ['electrical', 'power', 'machines', 'electronics'],
            'MECH': ['mechanical', 'thermal', 'machines', 'design'],
            'CIVIL': ['structural', 'construction', 'materials', 'design'],
            'IT': ['information', 'technology', 'systems', 'networks'],
            'AIDS': ['artificial', 'intelligence', 'data', 'science'],
            'AIML': ['artificial', 'intelligence', 'machine', 'learning']
        };
    }

    /**
     * Main mapping function - finds the best DotNotes code for a StudyX subject
     */
    mapStudyXToDotNotes(studyXSubject, branch = null, semester = null) {
        const normalizedSubject = this.normalizeSubjectName(studyXSubject);
        
        // 1. Try direct mapping first
        const directMatch = this.directMappings[normalizedSubject];
        if (directMatch) {
            return {
                dotNotesCode: directMatch,
                confidence: 1.0,
                method: 'direct'
            };
        }

        // 2. Try pattern-based matching
        const patternMatch = this.findPatternMatch(studyXSubject);
        if (patternMatch) {
            return {
                dotNotesCode: patternMatch,
                confidence: 0.9,
                method: 'pattern'
            };
        }

        // 3. Try keyword-based fuzzy matching
        const fuzzyMatch = this.findFuzzyMatch(studyXSubject, branch);
        if (fuzzyMatch) {
            return fuzzyMatch;
        }

        // 4. No match found
        return {
            dotNotesCode: null,
            confidence: 0.0,
            method: 'none',
            suggestion: this.generateMapping(studyXSubject)
        };
    }    /**
     * Reverse mapping - finds StudyX subjects for a DotNotes code
     * Enhanced to handle abbreviations better
     */
    mapDotNotesToStudyX(dotNotesCode, availableStudyXSubjects = []) {
        // 1. Try direct reverse mapping first
        const reverseMatch = this.reverseMappings[dotNotesCode];
        if (reverseMatch) {
            return {
                studyXSubjects: [reverseMatch],
                confidence: 1.0,
                method: 'reverse-direct'
            };
        }

        // 2. Find direct mappings where this dotNotesCode appears
        const directMatches = Object.entries(this.directMappings)
            .filter(([_, code]) => code === dotNotesCode)
            .map(([subject, _]) => subject);

        if (directMatches.length > 0) {
            return {
                studyXSubjects: directMatches,
                confidence: 1.0,
                method: 'direct'
            };
        }

        // 3. If we have available StudyX subjects, try fuzzy matching
        if (availableStudyXSubjects.length > 0) {
            const fuzzyMatches = availableStudyXSubjects
                .map(subject => ({
                    subject,
                    score: this.calculateMatchScore(subject, dotNotesCode)
                }))
                .filter(match => match.score > 0.6)
                .sort((a, b) => b.score - a.score)
                .slice(0, 3);

            if (fuzzyMatches.length > 0) {
                return {
                    studyXSubjects: fuzzyMatches.map(m => m.subject),
                    confidence: fuzzyMatches[0].score,
                    method: 'fuzzy'
                };
            }
        }

        // 4. Try pattern-based reverse lookup
        const patternMatch = this.findReversePatternMatch(dotNotesCode);
        if (patternMatch) {
            return {
                studyXSubjects: [patternMatch],
                confidence: 0.8,
                method: 'pattern-reverse'
            };
        }

        return {
            studyXSubjects: [],
            confidence: 0.0,
            method: 'none'
        };
    }

    /**
     * Normalize subject names for consistent comparison
     */
    normalizeSubjectName(subject) {
        return subject
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }    /**
     * Find pattern-based matches
     */
    findPatternMatch(subject) {
        for (const mapping of this.patternMappings) {
            if (mapping.pattern.test(subject)) {
                return mapping.dotNotesCode;
            }
        }
        return null;
    }

    /**
     * Find reverse pattern matches for DotNotes codes
     */
    findReversePatternMatch(dotNotesCode) {
        // Common engineering abbreviations that should map to typical subjects
        const reversePatterns = {
            'EG': 'engineering-graphics',
            'WP': 'workshop-practice',
            'WT': 'workshop-technology',
            'MP': 'manufacturing-processes',
            'MIE': 'material-science-engineering',
            'PE': 'power-electronics',
            'EMT': 'electromagnetic-theory',
            'NAS': 'network-analysis-synthesis',
            'ML': 'machine-learning',
            'EE': 'electrical-engineering',
            'ECMC': 'electronic-circuits',
            'ACA': 'advanced-computer-architecture',
            'ES': 'environmental-studies',
            'UHV': 'universal-human-values',
            'MAM': 'mathematics-modeling',
            'CRST': 'computer-systems-technology',
            'SSMDA': 'signals-systems-data-analytics',
            'MWT': 'mobile-wireless-technology',
            'IIOT': 'industrial-internet-things',
            'IICT': 'information-communication-technology',
            'SPM': 'software-project-management',
            'SNS': 'social-networks-security',
            'TLWAD': 'technical-writing-documentation'
        };

        return reversePatterns[dotNotesCode] || null;
    }

    /**
     * Find fuzzy matches using keyword scoring
     */
    findFuzzyMatch(studyXSubject, branch = null) {
        const subjectWords = this.extractKeywords(studyXSubject);
        let bestMatch = null;
        let bestScore = 0;

        for (const [dotNotesCode, keywords] of Object.entries(this.keywordMappings)) {
            let score = this.calculateKeywordScore(subjectWords, keywords);
            
            // Boost score if branch context matches
            if (branch && this.branchContext[branch]) {
                const branchBoost = this.calculateKeywordScore(
                    subjectWords, 
                    this.branchContext[branch]
                ) * 0.2;
                score += branchBoost;
            }

            if (score > bestScore && score > 0.6) {
                bestScore = score;
                bestMatch = dotNotesCode;
            }
        }

        if (bestMatch) {
            return {
                dotNotesCode: bestMatch,
                confidence: bestScore,
                method: 'fuzzy'
            };
        }

        return null;
    }

    /**
     * Extract meaningful keywords from subject name
     */
    extractKeywords(subject) {
        return subject
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 2)
            .filter(word => !['and', 'the', 'for', 'using', 'with', 'in'].includes(word));
    }

    /**
     * Calculate keyword matching score
     */
    calculateKeywordScore(subjectWords, targetKeywords) {
        const matches = subjectWords.filter(word => 
            targetKeywords.some(keyword => 
                word.includes(keyword) || keyword.includes(word)
            )
        );
        
        return matches.length / Math.max(subjectWords.length, targetKeywords.length);
    }

    /**
     * Calculate overall match score between subject and DotNotes code
     */
    calculateMatchScore(studyXSubject, dotNotesCode) {
        const keywords = this.keywordMappings[dotNotesCode] || [];
        const subjectWords = this.extractKeywords(studyXSubject);
        return this.calculateKeywordScore(subjectWords, keywords);
    }

    /**
     * Generate a suggested mapping for unmapped subjects
     */
    generateMapping(studyXSubject) {
        const words = this.extractKeywords(studyXSubject);
        const abbreviation = words
            .slice(0, 3)
            .map(word => word.charAt(0).toUpperCase())
            .join('');
        
        return {
            suggested: abbreviation,
            reason: `Generated from first letters of: ${words.slice(0, 3).join(', ')}`
        };
    }
}
