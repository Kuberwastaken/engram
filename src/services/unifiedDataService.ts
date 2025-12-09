// Unified Data Service that combines StudyX, DotNotes, FifteenFourteen, and UnifiedContent sources
import { studyXDataService, GoogleDriveFile as BaseGoogleDriveFile, SubjectData } from './studyXDataService';
import { dotNotesDataService } from './dotNotesDataService';
import { fifteenFourteenDataService } from './fifteenFourteenDataService';
import { consolidatedDataService } from './consolidatedDataService';
import { unifiedContentService } from './unifiedContentService';
import { EnhancedSubjectMapper } from '../utils/subjectMapper';
import { type SyllabusData, type VideoData } from './contentFetchingService';

// Enhanced GoogleDriveFile with source attribution
export interface GoogleDriveFile extends BaseGoogleDriveFile {
  source?: 'StudyX' | 'DotNotes' | 'FifteenFourteen' | 'UnifiedContent' | 'kamati' | string;
}

export type { SubjectData };

class UnifiedDataService {
  private subjectMapper: EnhancedSubjectMapper;

  constructor() {
    this.subjectMapper = new EnhancedSubjectMapper();
  }  /**
   * Check if Kamati notes are enabled
   */
  public get isKamatiEnabled(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('kamati_notes_enabled') === 'true';
  }

  /**
   * Toggle Kamati notes visibility
   */
  public toggleKamatiNotes(): boolean {
    if (typeof window === 'undefined') return false;
    const currentState = this.isKamatiEnabled;
    const newState = !currentState;
    localStorage.setItem('kamati_notes_enabled', String(newState));
    return newState;
  }

  /**
   * Find matching subject names across sources using enhanced intelligent mapping
   */
  private findMatchingSubjects(
    studyXSubjects: string[],
    dotNotesSubjects: string[],
    fifteenFourteenSubjects: string[],
    branch?: string
  ): Map<string, { studyX?: string, dotNotes?: string, fifteenFourteen?: string, confidence?: number }> {
    const subjectMap = new Map<string, { studyX?: string, dotNotes?: string, fifteenFourteen?: string, confidence?: number }>();
    // Map StudyX subjects
    for (const studyXSubject of studyXSubjects) {
      const mapping = this.subjectMapper.mapStudyXToDotNotes(studyXSubject, branch);
      let dotNotesCode: string | undefined;
      let fifteenFourteenCode: string | undefined;
      let confidence = 0;
      if (mapping.dotNotesCode && dotNotesSubjects.includes(mapping.dotNotesCode)) {
        dotNotesCode = mapping.dotNotesCode;
        confidence = mapping.confidence || 0;
      }
      if (mapping.dotNotesCode && fifteenFourteenSubjects.includes(mapping.dotNotesCode)) {
        fifteenFourteenCode = mapping.dotNotesCode;
        confidence = Math.max(confidence, mapping.confidence || 0);
      }
      const key = `${studyXSubject}::${dotNotesCode || ''}::${fifteenFourteenCode || ''}`;
      subjectMap.set(key, {
        studyX: studyXSubject,
        dotNotes: dotNotesCode,
        fifteenFourteen: fifteenFourteenCode,
        confidence
      });
    }
    // Add DotNotes subjects not mapped
    for (const dotNotesSubject of dotNotesSubjects) {
      const alreadyMapped = Array.from(subjectMap.values()).some(mapping => mapping.dotNotes === dotNotesSubject);
      if (!alreadyMapped) {
        const reverseMapping = this.subjectMapper.mapDotNotesToStudyX(dotNotesSubject, studyXSubjects);
        if (reverseMapping.studyXSubjects.length > 0) {
          const bestStudyXMatch = reverseMapping.studyXSubjects[0];
          const key = `${bestStudyXMatch}::${dotNotesSubject}`;
          if (!subjectMap.has(key)) {
            subjectMap.set(key, {
              studyX: bestStudyXMatch,
              dotNotes: dotNotesSubject,
              confidence: reverseMapping.confidence
            });
          }
        } else {
          subjectMap.set(dotNotesSubject, {
            dotNotes: dotNotesSubject,
            confidence: 0
          });
        }
      }
    }
    // Add FifteenFourteen subjects not mapped
    for (const fifteenFourteenSubject of fifteenFourteenSubjects) {
      const alreadyMapped = Array.from(subjectMap.values()).some(mapping => mapping.fifteenFourteen === fifteenFourteenSubject);
      if (!alreadyMapped) {
        const reverseMapping = this.subjectMapper.mapDotNotesToStudyX(fifteenFourteenSubject, studyXSubjects);
        if (reverseMapping.studyXSubjects.length > 0) {
          const bestStudyXMatch = reverseMapping.studyXSubjects[0];
          const key = `${bestStudyXMatch}::::${fifteenFourteenSubject}`;
          if (!subjectMap.has(key)) {
            subjectMap.set(key, {
              studyX: bestStudyXMatch,
              fifteenFourteen: fifteenFourteenSubject,
              confidence: reverseMapping.confidence
            });
          }
        } else {
          subjectMap.set(fifteenFourteenSubject, {
            fifteenFourteen: fifteenFourteenSubject,
            confidence: 0
          });
        }
      }
    }
    return subjectMap;
  }

