// Consolidated Data Service for loading syllabus and videos from consolidated JSON files
import { SyllabusData, VideoData } from './contentFetchingService';

export interface ConsolidatedSyllabusFile {
  metadata: {
    totalFiles: number;
    generatedAt: string;
    source: string;
    description: string;
  };
  syllabus: {
    [branch: string]: {
      [semester: string]: {
        [subject: string]: {
          extractedFrom: {
            path: string;
            branch: string;
            semester: string;
            subject: string;
          };
          content: SyllabusData;
        };
      };
    };
  };
}

export interface ConsolidatedVideosFile {
  metadata: {
    totalFiles: number;
    generatedAt: string;
    source: string;
    description: string;
  };
  videos: {
    [branch: string]: {
      [semester: string]: {
        [subject: string]: {
          extractedFrom: {
            path: string;
            branch: string;
            semester: string;
            subject: string;
          };
          content: VideoData[];
        };
      };
    };
  };
}

class ConsolidatedDataService {
  private syllabusData: ConsolidatedSyllabusFile | null = null;
  private videosData: ConsolidatedVideosFile | null = null;
  private loadingSyllabus: Promise<ConsolidatedSyllabusFile> | null = null;
  private loadingVideos: Promise<ConsolidatedVideosFile> | null = null;

  /**
   * Load consolidated syllabus data from the Content-Meta folder
   */
  private async loadConsolidatedSyllabusData(): Promise<ConsolidatedSyllabusFile> {
    if (this.syllabusData) {
      return this.syllabusData;
    }

    if (this.loadingSyllabus) {
      return this.loadingSyllabus;
    }

    this.loadingSyllabus = (async () => {
      try {
        console.log('[ConsolidatedData] Loading consolidated syllabus data...');
        const response = await fetch('/Content-Meta/syllabus.json');
        if (!response.ok) {
          throw new Error(`Failed to load syllabus data: ${response.status} ${response.statusText}`);
        }
        this.syllabusData = await response.json() as ConsolidatedSyllabusFile;
        console.log(`[ConsolidatedData] Loaded syllabus data with ${this.syllabusData.metadata.totalFiles} files`);
        return this.syllabusData;
      } catch (error) {
        console.error('[ConsolidatedData] Error loading consolidated syllabus data:', error);
        throw error;
      } finally {
        this.loadingSyllabus = null;
      }
    })();

    return this.loadingSyllabus;
  }

  /**
   * Load consolidated videos data from the Content-Meta folder
   */
  private async loadConsolidatedVideosData(): Promise<ConsolidatedVideosFile> {
    if (this.videosData) {
      return this.videosData;
    }

    if (this.loadingVideos) {
      return this.loadingVideos;
    }

    this.loadingVideos = (async () => {
      try {
        console.log('[ConsolidatedData] Loading consolidated videos data...');
        const response = await fetch('/Content-Meta/videos.json');
        if (!response.ok) {
          throw new Error(`Failed to load videos data: ${response.status} ${response.statusText}`);
        }
        this.videosData = await response.json() as ConsolidatedVideosFile;
        console.log(`[ConsolidatedData] Loaded videos data with ${this.videosData.metadata.totalFiles} files`);
        return this.videosData;
      } catch (error) {
        console.error('[ConsolidatedData] Error loading consolidated videos data:', error);
        throw error;
      } finally {
        this.loadingVideos = null;
      }
    })();

    return this.loadingVideos;
  }  /**
   * Convert URL semester format to consolidated data format
   * "1st" -> "SEM1", "2nd" -> "SEM2", "3rd" -> "SEM3", etc.
   */
  private getSemesterKey(semester: string): string {
    // Handle URL formats like "1st", "2nd", "3rd"
    const numberMatch = semester.match(/(\d+)/);
    if (numberMatch) {
      return `SEM${numberMatch[1]}`;
    }
    
    // If it already starts with SEM, use as-is (consolidated data is now standardized)
    if (semester.toUpperCase().startsWith('SEM')) {
      return semester.toUpperCase();
    }
    
    // Fallback: assume it's a number and add SEM prefix
    return `SEM${semester}`;
  }

