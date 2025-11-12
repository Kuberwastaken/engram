import { ContentFile } from '@/types/content';

export interface UnifiedContentData {
  metadata: {
    source: string;
    version: string;
    generatedAt: string;
    totalSubjects: number;
    totalMaterials: number;
    branches: string[];
    semesters: string[];
  };
  materials: {
    [branchName: string]: {
      [semesterKey: string]: {
        subjects: {
          [subjectKey: string]: {
            name: string;
            code: string;
            category: string;
            materials: {
              syllabus: ContentFile[];
              notes: ContentFile[];
              pyqs: ContentFile[];
              books: ContentFile[];
              lab: ContentFile[];
              akash: ContentFile[];
              videos: ContentFile[];
              viva: ContentFile[];
              midsem: ContentFile[];
            };
            syllabus?: ContentFile[]; // New structured syllabus location (for SEM3+)
            units: Array<{ number: string; content: string }>;
            lastUpdated: string;
            source: string;
          };
        };
      };
    };
  };
}

class UnifiedContentService {
  private unifiedData: UnifiedContentData | null = null;

  async loadUnifiedContentData(): Promise<UnifiedContentData> {
    if (this.unifiedData) {
      return this.unifiedData;
    }

    try {
      console.log('[UnifiedContent] Loading unified content data...');
      const response = await fetch('/Content-Meta/UnifiedContent.json');
      if (!response.ok) {
        throw new Error(`Failed to load UnifiedContent data: ${response.status} ${response.statusText}`);
      }
      this.unifiedData = await response.json() as UnifiedContentData;
      console.log(`[UnifiedContent] Loaded unified content with ${this.unifiedData.metadata.totalSubjects} subjects and ${this.unifiedData.metadata.totalMaterials} materials`);
      return this.unifiedData;
    } catch (error) {
      console.error('[UnifiedContent] Error loading unified content data:', error);
      throw error;
    }
  }

  /**
   * Convert semester format from URL format to data format
   */
  private normalizeSemesterKey(semester: string): string {
    if (!semester) return '';
    
    // Convert URL formats to standard SEM format
    const mapping: Record<string, string> = {
      '1st': 'SEM1',
      '2nd': 'SEM2', 
      '3rd': 'SEM3',
      '4th': 'SEM4',
      '5th': 'SEM5',
      '6th': 'SEM6',
      '7th': 'SEM7',
      '8th': 'SEM8'
    };
    
    // Check direct mapping first
    if (mapping[semester]) {
      return mapping[semester];
    }
    
    // Handle sem-X format
    if (semester.startsWith('sem-')) {
      const num = semester.replace('sem-', '');
      return `SEM${num.toUpperCase()}`;
    }
    
    // Return original if no patterns matched
    return semester;
  }

  /**
   * Get available semesters for a branch
   */
  async getAvailableSemesters(branchName: string): Promise<string[]> {
    try {
      const data = await this.loadUnifiedContentData();
      const branchKey = branchName.toUpperCase();
      
      const branchData = data.materials[branchKey];
      if (!branchData) {
        console.warn(`[UnifiedContent] No branch data found for ${branchKey}`);
        return [];
      }
      
      return Object.keys(branchData).sort();
    } catch (error) {
      console.error(`[UnifiedContent] Error getting available semesters for ${branchName}:`, error);
      return [];
    }
  }

  /**
   * Get available subjects for a branch and semester
   */
  async getAvailableSubjects(branchName: string, semester: string): Promise<string[]> {
    try {
      const data = await this.loadUnifiedContentData();
      const semesterKey = this.normalizeSemesterKey(semester);
      const branchKey = branchName.toUpperCase();
      
      console.log(`[UnifiedContent] Looking for subjects in branch: ${branchKey}, semester: ${semesterKey}`);
      
      const branchData = data.materials[branchKey];
      if (!branchData) {
        console.warn(`[UnifiedContent] No branch data found for ${branchKey}`);
        return [];
      }

      const semesterData = branchData[semesterKey];
      if (!semesterData) {
        console.warn(`[UnifiedContent] No semester data found for ${branchKey}, semester ${semesterKey}`);
        return [];
      }

      // Convert subject entries to display names
      const subjects = Object.entries(semesterData.subjects).map(([key, subject]) => subject.name);
      console.log(`[UnifiedContent] Found ${subjects.length} subjects for ${branchKey}, semester ${semesterKey}:`, subjects);
      return subjects;
    } catch (error) {
      console.error(`[UnifiedContent] Error fetching subjects for ${branchName}, semester ${semester}:`, error);
      return [];
    }
  }