  /**
   * Add source attribution to materials
   */
  private addSourceToMaterials(materials: BaseGoogleDriveFile[], source: string): GoogleDriveFile[] {
    return materials.map(material => ({
      ...material,
      source: source as any
    }));
  }

  /**
   * Apply material type specific filtering rules for all three sources
   */
  private applyMaterialTypeRules(
    studyXMaterials: Record<string, BaseGoogleDriveFile[]>,
    dotNotesMaterials: Record<string, BaseGoogleDriveFile[]>,
    fifteenFourteenMaterials: Record<string, BaseGoogleDriveFile[]>
  ): Record<string, GoogleDriveFile[]> {
    return {
      syllabus: this.addSourceToMaterials(dotNotesMaterials.syllabus || [], 'DotNotes'),
      books: [
        ...this.addSourceToMaterials(studyXMaterials.books || [], 'StudyX'),
        ...this.addSourceToMaterials(dotNotesMaterials.books || [], 'DotNotes'),
        ...this.addSourceToMaterials(fifteenFourteenMaterials.books || [], 'FifteenFourteen')
      ],
      akash: [
        ...this.addSourceToMaterials(studyXMaterials.akash || [], 'StudyX'),
        ...this.addSourceToMaterials(dotNotesMaterials.akash || [], 'DotNotes'),
        ...this.addSourceToMaterials(fifteenFourteenMaterials.akash || [], 'FifteenFourteen')
      ],
      notes: [
        ...[
          ...this.addSourceToMaterials(studyXMaterials.notes || [], 'StudyX'),
          ...this.addSourceToMaterials(dotNotesMaterials.notes || [], 'DotNotes'),
          ...this.addSourceToMaterials(fifteenFourteenMaterials.notes || [], 'FifteenFourteen')
        ].sort((a, b) => (a.name || '').localeCompare(b.name || ''))
      ],
      pyqs: [
        ...this.addSourceToMaterials(studyXMaterials.pyqs || [], 'StudyX'),
        ...this.addSourceToMaterials(dotNotesMaterials.pyqs || [], 'DotNotes'),
        ...this.addSourceToMaterials(fifteenFourteenMaterials.pyqs || [], 'FifteenFourteen')
      ],
      lab: [
        ...this.addSourceToMaterials(studyXMaterials.lab || [], 'StudyX'),
        ...this.addSourceToMaterials(dotNotesMaterials.lab || [], 'DotNotes'),
        ...this.addSourceToMaterials(fifteenFourteenMaterials.lab || [], 'FifteenFourteen')
      ],
      videos: [
        ...(studyXMaterials.videos || []).map(m => ({ ...m })),
        ...(dotNotesMaterials.videos || []).map(m => ({ ...m })),
        ...(fifteenFourteenMaterials.videos || []).map(m => ({ ...m }))
      ]
    };
  }