  /**
   * Get syllabus data for a specific branch, semester, and subject
   */
  async getSyllabusData(branchName: string, semester: string, subjectName: string): Promise<SyllabusData | null> {
    try {
      const consolidatedData = await this.loadConsolidatedSyllabusData();
      
      // Normalize keys to match the data structure
      const branchKey = branchName.toUpperCase();
      const semesterKey = this.getSemesterKey(semester);
      const subjectKey = subjectName.toUpperCase();

      console.log(`[ConsolidatedData] Looking for syllabus: ${branchKey} > ${semesterKey} > ${subjectKey}`);

      // Navigate through the hierarchical structure
      const branchData = consolidatedData.syllabus[branchKey];
      if (!branchData) {
        console.log(`[ConsolidatedData] Branch ${branchKey} not found in syllabus data`);
        return null;
      }      const semesterData = branchData[semesterKey];
      if (!semesterData) {
        console.log(`[ConsolidatedData] Semester ${semesterKey} not found in branch ${branchKey}`);
        console.log(`[ConsolidatedData] Available semesters:`, Object.keys(branchData));
        return null;
      }

      const subjectData = semesterData[subjectKey];
      if (!subjectData) {
        console.log(`[ConsolidatedData] Subject ${subjectKey} not found in ${branchKey} > ${semesterKey}`);
        console.log(`[ConsolidatedData] Available subjects:`, Object.keys(semesterData));
        return null;
      }

      console.log(`[ConsolidatedData] Found syllabus for ${branchKey} > ${semesterKey} > ${subjectKey}`);
      return subjectData.content;
    } catch (error) {
      console.error(`[ConsolidatedData] Error getting syllabus for ${branchName} ${semester} ${subjectName}:`, error);
      return null;
    }
  }

  /**
   * Get videos data for a specific branch, semester, and subject
   */
  async getVideosData(branchName: string, semester: string, subjectName: string): Promise<VideoData[]> {
    try {
      const consolidatedData = await this.loadConsolidatedVideosData();        // Normalize keys to match the data structure
      const branchKey = branchName.toUpperCase();
      const semesterKey = this.getSemesterKey(semester);
      const subjectKey = subjectName.toUpperCase();

      console.log(`[ConsolidatedData] Looking for videos: ${branchKey} > ${semesterKey} > ${subjectKey}`);

      // Navigate through the hierarchical structure
      const branchData = consolidatedData.videos[branchKey];
      if (!branchData) {
        console.log(`[ConsolidatedData] Branch ${branchKey} not found in videos data`);
        return [];
      }      const semesterData = branchData[semesterKey];
      if (!semesterData) {
        console.log(`[ConsolidatedData] Semester ${semesterKey} not found in branch ${branchKey}`);
        console.log(`[ConsolidatedData] Available semesters:`, Object.keys(branchData));
        return [];
      }

      const subjectData = semesterData[subjectKey];
      if (!subjectData) {
        console.log(`[ConsolidatedData] Subject ${subjectKey} not found in ${branchKey} > ${semesterKey}`);
        console.log(`[ConsolidatedData] Available subjects:`, Object.keys(semesterData));
        return [];
      }

      console.log(`[ConsolidatedData] Found ${subjectData.content.length} videos for ${branchKey} > ${semesterKey} > ${subjectKey}`);
      return subjectData.content;
    } catch (error) {
      console.error(`[ConsolidatedData] Error getting videos for ${branchName} ${semester} ${subjectName}:`, error);
      return [];
    }
  }

  /**
   * Clear cached data (useful for testing or manual refresh)
   */
  clearCache(): void {
    this.syllabusData = null;
    this.videosData = null;
    this.loadingSyllabus = null;
    this.loadingVideos = null;
    console.log('[ConsolidatedData] Cache cleared');
  }

  /**
   * Get cache status and statistics
   */
  getCacheStatus(): { syllabus: boolean; videos: boolean; syllabusFiles?: number; videosFiles?: number } {
    return {
      syllabus: !!this.syllabusData,
      videos: !!this.videosData,
      syllabusFiles: this.syllabusData?.metadata.totalFiles,
      videosFiles: this.videosData?.metadata.totalFiles
    };
  }
}

export const consolidatedDataService = new ConsolidatedDataService();
