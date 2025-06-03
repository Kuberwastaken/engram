// Unified Data Service that combines StudyX and DotNotes sources
import { studyXDataService, GoogleDriveFile as BaseGoogleDriveFile, SubjectData } from './studyXDataService';
import { dotNotesDataService } from './dotNotesDataService';
import { consolidatedDataService } from './consolidatedDataService';
import { EnhancedSubjectMapper } from '../utils/subjectMapper';
import { type SyllabusData, type VideoData } from './contentFetchingService';

// Enhanced GoogleDriveFile with source attribution
export interface GoogleDriveFile extends BaseGoogleDriveFile {
  source?: 'StudyX' | 'DotNotes';
}

export type { SubjectData };

class UnifiedDataService {
  private subjectMapper: EnhancedSubjectMapper;

  constructor() {
    this.subjectMapper = new EnhancedSubjectMapper();
  }  /**
   * Find matching subject names across sources using enhanced intelligent mapping
   */
  private findMatchingSubjects(studyXSubjects: string[], dotNotesSubjects: string[], branch?: string): Map<string, { studyX?: string, dotNotes?: string, confidence?: number }> {
    const subjectMap = new Map<string, { studyX?: string, dotNotes?: string, confidence?: number }>();
    
    // First, map all StudyX subjects to potential DotNotes codes
    for (const studyXSubject of studyXSubjects) {
      const mapping = this.subjectMapper.mapStudyXToDotNotes(studyXSubject, branch);
      
      if (mapping.dotNotesCode && dotNotesSubjects.includes(mapping.dotNotesCode)) {
        // Found a valid mapping
        const key = `${studyXSubject}::${mapping.dotNotesCode}`;
        subjectMap.set(key, {
          studyX: studyXSubject,
          dotNotes: mapping.dotNotesCode,
          confidence: mapping.confidence
        });
      } else {
        // No mapping found, add StudyX subject alone
        subjectMap.set(studyXSubject, {
          studyX: studyXSubject,
          confidence: 0
        });
      }
    }
    
    // Add any remaining DotNotes subjects that weren't mapped
    for (const dotNotesSubject of dotNotesSubjects) {
      const alreadyMapped = Array.from(subjectMap.values()).some(mapping => mapping.dotNotes === dotNotesSubject);
      
      if (!alreadyMapped) {
        // Try reverse mapping to see if we can find StudyX equivalents
        const reverseMapping = this.subjectMapper.mapDotNotesToStudyX(dotNotesSubject, studyXSubjects);
        
        if (reverseMapping.studyXSubjects.length > 0) {
          // Found potential StudyX matches
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
          // No StudyX mapping, add DotNotes subject alone
          subjectMap.set(dotNotesSubject, {
            dotNotes: dotNotesSubject,
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
  private addSourceToMaterials(materials: BaseGoogleDriveFile[], source: 'StudyX' | 'DotNotes'): GoogleDriveFile[] {
    return materials.map(material => ({
      ...material,
      source
    }));
  }

  /**
   * Apply material type specific filtering rules:
   * - Syllabus: DotNotes only
   * - Books: DotNotes only  
   * - Akash: StudyX only
   * - Notes/PYQs/Lab: Both sources with source tags
   * - Videos: Both sources without source labels
   */
  private applyMaterialTypeRules(
    studyXMaterials: Record<string, BaseGoogleDriveFile[]>,
    dotNotesMaterials: Record<string, BaseGoogleDriveFile[]>
  ): Record<string, GoogleDriveFile[]> {
    return {
      // Syllabus: DotNotes only
      syllabus: this.addSourceToMaterials(dotNotesMaterials.syllabus || [], 'DotNotes'),
      
      // Books: DotNotes only
      books: this.addSourceToMaterials(dotNotesMaterials.books || [], 'DotNotes'),
      
      // Akash: StudyX only
      akash: this.addSourceToMaterials(studyXMaterials.akash || [], 'StudyX'),
      
      // Notes: Both sources with source tags
      notes: [
        ...this.addSourceToMaterials(studyXMaterials.notes || [], 'StudyX'),
        ...this.addSourceToMaterials(dotNotesMaterials.notes || [], 'DotNotes')
      ],
      
      // PYQs: Both sources with source tags
      pyqs: [
        ...this.addSourceToMaterials(studyXMaterials.pyqs || [], 'StudyX'),
        ...this.addSourceToMaterials(dotNotesMaterials.pyqs || [], 'DotNotes')
      ],
      
      // Lab: Both sources with source tags
      lab: [
        ...this.addSourceToMaterials(studyXMaterials.lab || [], 'StudyX'),
        ...this.addSourceToMaterials(dotNotesMaterials.lab || [], 'DotNotes')
      ],
      
      // Videos: Both sources without source labels (remove source attribution)
      videos: [
        ...(studyXMaterials.videos || []).map(m => ({ ...m })),
        ...(dotNotesMaterials.videos || []).map(m => ({ ...m }))
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
   * Get all available branches from both sources
   */
  async getAvailableBranches(): Promise<string[]> {
    try {
      const [studyXBranches, dotNotesBranches] = await Promise.all([
        studyXDataService.getAvailableBranches(),
        dotNotesDataService.getAvailableBranches()
      ]);

      // Combine and deduplicate branches
      const allBranches = new Set([...studyXBranches, ...dotNotesBranches]);
      const result = Array.from(allBranches).sort();
      
      console.log(`[Unified] Available branches: ${result.length} total`);
      console.log(`[Unified] StudyX: ${studyXBranches.length}, DotNotes: ${dotNotesBranches.length}`);
      
      return result;
    } catch (error) {
      console.error('[Unified] Error getting available branches:', error);
      return [];
    }
  }

  /**
   * Get available semesters for a branch from both sources
   */
  async getAvailableSemesters(branchName: string): Promise<string[]> {
    try {
      const [studyXSemesters, dotNotesSemesters] = await Promise.all([
        studyXDataService.getAvailableSemesters(branchName),
        dotNotesDataService.getAvailableSemesters(branchName)
      ]);

      // Combine and deduplicate semesters
      const allSemesters = new Set([...studyXSemesters, ...dotNotesSemesters]);
      const result = Array.from(allSemesters).sort();
      
      console.log(`[Unified] Available semesters for ${branchName}: ${result.length} total`);
      console.log(`[Unified] StudyX: ${studyXSemesters.length}, DotNotes: ${dotNotesSemesters.length}`);
      
      return result;
    } catch (error) {
      console.error(`[Unified] Error getting available semesters for ${branchName}:`, error);
      return [];
    }
  }

  /**
   * Get available subjects for a branch and semester from both sources with proper deduplication
   */
  async getAvailableSubjects(branchName: string, semester: string): Promise<string[]> {
    try {
      const [studyXSubjects, dotNotesSubjects] = await Promise.all([
        studyXDataService.getAvailableSubjects(branchName, semester),
        dotNotesDataService.getAvailableSubjects(branchName, semester)
      ]);      // Use subject mapping to deduplicate properly
      const subjectMap = this.findMatchingSubjects(studyXSubjects, dotNotesSubjects, branchName);
      
      // Extract unified subject names - prefer StudyX names for display, fall back to DotNotes
      const result = Array.from(subjectMap.values())
        .map(mapping => {
          // Prefer StudyX name for display (more descriptive), but fall back to DotNotes
          return mapping.studyX || mapping.dotNotes || '';
        })
        .filter(name => name.length > 0)
        .sort();
      
      console.log(`[Unified] Available subjects for ${branchName} ${semester}: ${result.length} total (deduped)`);
      console.log(`[Unified] StudyX: ${studyXSubjects.length}, DotNotes: ${dotNotesSubjects.length}`);
      console.log(`[Unified] High-confidence mappings:`, 
        Array.from(subjectMap.values())
          .filter(m => (m.confidence || 0) > 0.8)
          .map(m => `${m.studyX || '?'} ↔ ${m.dotNotes || '?'} (${m.confidence?.toFixed(2)})`)
      );
      
      return result;
    } catch (error) {
      console.error(`[Unified] Error getting available subjects for ${branchName} ${semester}:`, error);
      return [];
    }
  }

  /**
   * Get all materials organized by type for a subject from both sources with material type rules
   */  async getOrganizedMaterials(branchName: string, semester: string, subjectName: string): Promise<Record<string, GoogleDriveFile[]>> {
    console.log(`[Unified][getOrganizedMaterials] Called with: branch=${branchName}, semester=${semester}, subject=${subjectName}`);
    
    try {
      // First, try to map the incoming subject name to DotNotes format
      const dotNotesMapping = this.subjectMapper.mapStudyXToDotNotes(subjectName, branchName, semester);
      console.log(`[Unified] Direct mapping attempt for "${subjectName}":`, dotNotesMapping);

      // Get available subjects from both sources
      const [studyXSubjects, dotNotesSubjects] = await Promise.all([
        studyXDataService.getAvailableSubjects(branchName, semester),
        dotNotesDataService.getAvailableSubjects(branchName, semester)
      ]);

      console.log(`[Unified] Available subjects - StudyX: ${studyXSubjects.length}, DotNotes: ${dotNotesSubjects.length}`);
      console.log(`[Unified] DotNotes subjects:`, dotNotesSubjects);

      // Determine the actual subject names to use for each source
      let studyXSubjectName: string | undefined;
      let dotNotesSubjectName: string | undefined;
      let confidence = 0;

      // Check if we have a direct DotNotes mapping and the subject exists in DotNotes
      if (dotNotesMapping.dotNotesCode && dotNotesSubjects.includes(dotNotesMapping.dotNotesCode)) {
        dotNotesSubjectName = dotNotesMapping.dotNotesCode;
        confidence = dotNotesMapping.confidence || 0;
        console.log(`[Unified] Using direct DotNotes mapping: "${subjectName}" -> "${dotNotesSubjectName}" (confidence: ${confidence})`);
      }

      // Check if the subject name exists directly in StudyX
      if (studyXSubjects.includes(subjectName)) {
        studyXSubjectName = subjectName;
        console.log(`[Unified] Found direct StudyX match: "${subjectName}"`);
      }

      // If we haven't found a match yet, fall back to the comprehensive mapping approach
      if (!studyXSubjectName && !dotNotesSubjectName) {
        const subjectMap = this.findMatchingSubjects(studyXSubjects, dotNotesSubjects, branchName);
        
        // Find mapping info for the requested subject
        let mappingInfo = subjectMap.get(subjectName);
        
        // If not found directly, search through the map values
        if (!mappingInfo) {
          for (const [key, value] of subjectMap) {
            if (value.studyX === subjectName || value.dotNotes === subjectName || key === subjectName) {
              mappingInfo = value;
              break;
            }
          }
        }
        
        studyXSubjectName = mappingInfo?.studyX;
        dotNotesSubjectName = mappingInfo?.dotNotes;
        confidence = mappingInfo?.confidence || 0;
      }

      console.log(`[Unified] Final subject mapping for "${subjectName}": StudyX="${studyXSubjectName}", DotNotes="${dotNotesSubjectName}", confidence=${confidence}`);

      // Get materials from both sources using the correct subject names
      const materialPromises: Promise<Record<string, BaseGoogleDriveFile[]>>[] = [];
      
      if (studyXSubjectName) {
        materialPromises.push(studyXDataService.getOrganizedMaterials(branchName, semester, studyXSubjectName));
      } else {
        materialPromises.push(Promise.resolve({
          notes: [], pyqs: [], books: [], lab: [], akash: [], syllabus: [], videos: []
        }));
      }

      if (dotNotesSubjectName) {
        materialPromises.push(dotNotesDataService.getOrganizedMaterials(branchName, semester, dotNotesSubjectName));
      } else {
        materialPromises.push(Promise.resolve({
          notes: [], pyqs: [], books: [], lab: [], akash: [], syllabus: [], videos: []
        }));
      }

      const [studyXMaterials, dotNotesMaterials] = await Promise.allSettled(materialPromises);

      // Handle results and errors
      const studyXResult = studyXMaterials.status === 'fulfilled' ? studyXMaterials.value : this.getEmptyOrganizedMaterials();
      const dotNotesResult = dotNotesMaterials.status === 'fulfilled' ? dotNotesMaterials.value : this.getEmptyOrganizedMaterials();

      if (studyXMaterials.status === 'rejected') {
        console.warn('[Unified] StudyX materials failed to load:', studyXMaterials.reason);
      }
      if (dotNotesMaterials.status === 'rejected') {
        console.warn('[Unified] DotNotes materials failed to load:', dotNotesMaterials.reason);
      }

      // Apply material type specific rules
      const result = this.applyMaterialTypeRules(studyXResult, dotNotesResult);

      console.log(`[Unified][getOrganizedMaterials] Filtered materials by rules:`, {
        notes: `${result.notes.length} (StudyX: ${studyXResult.notes?.length || 0}, DotNotes: ${dotNotesResult.notes?.length || 0})`,
        pyqs: `${result.pyqs.length} (StudyX: ${studyXResult.pyqs?.length || 0}, DotNotes: ${dotNotesResult.pyqs?.length || 0})`,
        books: `${result.books.length} (DotNotes only: ${dotNotesResult.books?.length || 0})`,
        lab: `${result.lab.length} (StudyX: ${studyXResult.lab?.length || 0}, DotNotes: ${dotNotesResult.lab?.length || 0})`,
        akash: `${result.akash.length} (StudyX only: ${studyXResult.akash?.length || 0})`,
        syllabus: `${result.syllabus.length} (DotNotes only: ${dotNotesResult.syllabus?.length || 0})`,
        videos: `${result.videos.length} (StudyX: ${studyXResult.videos?.length || 0}, DotNotes: ${dotNotesResult.videos?.length || 0})`
      });

      return result;
    } catch (error) {
      console.error('[Unified] Error getting organized materials:', error);
      return this.getEmptyOrganizedMaterials();
    }
  }

  /**
   * Get materials for a specific subject from both sources (compatible with existing interface)
   */
  async getSubjectMaterials(branchName: string, semester: string, subjectName: string): Promise<SubjectData | null> {
    try {
      const [studyXMaterials, dotNotesMaterials] = await Promise.allSettled([
        studyXDataService.getSubjectMaterials(branchName, semester, subjectName),
        dotNotesDataService.getSubjectMaterials(branchName, semester, subjectName)
      ]);

      // Handle results and errors
      const studyXResult = studyXMaterials.status === 'fulfilled' ? studyXMaterials.value : null;
      const dotNotesResult = dotNotesMaterials.status === 'fulfilled' ? dotNotesMaterials.value : null;

      // If neither source has the subject, return null
      if (!studyXResult && !dotNotesResult) {
        return null;
      }

      // If only one source has the subject, return that
      if (studyXResult && !dotNotesResult) {
        return studyXResult;
      }
      if (dotNotesResult && !studyXResult) {
        return dotNotesResult;
      }

      // If both sources have the subject, merge them (simplified merge)
      if (studyXResult && dotNotesResult) {
        return {
          name: studyXResult.name, // Prefer StudyX name if available
          folders: studyXResult.folders + dotNotesResult.folders,
          files: studyXResult.files + dotNotesResult.files,
          folderDetails: [...studyXResult.folderDetails, ...dotNotesResult.folderDetails]
        };
      }

      return null;
    } catch (error) {
      console.error('[Unified] Error getting subject materials:', error);
      return null;
    }
  }

  /**
   * Search subjects across all branches and semesters in both sources
   */
  async searchSubjects(query: string): Promise<Array<{branch: string, semester: string, subject: string, source: string}>> {
    try {
      const [studyXResults, dotNotesResults] = await Promise.allSettled([
        studyXDataService.searchSubjects(query),
        dotNotesDataService.searchSubjects(query)
      ]);

      const allResults: Array<{branch: string, semester: string, subject: string, source: string}> = [];

      // Add StudyX results
      if (studyXResults.status === 'fulfilled') {
        allResults.push(...studyXResults.value.map(result => ({ ...result, source: 'StudyX' })));
      }

      // Add DotNotes results
      if (dotNotesResults.status === 'fulfilled') {
        allResults.push(...dotNotesResults.value.map(result => ({ ...result, source: 'DotNotes' })));
      }

      // Deduplicate results (same subject in same branch/semester)
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