  /**
   * Apply material type rules for all four sources including UnifiedContent
   */
  private applyMaterialTypeRulesWithUnifiedContent(
    studyXMaterials: Record<string, BaseGoogleDriveFile[]>,
    dotNotesMaterials: Record<string, BaseGoogleDriveFile[]>,
    fifteenFourteenMaterials: Record<string, BaseGoogleDriveFile[]>,
    unifiedContentMaterials: Record<string, BaseGoogleDriveFile[]>
  ): Record<string, GoogleDriveFile[]> {
    // Toggle to disable Kamati notes (set to true to re-enable)
    const ENABLE_KAMATI_NOTES = this.isKamatiEnabled;

    // Helper to preserve existing source or add new source
    // This allows materials from UnifiedContent.json to keep their specific sources
    // (kamati, google-drive-sem3, etc.) while providing a fallback for unattributed materials
    const preserveOrAddSource = (materials: BaseGoogleDriveFile[], fallbackSource: string): GoogleDriveFile[] => {
      return materials
        .filter(material => ENABLE_KAMATI_NOTES || (material as any).source !== 'kamati')
        .map(material => {
          const existingSource = (material as any).source;

          if (existingSource && existingSource !== 'UnifiedContent') {
            // Preserve any specific source (kamati, google-drive-sem3, studyx, dotnotes, etc.)
            return { ...material, source: existingSource as any };
          }
          // Use fallback for materials without a specific source
          return { ...material, source: fallbackSource as any };
        });
    };

    return {
      syllabus: [
        ...this.addSourceToMaterials(dotNotesMaterials.syllabus || [], 'DotNotes'),
        ...preserveOrAddSource(unifiedContentMaterials.syllabus || [], 'UnifiedContent')
      ],
      books: [
        ...this.addSourceToMaterials(studyXMaterials.books || [], 'StudyX'),
        ...this.addSourceToMaterials(dotNotesMaterials.books || [], 'DotNotes'),
        ...this.addSourceToMaterials(fifteenFourteenMaterials.books || [], 'FifteenFourteen'),
        ...preserveOrAddSource(unifiedContentMaterials.books || [], 'UnifiedContent')
      ],
      akash: [
        ...this.addSourceToMaterials(studyXMaterials.akash || [], 'StudyX'),
        ...this.addSourceToMaterials(dotNotesMaterials.akash || [], 'DotNotes'),
        ...this.addSourceToMaterials(fifteenFourteenMaterials.akash || [], 'FifteenFourteen'),
        ...preserveOrAddSource(unifiedContentMaterials.akash || [], 'UnifiedContent')
      ],
      notes: [
        ...[
          ...this.addSourceToMaterials(studyXMaterials.notes || [], 'StudyX'),
          ...this.addSourceToMaterials(dotNotesMaterials.notes || [], 'DotNotes'),
          ...this.addSourceToMaterials(fifteenFourteenMaterials.notes || [], 'FifteenFourteen'),
          ...preserveOrAddSource(unifiedContentMaterials.notes || [], 'UnifiedContent')
        ].sort((a, b) => (a.name || '').localeCompare(b.name || ''))
      ],
      pyqs: [
        ...this.addSourceToMaterials(studyXMaterials.pyqs || [], 'StudyX'),
        ...this.addSourceToMaterials(dotNotesMaterials.pyqs || [], 'DotNotes'),
        ...this.addSourceToMaterials(fifteenFourteenMaterials.pyqs || [], 'FifteenFourteen'),
        ...preserveOrAddSource(unifiedContentMaterials.pyqs || [], 'UnifiedContent')
      ],
      lab: [
        ...this.addSourceToMaterials(studyXMaterials.lab || [], 'StudyX'),
        ...this.addSourceToMaterials(dotNotesMaterials.lab || [], 'DotNotes'),
        ...this.addSourceToMaterials(fifteenFourteenMaterials.lab || [], 'FifteenFourteen'),
        ...preserveOrAddSource(unifiedContentMaterials.lab || [], 'UnifiedContent')
      ],
      videos: [
        ...(studyXMaterials.videos || []).map(m => ({ ...m })),
        ...(dotNotesMaterials.videos || []).map(m => ({ ...m })),
        ...(fifteenFourteenMaterials.videos || []).map(m => ({ ...m })),
        ...preserveOrAddSource(unifiedContentMaterials.videos || [], 'UnifiedContent')
      ],
      viva: [
        ...preserveOrAddSource(unifiedContentMaterials.viva || [], 'UnifiedContent')
      ],
      midsem: [
        ...preserveOrAddSource(unifiedContentMaterials.midsem || [], 'UnifiedContent')
      ]
    };
  }

