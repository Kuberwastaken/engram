// FifteenFourteen Data Service for accessing FifteenFourteen materials
import { contentFetchingService, SyllabusData, VideoData } from './contentFetchingService';

export interface FifteenFourteenMaterial {
  id: string;
  name: string;
  downloadUrl: string;
  viewUrl: string;
  originalFolder: string;
  source: string;
  originalUrl: string;
}

export interface FifteenFourteenSubject {
  name: string;
  url: string;
  units: Array<{
    number: string;
    content: string;
  }>;
  notes: FifteenFourteenMaterial[];
  pyqs: FifteenFourteenMaterial[];
  viva: FifteenFourteenMaterial[];
  midsem: FifteenFourteenMaterial[];
  books: FifteenFourteenMaterial[];
  lab: FifteenFourteenMaterial[];
  syllabus: FifteenFourteenMaterial[];
  videos: FifteenFourteenMaterial[];
  akash: FifteenFourteenMaterial[];
}

export interface FifteenFourteenSemester {
  [subjectCode: string]: FifteenFourteenSubject;
}

export interface FifteenFourteenBranch {
  [semester: string]: FifteenFourteenSemester;
}

export interface FifteenFourteenData {
  metadata: {
    source: string;
    generatedAt: string;
    version: string;
    description: string;
    totalSubjects: number;
    heroPage: string;
    coverage: string;
    note: string;
    scrapedAt: string;
  };
  branches: {
    [branchName: string]: FifteenFourteenBranch;
  };
}

// Compatibility interfaces for existing components
export interface GoogleDriveFile {
  name?: string;
  id?: string;
  downloadUrl: string;
  previewUrl?: string;
  webViewUrl?: string;
  source?: string;
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

class FifteenFourteenDataService {
  private fifteenFourteenData: FifteenFourteenData | null = null;

  async loadFifteenFourteenData(): Promise<FifteenFourteenData> {
    if (this.fifteenFourteenData) {
      return this.fifteenFourteenData;
    }

    try {
      const response = await fetch('/Content-Meta/FifteenFourteen.json');
      if (!response.ok) {
        throw new Error('Failed to load FifteenFourteen data');
      }
      this.fifteenFourteenData = await response.json() as FifteenFourteenData;
      return this.fifteenFourteenData;
    } catch (error) {
      console.error('Error loading FifteenFourteen data:', error);
      throw error;
    }
  }
  /**
   * Convert semester format - now uses standard format (1st, 2nd, etc.)
   */
  private normalizeSemesterKey(semester: string): string {
    // FifteenFourteen now uses the same format as other services
    return semester;
  }
  /**
   * Convert FifteenFourteen material to GoogleDriveFile format for compatibility
   */
  private convertMaterialToGoogleDriveFile(material: FifteenFourteenMaterial, materialType?: string, index?: number): GoogleDriveFile {
    let displayName = material.name;
    
    // Improve generic names like "LINK"
    if (material.name === "LINK" || material.name.toLowerCase() === "link") {
      const folderName = material.originalFolder || materialType || "Material";
      const fileNumber = index !== undefined ? index + 1 : "";
      displayName = `${folderName}${fileNumber ? ` ${fileNumber}` : ""}`;
    }
    
    return {
      name: displayName,
      id: material.id,
      downloadUrl: material.downloadUrl,
      previewUrl: material.viewUrl,
      webViewUrl: material.originalUrl,
      source: 'FifteenFourteen'
    };
  }

  /**
   * Get available branches
   */
  async getAvailableBranches(): Promise<string[]> {
    const data = await this.loadFifteenFourteenData();
    return Object.keys(data.branches);
  }

