// DotNotes Data Service for accessing DotNotes materials from dotnotes.in
import { contentFetchingService, SyllabusData, VideoData, type ContentFile } from './contentFetchingService';
import { consolidatedDataService } from './consolidatedDataService';

export interface DotNotesMaterial {
  id: string;
  name: string;
  downloadUrl: string;
  viewUrl: string;
  originalFolder: string;
}

export interface DotNotesSubject {
  [materialType: string]: DotNotesMaterial[];
}

export interface DotNotesSemester {
  [subjectName: string]: DotNotesSubject;
}

export interface DotNotesBranch {
  [semester: string]: DotNotesSemester;
}

export interface DotNotesData {
  source: string;
  extractionDate: string;
  optimizationMode: string;
  branches: {
    [branchName: string]: DotNotesBranch;
  };
}

// Compatibility interfaces for existing components
export interface GoogleDriveFile {
  name?: string;
  id?: string;
  downloadUrl: string;
  previewUrl?: string;
  webViewUrl?: string;
}

export interface SubjectFolder {
  name: string;
  files: number;
  fileDetails: GoogleDriveFile[];
}

export interface SubjectData {
  name: string;
  folders: number;
  files: number;
  folderDetails: SubjectFolder[];
}

class DotNotesDataService {
  private dotNotesData: DotNotesData | null = null;

  async loadDotNotesData(): Promise<DotNotesData> {
    if (this.dotNotesData) {
      return this.dotNotesData;
    }

    try {
      const response = await fetch('/Content-Meta/Dotnotes.json');
      if (!response.ok) {
        throw new Error('Failed to load DotNotes data');
      }
      this.dotNotesData = await response.json() as DotNotesData;
      return this.dotNotesData;
    } catch (error) {
      console.error('Error loading DotNotes data:', error);
      throw error;
    }
  }

  /**
   * Convert semester format from URL format to data format
   */
  private normalizeSemesterKey(semester: string): string {
    if (!semester) return '';
    
    let semesterKey = semester.trim().toUpperCase();
    
    // Handle common semester mappings
    if (semesterKey.includes('1ST') || semesterKey.includes('SEM-1') || semesterKey === 'SEM1') {
      return 'SEM1';
    } else if (semesterKey.includes('2ND') || semesterKey.includes('SEM-2') || semesterKey === 'SEM2') {
      return 'SEM2';
    } else if (semesterKey.includes('3RD') || semesterKey.includes('SEM-3') || semesterKey === 'SEM3') {
      return 'SEM3';
    } else if (semesterKey.includes('4TH') || semesterKey.includes('SEM-4') || semesterKey === 'SEM4') {
      return 'SEM4';
    } else if (semesterKey.includes('5TH') || semesterKey.includes('SEM-5') || semesterKey === 'SEM5') {
      return 'SEM5';
    } else if (semesterKey.includes('6TH') || semesterKey.includes('SEM-6') || semesterKey === 'SEM6') {
      return 'SEM6';
    } else if (semesterKey.includes('7TH') || semesterKey.includes('SEM-7') || semesterKey === 'SEM7') {
      return 'SEM7';
    } else if (semesterKey.includes('8TH') || semesterKey.includes('SEM-8') || semesterKey === 'SEM8') {
      return 'SEM8';
    }
    
    // Handle existing SEM format (with any prefix or separator removed)
    const match = semesterKey.match(/SEM[- ]?(\d)/i);
    if (match && match[1]) {
      return `SEM${match[1]}`;
    }
    
    // Return original if no patterns matched
    return semesterKey;
  }

  /**
   * Convert DotNotes material to GoogleDriveFile format for compatibility
   */
  private convertMaterialToGoogleDriveFile(material: DotNotesMaterial): GoogleDriveFile {
    return {
      name: material.name,
      id: material.id,
      downloadUrl: material.downloadUrl,
      previewUrl: material.viewUrl,
      webViewUrl: material.viewUrl
    };
  }

  /**
   * Get available branches
   */
  async getAvailableBranches(): Promise<string[]> {
    const data = await this.loadDotNotesData();
    return Object.keys(data.branches);
  }

  /**
   * Get available semesters for a branch
   */
  async getAvailableSemesters(branchName: string): Promise<string[]> {
    const data = await this.loadDotNotesData();
    const branchKey = branchName.toUpperCase();
    
    const branchInfo = data.branches[branchKey];
    if (!branchInfo) {
      return [];
    }
    
    return Object.keys(branchInfo).sort();
  }