  private getEmptyOrganizedMaterials(): Record<string, GoogleDriveFile[]> {
    return {
      notes: [],
      pyqs: [],
      books: [],
      lab: [],
      akash: [],
      syllabus: [],
      videos: []
    };
  }

  /**
   * Get all available branches from all three sources
   */
  async getAvailableBranches(): Promise<string[]> {
    try {
      const [studyXBranches, dotNotesBranches, fifteenFourteenBranches] = await Promise.all([
        studyXDataService.getAvailableBranches(),
        dotNotesDataService.getAvailableBranches(),
        fifteenFourteenDataService.getAvailableBranches()
      ]);
      const allBranches = new Set([
        ...studyXBranches,
        ...dotNotesBranches,
        ...fifteenFourteenBranches
      ]);
      return Array.from(allBranches).sort();
    } catch (error) {
      console.error('[Unified] Error getting available branches:', error);
      return [];
    }
  }

  /**
   * Get available semesters for a branch from all three sources
   */
  async getAvailableSemesters(branchName: string): Promise<string[]> {
    try {
      const [studyXSemesters, dotNotesSemesters, fifteenFourteenSemesters] = await Promise.all([
        studyXDataService.getAvailableSemesters(branchName),
        dotNotesDataService.getAvailableSemesters(branchName),
        fifteenFourteenDataService.getAvailableSemesters(branchName)
      ]);
      const allSemesters = new Set([
        ...studyXSemesters,
        ...dotNotesSemesters,
        ...fifteenFourteenSemesters
      ]);
      return Array.from(allSemesters).sort();
    } catch (error) {
      console.error(`[Unified] Error getting available semesters for ${branchName}:`, error);
      return [];
    }
  }

  /**
   * Get available subjects for a branch and semester from all four sources with deduplication
   */
  async getAvailableSubjects(branchName: string, semester: string): Promise<string[]> {
    try {
      const [studyXSubjects, dotNotesSubjects, fifteenFourteenSubjects, unifiedContentSubjects] = await Promise.all([
        studyXDataService.getAvailableSubjects(branchName, semester),
        dotNotesDataService.getAvailableSubjects(branchName, semester),
        fifteenFourteenDataService.getAvailableSubjects(branchName, semester),
        unifiedContentService.getAvailableSubjects(branchName, semester)
      ]);

      console.log(`[Unified] Subject counts - StudyX: ${studyXSubjects.length}, DotNotes: ${dotNotesSubjects.length}, FifteenFourteen: ${fifteenFourteenSubjects.length}, UnifiedContent: ${unifiedContentSubjects.length}`);

      // If UnifiedContent has subjects for this branch/semester, prioritize it
      if (unifiedContentSubjects.length > 0) {
        console.log(`[Unified] Using UnifiedContent subjects for ${branchName} ${semester}:`, unifiedContentSubjects);
        return unifiedContentSubjects.sort();
      }

      // Fallback to existing logic for other sources
      const subjectMap = this.findMatchingSubjects(studyXSubjects, dotNotesSubjects, fifteenFourteenSubjects, branchName);

      // Deduplicate by normalized subject name
      const normalizedSet = new Map<string, string>();
      Array.from(subjectMap.values())
        .map(mapping => mapping.studyX || mapping.dotNotes || mapping.fifteenFourteen || '')
        .filter(name => name.length > 0)
        .forEach(name => {
          const normalized = this.subjectMapper.normalizeSubjectName(name);
          if (!normalizedSet.has(normalized)) {
            normalizedSet.set(normalized, name);
          }
        });
      return Array.from(normalizedSet.values()).sort();
    } catch (error) {
      console.error(`[Unified] Error getting available subjects for ${branchName} ${semester}:`, error);
      return [];
    }
  }