  /**
   * Get available semesters for a branch
   */
  async getAvailableSemesters(branchName: string): Promise<string[]> {
    const data = await this.loadFifteenFourteenData();
    const branchData = data.branches[branchName.toUpperCase()];
    if (!branchData) {
      return [];
    }
    return Object.keys(branchData);
  }
  /**
   * Get available subjects for a branch and semester
   */  async getAvailableSubjects(branchName: string, semester: string): Promise<string[]> {
    console.log(`[FifteenFourteen][getAvailableSubjects] CALLED with: branch=${branchName}, semester=${semester}`);
    
    const data = await this.loadFifteenFourteenData();
    const semesterKey = this.normalizeSemesterKey(semester);
    
    // FifteenFourteen has first-year materials under COMMON branch
    // These are applicable to all branches for first-year subjects
    const targetBranch = data.branches['COMMON'] || data.branches[branchName.toUpperCase()];
    
    console.log(`[FifteenFourteen][getAvailableSubjects] Using branch: ${targetBranch ? 'COMMON' : branchName}`);
    
    if (!targetBranch) {
      console.log(`[FifteenFourteen][getAvailableSubjects] No branch data found for ${branchName} or COMMON`);
      return [];
    }    const semesterData = targetBranch[semesterKey];
    if (!semesterData) {
      console.log(`[FifteenFourteen][getAvailableSubjects] No semester data found for ${semesterKey} in target branch`);
      return [];
    }

    const subjects = Object.keys(semesterData);
    console.log(`[FifteenFourteen][getAvailableSubjects] Found ${subjects.length} subjects:`, subjects);
    return subjects;
  }  /**
   * Get all materials organized by type for a subject
   */
  async getOrganizedMaterials(branchName: string, semester: string, subjectName: string) {
    console.log(`[FifteenFourteen][getOrganizedMaterials] CALLED with: branch=${branchName}, semester=${semester}, subject=${subjectName}`);
    const data = await this.loadFifteenFourteenData();
    const semesterKey = this.normalizeSemesterKey(semester);
    
    console.log(`[FifteenFourteen][getOrganizedMaterials] Looking for: ${branchName} ${semesterKey} ${subjectName}`);
    
    // FifteenFourteen has first-year materials under COMMON branch
    // These are applicable to all branches for first-year subjects
    const targetBranch = data.branches['COMMON'] || data.branches[branchName.toUpperCase()];
    
    console.log(`[FifteenFourteen][getOrganizedMaterials] Using branch: ${targetBranch ? 'COMMON' : branchName}`);
    
    if (!targetBranch) {
      console.log(`[FifteenFourteen][getOrganizedMaterials] No branch data found for ${branchName} or COMMON`);
      return this.getEmptyOrganizedMaterials();
    }

    const semesterData = targetBranch[semesterKey];
    if (!semesterData) {
      console.log(`[FifteenFourteen][getOrganizedMaterials] No semester data found for ${semesterKey} in target branch`);
      return this.getEmptyOrganizedMaterials();
    }

    // Find the subject (case-insensitive search first)
    let subjectKey = Object.keys(semesterData).find(
      key => key.toLowerCase() === subjectName.toLowerCase()
    );
    
    // If not found directly, try subject mapping
    if (!subjectKey) {
      console.log(`[FifteenFourteen][getOrganizedMaterials] Direct match not found, trying subject mapping...`);
      
      // Import the subject mapper
      const { EnhancedSubjectMapper } = await import('../utils/subjectMapper.js');
      const subjectMapper = new EnhancedSubjectMapper();
      
      // Try to map the subject name to FifteenFourteen format (which is similar to DotNotes)
      const mapping = subjectMapper.mapStudyXToDotNotes(subjectName, branchName);
      
      console.log(`[FifteenFourteen][getOrganizedMaterials] Mapping result:`, mapping);
      
      if (mapping.dotNotesCode) {
        // Check if the mapped code exists in the data
        subjectKey = Object.keys(semesterData).find(
          key => key.toLowerCase() === mapping.dotNotesCode.toLowerCase()
        );
        
        if (subjectKey) {
          console.log(`[FifteenFourteen][getOrganizedMaterials] Found subject using mapping: "${subjectName}" -> "${mapping.dotNotesCode}" -> "${subjectKey}"`);
        }
      }
    }
    
    console.log(`[FifteenFourteen][getOrganizedMaterials] Available subjects:`, Object.keys(semesterData));
    
    if (!subjectKey) {
      console.warn(`[FifteenFourteen] Subject ${subjectName} not found in ${semesterKey}`);
      return this.getEmptyOrganizedMaterials();
    }

    const subject = semesterData[subjectKey];
    
    console.log(`[FifteenFourteen][getOrganizedMaterials] Found subject data:`, {
      notes: (subject.notes || []).length,
      pyqs: (subject.pyqs || []).length,
      books: (subject.books || []).length,
      lab: (subject.lab || []).length,
      akash: (subject.akash || []).length,
      syllabus: (subject.syllabus || []).length,
      videos: (subject.videos || []).length
    });
      // Convert FifteenFourteen materials to GoogleDriveFile format
    const result = {
      notes: (subject.notes || []).map((m, index) => this.convertMaterialToGoogleDriveFile(m, 'Notes', index)),
      pyqs: (subject.pyqs || []).map((m, index) => this.convertMaterialToGoogleDriveFile(m, 'PYQs', index)),
      books: (subject.books || []).map((m, index) => this.convertMaterialToGoogleDriveFile(m, 'Books', index)),
      lab: (subject.lab || []).map((m, index) => this.convertMaterialToGoogleDriveFile(m, 'Lab', index)),
      akash: (subject.akash || []).map((m, index) => this.convertMaterialToGoogleDriveFile(m, 'Akash', index)),
      syllabus: (subject.syllabus || []).map((m, index) => this.convertMaterialToGoogleDriveFile(m, 'Syllabus', index)),
      videos: (subject.videos || []).map((m, index) => this.convertMaterialToGoogleDriveFile(m, 'Videos', index))
    };
    
    console.log(`[FifteenFourteen][getOrganizedMaterials] Returning organized materials:`, {
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
    console.log(`[FifteenFourteen][getSubjectMaterials] CALLED with: branch=${branchName}, semester=${semester}, subject=${subjectName}`);
    const data = await this.loadFifteenFourteenData();
    const semesterKey = this.normalizeSemesterKey(semester);
    
    // FifteenFourteen has first-year materials under COMMON branch
    // These are applicable to all branches for first-year subjects
    const targetBranch = data.branches['COMMON'] || data.branches[branchName.toUpperCase()];
    
    console.log(`[FifteenFourteen][getSubjectMaterials] Using branch: ${targetBranch ? 'COMMON' : branchName}`);
    
    if (!targetBranch) {
      console.log(`[FifteenFourteen][getSubjectMaterials] No branch data found for ${branchName} or COMMON`);
      return null;
    }

    const semesterData = targetBranch[semesterKey];
    if (!semesterData) {
      console.log(`[FifteenFourteen][getSubjectMaterials] No semester data found for ${semesterKey} in target branch`);
      return null;
    }

    // Find the subject (case-insensitive search first)
    let subjectKey = Object.keys(semesterData).find(
      key => key.toLowerCase() === subjectName.toLowerCase()
    );
    
    // If not found directly, try subject mapping
    if (!subjectKey) {
      console.log(`[FifteenFourteen][getSubjectMaterials] Direct match not found, trying subject mapping...`);
      
      // Import the subject mapper
      const { EnhancedSubjectMapper } = await import('../utils/subjectMapper.js');
      const subjectMapper = new EnhancedSubjectMapper();
      
      // Try to map the subject name to FifteenFourteen format
      const mapping = subjectMapper.mapStudyXToDotNotes(subjectName, branchName);
      
      console.log(`[FifteenFourteen][getSubjectMaterials] Mapping result:`, mapping);
      
      if (mapping.dotNotesCode) {
        // Check if the mapped code exists in the data
        subjectKey = Object.keys(semesterData).find(
          key => key.toLowerCase() === mapping.dotNotesCode.toLowerCase()
        );
        
        if (subjectKey) {
          console.log(`[FifteenFourteen][getSubjectMaterials] Found subject using mapping: "${subjectName}" -> "${mapping.dotNotesCode}" -> "${subjectKey}"`);
        }
      }
    }

    if (!subjectKey) {
      console.warn(`[FifteenFourteen] Subject ${subjectName} not found in ${semesterKey}`);
      return null;
    }

    const subject = semesterData[subjectKey];
    
    // Convert to compatible format with folder structure
    const materialTypes = ['notes', 'pyqs', 'books', 'lab', 'akash', 'syllabus', 'videos'];
    const folderDetails: SubjectFolder[] = [];
    let totalFiles = 0;    materialTypes.forEach(type => {
      const materials = subject[type] || [];
      if (materials.length > 0) {
        folderDetails.push({
          name: type,
          files: materials.length,
          fileDetails: materials.map((material, index) => this.convertMaterialToGoogleDriveFile(material, type, index))
        });
        totalFiles += materials.length;
      }
    });

    return {
      name: subject.name || subjectKey, // Use the display name from FifteenFourteen
      folders: folderDetails.length,
      files: totalFiles,
      folderDetails
    };
  }

  /**
   * Search subjects across all branches and semesters
   */
  async searchSubjects(query: string): Promise<Array<{branch: string, semester: string, subject: string}>> {
    const data = await this.loadFifteenFourteenData();
    const results: Array<{branch: string, semester: string, subject: string}> = [];
    const normalizedQuery = query.toLowerCase();

    Object.keys(data.branches).forEach(branchName => {
      const branch = data.branches[branchName];
      Object.keys(branch).forEach(semesterName => {
        const semester = branch[semesterName];
        Object.keys(semester).forEach(subjectCode => {
          const subject = semester[subjectCode];
          if (subject.name.toLowerCase().includes(normalizedQuery) || 
              subjectCode.toLowerCase().includes(normalizedQuery)) {
            results.push({
              branch: branchName,
              semester: semesterName,
              subject: subjectCode
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
    return file.id || this.extractFileIdFromUrl(file.downloadUrl);
  }

  getFileName(file: GoogleDriveFile): string {
    return file.name || 'Unknown File';
  }

  isPdfFile(fileName: string): boolean {
    return fileName.toLowerCase().endsWith('.pdf');
  }

  /**
   * Fetch syllabus data for a specific subject
   */
  async fetchSyllabusData(branchName: string, semester: string, subjectName: string): Promise<SyllabusData | null> {
    try {
      console.log(`[FifteenFourteen] Fetching syllabus for ${branchName} ${semester} ${subjectName}`);
      
      // FifteenFourteen primarily focuses on first year subjects (SEM1 & SEM2)
      // and doesn't have detailed syllabus content, so we return null
      // This will allow other services to handle syllabus data
      return null;
    } catch (error) {
      console.error(`[FifteenFourteen] Error fetching syllabus for ${branchName} ${semester} ${subjectName}:`, error);
      return null;
    }
  }

  /**
   * Fetch videos data for a specific subject
   */
  async fetchVideosData(branchName: string, semester: string, subjectName: string): Promise<VideoData[]> {
    try {
      console.log(`[FifteenFourteen] Fetching videos for ${branchName} ${semester} ${subjectName}`);
      
      // FifteenFourteen doesn't have video content in the current structure
      // Return empty array to allow other services to handle videos
      return [];
    } catch (error) {
      console.error(`[FifteenFourteen] Error fetching videos for ${branchName} ${semester} ${subjectName}:`, error);
      return [];
    }
  }
}

export const fifteenFourteenDataService = new FifteenFourteenDataService();