  /**
   * Get all materials organized by type for a subject
   */
  async getOrganizedMaterials(branchName: string, semester: string, subjectName: string) {
    try {
      const data = await this.loadUnifiedContentData();
      const semesterKey = this.normalizeSemesterKey(semester);
      const branchKey = branchName.toUpperCase();
      
      console.log(`[UnifiedContent] Getting materials for: ${branchKey}, ${semesterKey}, ${subjectName}`);
      
      const branchData = data.materials[branchKey];
      if (!branchData) {
        console.warn(`[UnifiedContent] No branch data found for ${branchKey}`);
        return null;
      }

      const semesterData = branchData[semesterKey];
      if (!semesterData) {
        console.warn(`[UnifiedContent] No semester data found for ${branchKey}, semester ${semesterKey}`);
        return null;
      }

      // Find subject by name (case-insensitive)
      const subjectEntry = Object.entries(semesterData.subjects).find(([key, subject]) => 
        subject.name.toLowerCase() === subjectName.toLowerCase()
      );

      if (!subjectEntry) {
        console.warn(`[UnifiedContent] No subject found: ${subjectName} in ${branchKey} ${semesterKey}`);
        return null;
      }

      const [subjectKey, subjectData] = subjectEntry;
      
      // Convert UnifiedContent format to the expected GoogleDriveFile format
      const convertMaterials = (materials: any[]) => {
        return materials.map(material => ({
          id: material.id,
          name: material.name,
          downloadUrl: material.downloadUrl,
          viewUrl: material.viewUrl,
          originalUrl: material.originalUrl,
          source: material.source || 'google-drive-sem3',
          originalFolder: material.originalFolder,
          subject: material.subject,
          addedAt: material.addedAt,
          index: material.index,
          // Preserve structured syllabus fields
          type: material.type,
          unit: material.unit,
          hours: material.hours,
          content: material.content,
          topics: material.topics
        }));
      };

      const organizedMaterials = {
        notes: convertMaterials(subjectData.materials?.notes || []),
        pyqs: convertMaterials(subjectData.materials?.pyqs || []),
        books: convertMaterials(subjectData.materials?.books || []),
        lab: convertMaterials(subjectData.materials?.lab || []),
        akash: convertMaterials(subjectData.materials?.akash || []),
        videos: convertMaterials(subjectData.materials?.videos || []),
        viva: convertMaterials(subjectData.materials?.viva || []),
        midsem: convertMaterials(subjectData.materials?.midsem || []),
        // Check both locations for syllabus: direct (new structure) or inside materials (old structure)
        syllabus: convertMaterials(subjectData.syllabus || subjectData.materials?.syllabus || [])
      };

      console.log(`[UnifiedContent] Found materials for ${subjectName}:`, {
        notes: organizedMaterials.notes.length,
        pyqs: organizedMaterials.pyqs.length,
        books: organizedMaterials.books.length,
        lab: organizedMaterials.lab.length,
        akash: organizedMaterials.akash.length,
        videos: organizedMaterials.videos.length,
        viva: organizedMaterials.viva.length,
        midsem: organizedMaterials.midsem.length,
        syllabus: organizedMaterials.syllabus.length
      });

      return organizedMaterials;
    } catch (error) {
      console.error(`[UnifiedContent] Error getting materials for ${branchName}, ${semester}, ${subjectName}:`, error);
      return null;
    }
  }

  /**
   * Get metadata about the unified content collection
   */
  async getMetadata() {
    const data = await this.loadUnifiedContentData();
    return data.metadata;
  }
}

export const unifiedContentService = new UnifiedContentService();