  /**
   * Get all materials organized by type for a subject from all four sources
   */
  async getOrganizedMaterials(branchName: string, semester: string, subjectName: string): Promise<Record<string, GoogleDriveFile[]>> {
    // Toggle to disable Kamati notes (set to true to re-enable)
    const ENABLE_KAMATI_NOTES = this.isKamatiEnabled;

    try {
      // First check if UnifiedContent has this subject
      const unifiedContentMaterials = await unifiedContentService.getOrganizedMaterials(branchName, semester, subjectName);

      if (unifiedContentMaterials) {
        console.log(`[Unified] Found materials in UnifiedContent for ${subjectName}, using those`);

        // Filter out kamati notes if disabled
        if (!ENABLE_KAMATI_NOTES) {
          const filteredMaterials: Record<string, GoogleDriveFile[]> = {};
          for (const [key, materials] of Object.entries(unifiedContentMaterials)) {
            filteredMaterials[key] = materials.filter((m: any) => m.source !== 'kamati');
          }
          return filteredMaterials;
        }

        // Return materials with their original sources from UnifiedContent.json
        // (kamati, google-drive-sem3, or any other future sources)
        return unifiedContentMaterials as Record<string, GoogleDriveFile[]>;
      }

      // Fallback to existing multi-source logic
      const [studyXSubjects, dotNotesSubjects, fifteenFourteenSubjects] = await Promise.all([
        studyXDataService.getAvailableSubjects(branchName, semester),
        dotNotesDataService.getAvailableSubjects(branchName, semester),
        fifteenFourteenDataService.getAvailableSubjects(branchName, semester)
      ]);

      const subjectMap = this.findMatchingSubjects(studyXSubjects, dotNotesSubjects, fifteenFourteenSubjects, branchName);

      let mappingInfo = subjectMap.get(subjectName);
      if (!mappingInfo) {
        for (const [key, value] of subjectMap) {
          if (value.studyX === subjectName || value.dotNotes === subjectName || value.fifteenFourteen === subjectName || key === subjectName) {
            mappingInfo = value;
            break;
          }
        }
      }

      const studyXSubjectName = mappingInfo?.studyX;
      const dotNotesSubjectName = mappingInfo?.dotNotes;
      const fifteenFourteenSubjectName = mappingInfo?.fifteenFourteen;

      const materialPromises: Promise<Record<string, BaseGoogleDriveFile[]>>[] = [
        studyXSubjectName
          ? studyXDataService.getOrganizedMaterials(branchName, semester, studyXSubjectName)
          : Promise.resolve(this.getEmptyOrganizedMaterials()),
        dotNotesSubjectName
          ? dotNotesDataService.getOrganizedMaterials(branchName, semester, dotNotesSubjectName)
          : Promise.resolve(this.getEmptyOrganizedMaterials()),
        fifteenFourteenSubjectName
          ? fifteenFourteenDataService.getOrganizedMaterials(branchName, semester, fifteenFourteenSubjectName)
          : Promise.resolve(this.getEmptyOrganizedMaterials())
      ];

      const [studyXMaterials, dotNotesMaterials, fifteenFourteenMaterials] = (await Promise.all(materialPromises));

      // Apply material type rules for three sources
      const result = this.applyMaterialTypeRules(studyXMaterials, dotNotesMaterials, fifteenFourteenMaterials);
      return result;
    } catch (error) {
      console.error('[Unified] Error getting organized materials:', error);
      return this.getEmptyOrganizedMaterials();
    }
  }

