// Unified Data Service that combines StudyX, DotNotes, and FifteenFourteen sources
import { studyXDataService, GoogleDriveFile as BaseGoogleDriveFile, SubjectData } from './studyXDataService';
import { dotNotesDataService } from './dotNotesDataService';
import { fifteenFourteenDataService } from './fifteenFourteenDataService';
import { consolidatedDataService } from './consolidatedDataService';
import { EnhancedSubjectMapper } from '../utils/subjectMapper';
import { type SyllabusData, type VideoData } from './contentFetchingService';

// Enhanced GoogleDriveFile with source attribution
export interface GoogleDriveFile extends BaseGoogleDriveFile {
  source?: 'StudyX' | 'DotNotes' | 'FifteenFourteen';
}

export type { SubjectData };

class UnifiedDataService {
  private subjectMapper: EnhancedSubjectMapper;

  constructor() {
    this.subjectMapper = new EnhancedSubjectMapper();
  }  /**
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
  private addSourceToMaterials(materials: BaseGoogleDriveFile[], source: 'StudyX' | 'DotNotes' | 'FifteenFourteen'): GoogleDriveFile[] {
    return materials.map(material => ({
      ...material,
      source
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
   * Get available subjects for a branch and semester from all three sources with deduplication
   */
  async getAvailableSubjects(branchName: string, semester: string): Promise<string[]> {
    try {
      const [studyXSubjects, dotNotesSubjects, fifteenFourteenSubjects] = await Promise.all([
        studyXDataService.getAvailableSubjects(branchName, semester),
        dotNotesDataService.getAvailableSubjects(branchName, semester),
        fifteenFourteenDataService.getAvailableSubjects(branchName, semester)
      ]);
      const subjectMap = this.findMatchingSubjects(studyXSubjects, dotNotesSubjects, fifteenFourteenSubjects, branchName);
      const result = Array.from(subjectMap.values())
        .map(mapping => mapping.studyX || mapping.dotNotes || mapping.fifteenFourteen || '')
        .filter(name => name.length > 0)
        .sort();
      return result;
    } catch (error) {
      console.error(`[Unified] Error getting available subjects for ${branchName} ${semester}:`, error);
      return [];
    }
  }

  /**
   * Get all materials organized by type for a subject from all three sources
   */
  async getOrganizedMaterials(branchName: string, semester: string, subjectName: string): Promise<Record<string, GoogleDriveFile[]>> {
    try {
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
  async searchSubjects(query: string): Promise<Array<{branch: string, semester: string, subject: string, source: string}>> {
    try {
      const [studyXResults, dotNotesResults, fifteenFourteenResults] = await Promise.all([
        studyXDataService.searchSubjects(query),
        dotNotesDataService.searchSubjects(query),
        fifteenFourteenDataService.searchSubjects(query)
      ]);
      const allResults: Array<{branch: string, semester: string, subject: string, source: string}> = [];
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
      
      // Get the subject mapping to find the DotNotes subject code
      const mapping = this.subjectMapper.mapStudyXToDotNotes(subjectName, branchName, semester);
      const dotNotesSubjectCode = mapping.dotNotesCode;
      
      if (!dotNotesSubjectCode) {
        console.log(`[Unified] No DotNotes subject code found for ${subjectName}`);
        return null;
      }
      
      console.log(`[Unified] Using DotNotes subject code "${dotNotesSubjectCode}" for syllabus`);
      
      // Fetch syllabus directly from consolidated data using the mapped subject code
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