  /**
   * Get available subjects for a branch and semester
   */
  async getAvailableSubjects(branchName: string, semester: string): Promise<string[]> {
    try {
      const data = await this.loadDotNotesData();
      const semesterKey = this.normalizeSemesterKey(semester);
      const branchKey = branchName.toUpperCase();
      
      console.log(`[DotNotes] Looking for subjects in branch: ${branchKey}, semester: ${semesterKey}`);
      
      const branchInfo = data.branches[branchKey];
      if (!branchInfo) {
        console.warn(`[DotNotes] No branch data found for ${branchKey}`);
        return [];
      }

      const semesterData = branchInfo[semesterKey];
      if (!semesterData) {
        console.warn(`[DotNotes] No semester data found for ${branchKey}, semester ${semesterKey}`);
        return [];
      }

      const subjects = Object.keys(semesterData);
      console.log(`[DotNotes] Found ${subjects.length} subjects for ${branchKey}, semester ${semesterKey}`);
      return subjects;
    } catch (error) {
      console.error(`[DotNotes] Error fetching subjects for ${branchName}, semester ${semester}:`, error);
      return [];
    }
  }

  /**
   * Get all materials organized by type for a subject
   */
  async getOrganizedMaterials(branchName: string, semester: string, subjectName: string) {
    console.log(`[DotNotes][getOrganizedMaterials] Called with: branch=${branchName}, semester=${semester}, subject=${subjectName}`);
    
    const data = await this.loadDotNotesData();
    const semesterKey = this.normalizeSemesterKey(semester);
    const branchKey = branchName.toUpperCase();
    
    console.log(`[DotNotes][getOrganizedMaterials] Normalized keys: branch=${branchKey}, semester=${semesterKey}`);
    
    const branchInfo = data.branches[branchKey];
    if (!branchInfo) {
      console.log(`[DotNotes][getOrganizedMaterials] No branch data found, returning empty materials`);
      return this.getEmptyOrganizedMaterials();
    }

    const semesterData = branchInfo[semesterKey];
    if (!semesterData) {
      console.log(`[DotNotes][getOrganizedMaterials] No semester data found, returning empty materials`);
      return this.getEmptyOrganizedMaterials();
    }    // Find the subject (case-insensitive search first)
    let subjectKey = Object.keys(semesterData).find(
      key => key.toLowerCase() === subjectName.toLowerCase()
    );
    
    // If not found directly, try subject mapping
    if (!subjectKey) {
      console.log(`[DotNotes][getOrganizedMaterials] Direct match not found, trying subject mapping...`);
      
      // Import the subject mapper
      const { EnhancedSubjectMapper } = await import('../utils/subjectMapper.js');
      const subjectMapper = new EnhancedSubjectMapper();
      
      // Try to map the subject name to DotNotes format
      const mapping = subjectMapper.mapStudyXToDotNotes(subjectName, branchName);
      
      console.log(`[DotNotes][getOrganizedMaterials] Mapping result:`, mapping);
      
      if (mapping.dotNotesCode) {
        // Check if the mapped code exists in the data
        subjectKey = Object.keys(semesterData).find(
          key => key.toLowerCase() === mapping.dotNotesCode.toLowerCase()
        );
        
        if (subjectKey) {
          console.log(`[DotNotes][getOrganizedMaterials] Found subject using mapping: "${subjectName}" -> "${mapping.dotNotesCode}" -> "${subjectKey}"`);
        }
      }
    }
    
    console.log(`[DotNotes][getOrganizedMaterials] Available subjects:`, Object.keys(semesterData));
    console.log(`[DotNotes][getOrganizedMaterials] Looking for subject: ${subjectName.toLowerCase()}`);
    console.log(`[DotNotes][getOrganizedMaterials] Found subject key:`, subjectKey);

    if (!subjectKey) {
      console.log(`[DotNotes][getOrganizedMaterials] Subject not found, returning empty materials`);
      return this.getEmptyOrganizedMaterials();
    }

    const subject = semesterData[subjectKey];
    console.log(`[DotNotes][getOrganizedMaterials] Subject materials:`, {
      notes: (subject.notes || []).length,
      pyqs: (subject.pyqs || []).length,
      books: (subject.books || []).length,
      lab: (subject.lab || []).length,
      akash: (subject.akash || []).length,
      syllabus: (subject.syllabus || []).length,
      videos: (subject.videos || []).length
    });
    
    // Convert DotNotes materials to GoogleDriveFile format
    const result = {
      notes: (subject.notes || []).map(m => this.convertMaterialToGoogleDriveFile(m)),
      pyqs: (subject.pyqs || []).map(m => this.convertMaterialToGoogleDriveFile(m)),
      books: (subject.books || []).map(m => this.convertMaterialToGoogleDriveFile(m)),
      lab: (subject.lab || []).map(m => this.convertMaterialToGoogleDriveFile(m)),
      akash: (subject.akash || []).map(m => this.convertMaterialToGoogleDriveFile(m)),
      syllabus: (subject.syllabus || []).map(m => this.convertMaterialToGoogleDriveFile(m)),
      videos: (subject.videos || []).map(m => this.convertMaterialToGoogleDriveFile(m))
    };
    
    console.log(`[DotNotes][getOrganizedMaterials] Returning organized materials:`, {
      notes: result.notes.length,
      pyqs: result.pyqs.length,
      books: result.books.length,
      lab: result.lab.length,
      akash: result.akash.length,
      syllabus: result.syllabus.length,
      videos: result.videos.length
    });
    
    return result;
  }