  /**
   * Get materials for a specific subject from all three sources (compatible with existing interface)
   */
  async getSubjectMaterials(branchName: string, semester: string, subjectName: string): Promise<SubjectData | null> {
    try {
      const [studyXResult, dotNotesResult, fifteenFourteenResult] = await Promise.all([
        studyXDataService.getSubjectMaterials(branchName, semester, subjectName),
        dotNotesDataService.getSubjectMaterials(branchName, semester, subjectName),
        fifteenFourteenDataService.getSubjectMaterials(branchName, semester, subjectName)
      ]);
      if (!studyXResult && !dotNotesResult && !fifteenFourteenResult) return null;
      // Merge folderDetails from all sources
      const folderDetails = [
        ...(studyXResult?.folderDetails || []),
        ...(dotNotesResult?.folderDetails || []),
        ...(fifteenFourteenResult?.folderDetails || [])
      ];
      return {
        name: studyXResult?.name || dotNotesResult?.name || fifteenFourteenResult?.name || subjectName,
        folders: folderDetails.length,
        files: folderDetails.reduce((sum, f) => sum + (f.files || 0), 0),
        folderDetails
      };
    } catch (error) {
      console.error('[Unified] Error getting subject materials:', error);
      return null;
    }
  }

  /**
   * Search subjects across all branches and semesters in all three sources
   */
  async searchSubjects(query: string): Promise<Array<{ branch: string, semester: string, subject: string, source: string }>> {
    try {
      const [studyXResults, dotNotesResults, fifteenFourteenResults] = await Promise.all([
        studyXDataService.searchSubjects(query),
        dotNotesDataService.searchSubjects(query),
        fifteenFourteenDataService.searchSubjects(query)
      ]);
      const allResults: Array<{ branch: string, semester: string, subject: string, source: string }> = [];
      if (studyXResults) allResults.push(...studyXResults.map(r => ({ ...r, source: 'StudyX' })));
      if (dotNotesResults) allResults.push(...dotNotesResults.map(r => ({ ...r, source: 'DotNotes' })));
      if (fifteenFourteenResults) allResults.push(...fifteenFourteenResults.map(r => ({ ...r, source: 'FifteenFourteen' })));
      // Deduplicate
      const uniqueResults = allResults.filter((result, index, arr) => {
        const key = `${result.branch}-${result.semester}-${result.subject}`;
        return arr.findIndex(r => `${r.branch}-${r.semester}-${r.subject}` === key) === index;
      });
      return uniqueResults;
    } catch (error) {
      console.error('[Unified] Error searching subjects:', error);
      return [];
    }
  }

  // Delegate URL helper methods to StudyX service (as they're compatible)
  getEmbedUrl(fileId: string): string {
    return studyXDataService.getEmbedUrl(fileId);
  }

  getViewUrl(fileId: string): string {
    return studyXDataService.getViewUrl(fileId);
  }

  getDownloadUrl(file: GoogleDriveFile): string {
    return studyXDataService.getDownloadUrl(file);
  }

  getPreviewUrl(file: GoogleDriveFile): string {
    return studyXDataService.getPreviewUrl(file);
  }

  getWebViewUrl(file: GoogleDriveFile): string {
    return studyXDataService.getWebViewUrl(file);
  }

  extractFileIdFromUrl(downloadUrl: string): string | null {
    return studyXDataService.extractFileIdFromUrl(downloadUrl);
  }

  getFileId(file: GoogleDriveFile): string | null {
    return studyXDataService.getFileId(file);
  }

  getFileName(file: GoogleDriveFile): string {
    return studyXDataService.getFileName(file);
  }
  isPdfFile(fileName: string): boolean {
    return studyXDataService.isPdfFile(fileName);
  }

  /**
   * Fetch syllabus data for a subject (from consolidated syllabus.json)
   */
  async fetchSyllabusData(branchName: string, semester: string, subjectName: string): Promise<SyllabusData | null> {
    try {
      console.log(`[Unified] Fetching syllabus for ${branchName} ${semester} ${subjectName}`);

      // First, try to get materials from UnifiedContent (which includes Sem3Notes)
      const unifiedMaterials = await unifiedContentService.getOrganizedMaterials(branchName, semester, subjectName);

      if (unifiedMaterials && unifiedMaterials.syllabus && unifiedMaterials.syllabus.length > 0) {
        console.log(`[Unified] Found ${unifiedMaterials.syllabus.length} syllabus items from UnifiedContent`);
        console.log('[Unified] Syllabus items:', unifiedMaterials.syllabus);

        // Check if we have structured syllabus data (type: "structured")
        const structuredItems = unifiedMaterials.syllabus.filter((f: any) => f.type === 'structured');
        if (structuredItems.length > 0) {
          console.log(`[Unified] Found ${structuredItems.length} structured syllabus units`);
          // Convert array of units to object format expected by frontend
          const syllabusData: SyllabusData = {};
          structuredItems.forEach((item: any) => {
            const unitKey = `Unit ${item.unit}`;
            syllabusData[unitKey] = {
              content: item.content,
              topics: item.topics || [item.content],
              hours: item.hours
            };
          });
          console.log('[Unified] Returning structured syllabus:', syllabusData);
          return syllabusData;
        }

        // Look for JSON file (old format)
        const jsonFile = unifiedMaterials.syllabus.find((f: any) => f.name?.toLowerCase().endsWith('.json'));
        if (jsonFile) {
          console.log(`[Unified] Fetching structured syllabus JSON: ${jsonFile.name}`);
          const { contentFetchingService } = await import('./contentFetchingService');
          return await contentFetchingService.fetchSyllabusData([jsonFile]);
        }

        // If no structured data or JSON, check if we have PDF files
        const pdfFiles = unifiedMaterials.syllabus.filter((f: any) =>
          f.name?.toLowerCase().endsWith('.pdf')
        );

        if (pdfFiles.length > 0) {
          console.log(`[Unified] No structured syllabus found, returning ${pdfFiles.length} PDF files for embedding`);
          // Return PDF files in a special format that the frontend can detect and embed
          return {
            _displayMode: 'pdf',
            _pdfFiles: pdfFiles
          } as SyllabusData;
        }
      }

      // Fallback to DotNotes if not found in UnifiedContent
      const mapping = this.subjectMapper.mapStudyXToDotNotes(subjectName, branchName, semester);
      const dotNotesSubjectCode = mapping.dotNotesCode;

      if (!dotNotesSubjectCode) {
        console.log(`[Unified] No DotNotes subject code found for ${subjectName}, no syllabus available`);
        return null;
      }

      console.log(`[Unified] Falling back to DotNotes subject code "${dotNotesSubjectCode}" for syllabus`);

      // Fetch syllabus from consolidated data using the mapped subject code
      return await consolidatedDataService.getSyllabusData(branchName, semester, dotNotesSubjectCode);
    } catch (error) {
      console.error(`[Unified] Error fetching syllabus for ${branchName} ${semester} ${subjectName}:`, error);
      return null;
    }
  }

  /**
   * Fetch videos data for a subject (both sources as per material type rules)
   */
  async fetchVideosData(branchName: string, semester: string, subjectName: string): Promise<VideoData[]> {
    try {
      console.log(`[Unified] Fetching videos for ${branchName} ${semester} ${subjectName}`);

      // For now, videos come from DotNotes only since StudyX doesn't have structured video data
      // In the future, this could be expanded to include both sources
      return await dotNotesDataService.fetchVideosData(branchName, semester, subjectName);
    } catch (error) {
      console.error(`[Unified] Error fetching videos for ${branchName} ${semester} ${subjectName}:`, error);
      return [];
    }
  }
}

export const unifiedDataService = new UnifiedDataService();