  private getEmptyOrganizedMaterials() {
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
   * Get materials for a specific subject (compatible with existing interface)
   */
  async getSubjectMaterials(branchName: string, semester: string, subjectName: string): Promise<SubjectData | null> {
    const data = await this.loadDotNotesData();
    const semesterKey = this.normalizeSemesterKey(semester);
    const branchKey = branchName.toUpperCase();
    
    const branchInfo = data.branches[branchKey];
    if (!branchInfo) {
      console.warn(`[DotNotes] Branch data not found for ${branchKey} in ${semesterKey}`);
      return null;
    }

    const semesterData = branchInfo[semesterKey];
    if (!semesterData) {
      console.warn(`[DotNotes] Semester ${semesterKey} not found`);
      return null;
    }    // Find the subject (case-insensitive search first)
    let subjectKey = Object.keys(semesterData).find(
      key => key.toLowerCase() === subjectName.toLowerCase()
    );

    // If not found directly, try subject mapping
    if (!subjectKey) {
      console.log(`[DotNotes][getSubjectMaterials] Direct match not found, trying subject mapping...`);
      
      // Import the subject mapper
      const { EnhancedSubjectMapper } = await import('../utils/subjectMapper.js');
      const subjectMapper = new EnhancedSubjectMapper();
      
      // Try to map the subject name to DotNotes format
      const mapping = subjectMapper.mapStudyXToDotNotes(subjectName, branchName);
      
      console.log(`[DotNotes][getSubjectMaterials] Mapping result:`, mapping);
      
      if (mapping.dotNotesCode) {
        // Check if the mapped code exists in the data
        subjectKey = Object.keys(semesterData).find(
          key => key.toLowerCase() === mapping.dotNotesCode.toLowerCase()
        );
        
        if (subjectKey) {
          console.log(`[DotNotes][getSubjectMaterials] Found subject using mapping: "${subjectName}" -> "${mapping.dotNotesCode}" -> "${subjectKey}"`);
        }
      }
    }

    if (!subjectKey) {
      console.warn(`[DotNotes] Subject ${subjectName} not found in ${semesterKey}`);
      return null;
    }

    const subject = semesterData[subjectKey];
    
    // Convert to compatible format with folder structure
    const materialTypes = ['notes', 'pyqs', 'books', 'lab', 'akash', 'syllabus', 'videos'];
    const folderDetails: SubjectFolder[] = [];
    let totalFiles = 0;

    materialTypes.forEach(type => {
      const materials = subject[type] || [];
      if (materials.length > 0) {
        folderDetails.push({
          name: type,
          files: materials.length,
          fileDetails: materials.map(material => this.convertMaterialToGoogleDriveFile(material))
        });
        totalFiles += materials.length;
      }
    });

    return {
      name: subjectKey, // DotNotes doesn't have a separate display name
      folders: folderDetails.length,
      files: totalFiles,
      folderDetails
    };
  }

  /**
   * Search subjects across all branches and semesters
   */
  async searchSubjects(query: string): Promise<Array<{branch: string, semester: string, subject: string}>> {
    const data = await this.loadDotNotesData();
    const results: Array<{branch: string, semester: string, subject: string}> = [];
    const searchTerm = query.toLowerCase();

    // Search in all branches
    Object.keys(data.branches).forEach(branchKey => {
      const branchInfo = data.branches[branchKey];
      Object.keys(branchInfo).forEach(semester => {
        const semesterData = branchInfo[semester];
        Object.keys(semesterData).forEach(subjectKey => {
          if (subjectKey.toLowerCase().includes(searchTerm)) {
            results.push({
              branch: branchKey,
              semester,
              subject: subjectKey
            });
          }
        });
      });
    });

    return results;
  }

  /**
   * URL helper methods (compatibility with existing interface)
   */
  getEmbedUrl(fileId: string): string {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }

  getViewUrl(fileId: string): string {
    return `https://drive.google.com/file/d/${fileId}/view`;
  }

  getDownloadUrl(file: GoogleDriveFile): string {
    return file.downloadUrl;
  }

  getPreviewUrl(file: GoogleDriveFile): string {
    return file.previewUrl || this.getEmbedUrl(file.id || '');
  }

  getWebViewUrl(file: GoogleDriveFile): string {
    return file.webViewUrl || this.getViewUrl(file.id || '');
  }

  extractFileIdFromUrl(downloadUrl: string): string | null {
    const match = downloadUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  }

  getFileId(file: GoogleDriveFile): string | null {
    if (file.id) {
      return file.id;
    }
    return this.extractFileIdFromUrl(file.downloadUrl);
  }

  getFileName(file: GoogleDriveFile): string {
    if (file.name) {
      return file.name;
    }
    
    const fileId = this.getFileId(file);
    return fileId ? `Document_${fileId.substring(0, 8)}.pdf` : 'Untitled Document.pdf';
  }
  isPdfFile(fileName: string): boolean {
    return fileName.toLowerCase().endsWith('.pdf');
  }  /**
   * Fetch syllabus data for a specific subject
   */
  async fetchSyllabusData(branchName: string, semester: string, subjectName: string): Promise<SyllabusData | null> {
    try {
      console.log(`[DotNotes] Fetching syllabus from consolidated data for ${branchName} ${semester} ${subjectName}`);
      
      // Import and use subject mapper to get the correct DotNotes subject code
      const { EnhancedSubjectMapper } = await import('../utils/subjectMapper.js');
      const subjectMapper = new EnhancedSubjectMapper();
      
      const mapping = subjectMapper.mapStudyXToDotNotes(subjectName, branchName, semester);
      const dotNotesSubjectCode = mapping.dotNotesCode || subjectName;
      
      console.log(`[DotNotes] Mapped "${subjectName}" to "${dotNotesSubjectCode}" for syllabus`);
      
      return await consolidatedDataService.getSyllabusData(branchName, semester, dotNotesSubjectCode);
    } catch (error) {
      console.error(`[DotNotes] Error fetching syllabus for ${branchName} ${semester} ${subjectName}:`, error);
      return null;
    }
  }/**
   * Fetch videos data for a specific subject
   */
  async fetchVideosData(branchName: string, semester: string, subjectName: string): Promise<VideoData[]> {
    try {
      console.log(`[DotNotes] Fetching videos from consolidated data for ${branchName} ${semester} ${subjectName}`);
      
      // Import and use subject mapper to get the correct DotNotes subject code
      const { EnhancedSubjectMapper } = await import('../utils/subjectMapper.js');
      const subjectMapper = new EnhancedSubjectMapper();
      
      const mapping = subjectMapper.mapStudyXToDotNotes(subjectName, branchName, semester);
      const dotNotesSubjectCode = mapping.dotNotesCode || subjectName;
      
      console.log(`[DotNotes] Mapped "${subjectName}" to "${dotNotesSubjectCode}" for videos`);
      
      return await consolidatedDataService.getVideosData(branchName, semester, dotNotesSubjectCode);
    } catch (error) {
      console.error(`[DotNotes] Error fetching videos for ${branchName} ${semester} ${subjectName}:`, error);
      return [];
    }
  }
}

export const dotNotesDataService = new DotNotesDataService();
