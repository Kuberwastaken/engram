// StudyX Data Service for accessing enhanced materials with preview, download, and web view links

export interface StudyXMaterial {
  name: string;
  type: string;
  size?: string | null;
  uploadedAt?: string;
  id: string;
  links: {
    preview: string;
    download: string;
    webView: string;
  };
}

export interface StudyXSubject {
  name: string;
  materials: {
    notes: StudyXMaterial[];
    pyqs: StudyXMaterial[];
    books: StudyXMaterial[];
    lab: StudyXMaterial[];
    akash: StudyXMaterial[];
    syllabus: StudyXMaterial[];
    videos: StudyXMaterial[];
  };
}

export interface StudyXSemester {
  subjects: Record<string, StudyXSubject>;
}

export interface StudyXBranch {
  [semester: string]: StudyXSemester;
}

export interface StudyXMetadata {
  source: string;
  generatedAt: string;
  version: string;
  description: string;
  totalSubjects: number;
  totalMaterials: number;
  totalLinks: number;
  branches: string[];
  semesters: string[];
  dataType: string;
  linkTypes: string[];
  note: string;
}

export interface StudyXData {
  metadata: StudyXMetadata;
  materials: {
    common: StudyXBranch;
  };
  branches: {
    [branchName: string]: {
      semesters: StudyXBranch;
    };
  };
}

// Compatibility interfaces for existing components
export interface GoogleDriveFile {
  name?: string;
  id?: string;
  downloadUrl: string;
  // Enhanced with StudyX links
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

class StudyXDataService {
  private studyXData: StudyXData | null = null;

  async loadStudyXData(): Promise<StudyXData> {
    if (this.studyXData) {
      return this.studyXData;
    }

    try {
      const response = await fetch('/Content-Meta/StudyX.json');
      if (!response.ok) {
        throw new Error('Failed to load StudyX data');
      }
      this.studyXData = await response.json() as StudyXData;
      return this.studyXData;
    } catch (error) {
      console.error('Error loading StudyX data:', error);
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
  }/**
   * Get the appropriate branch data (common for SEM1-2, branch-specific for SEM3-8)
   */  private getBranchData(data: StudyXData, branchName: string, semesterKey: string): StudyXBranch | null {
    console.log(`[getBranchData] Called with: branch=${branchName}, semester=${semesterKey}`);
    
    // First check if this semester exists in common materials
    if (data.materials.common && data.materials.common[semesterKey]) {
      console.log(`[getBranchData] Found semester ${semesterKey} in common materials`);
      return data.materials.common;
    }
    
    // Then check branch-specific semesters
    const branchKey = branchName.toUpperCase();
    console.log(`[getBranchData] Looking for branch-specific data with key: ${branchKey}`);
    
    const branchInfo = data.materials.branches[branchKey];
    console.log(`[getBranchData] Branch info found:`, !!branchInfo);
    
    // Check if the branch exists and has semester data
    // Fixed: The branches structure is { "CSE": { "semesters": { ... } } }
    if (branchInfo && branchInfo.semesters && branchInfo.semesters[semesterKey]) {
      console.log(`[getBranchData] Found semester ${semesterKey} in branch ${branchKey} specific data`);
      return branchInfo.semesters;
    }
    
    // As a fallback, return common data if the branch-specific data isn't found
    // This helps with cases where higher semesters might still be in common
    if (data.materials.common) {
      console.log(`[getBranchData] Falling back to common materials`);
      return data.materials.common;
    }
    
    console.log(`[getBranchData] No data found, returning null`);
    return null;
  }

  /**
   * Convert StudyX material to GoogleDriveFile format for compatibility
   */
  private convertMaterialToGoogleDriveFile(material: StudyXMaterial): GoogleDriveFile {
    return {
      name: material.name,
      id: material.id,
      downloadUrl: material.links.download,
      previewUrl: material.links.preview,
      webViewUrl: material.links.webView
    };
  }

  /**
   * Get materials for a specific subject (compatible with existing interface)
   */
  async getSubjectMaterials(branchName: string, semester: string, subjectName: string): Promise<SubjectData | null> {
    const data = await this.loadStudyXData();
    const semesterKey = this.normalizeSemesterKey(semester);
    const branchData = this.getBranchData(data, branchName, semesterKey);
    
    if (!branchData) {
      console.warn(`Branch data not found for ${branchName} in ${semesterKey}`);
      return null;
    }

    const semesterData = branchData[semesterKey];
    if (!semesterData) {
      console.warn(`Semester ${semesterKey} not found`);
      return null;
    }

    // Find the subject (case-insensitive search)
    const subjectKey = Object.keys(semesterData.subjects).find(
      key => key.toLowerCase() === subjectName.toLowerCase()
    );

    if (!subjectKey) {
      console.warn(`Subject ${subjectName} not found in ${semesterKey}`);
      return null;
    }

    const subject = semesterData.subjects[subjectKey];
    
    // Convert to compatible format with folder structure
    const materialTypes = ['notes', 'pyqs', 'books', 'lab', 'akash', 'syllabus', 'videos'];
    const folderDetails: SubjectFolder[] = [];
    let totalFiles = 0;

    materialTypes.forEach(type => {
      const materials = subject.materials[type as keyof typeof subject.materials] || [];
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
      name: subject.name,
      folders: folderDetails.length,
      files: totalFiles,
      folderDetails
    };
  }

  /**
   * Get all materials organized by type for a subject
   */  async getOrganizedMaterials(branchName: string, semester: string, subjectName: string) {
    console.log(`[getOrganizedMaterials] Called with: branch=${branchName}, semester=${semester}, subject=${subjectName}`);
    
    const data = await this.loadStudyXData();
    const semesterKey = this.normalizeSemesterKey(semester);
    console.log(`[getOrganizedMaterials] Normalized semester key: ${semesterKey}`);
    
    const branchData = this.getBranchData(data, branchName, semesterKey);
    console.log(`[getOrganizedMaterials] Branch data found:`, !!branchData);
    
    if (!branchData) {
      console.log(`[getOrganizedMaterials] No branch data found, returning empty materials`);
      return this.getEmptyOrganizedMaterials();
    }

    const semesterData = branchData[semesterKey];
    console.log(`[getOrganizedMaterials] Semester data found:`, !!semesterData);
    
    if (!semesterData) {
      console.log(`[getOrganizedMaterials] No semester data found, returning empty materials`);
      return this.getEmptyOrganizedMaterials();
    }

    // Find the subject (case-insensitive search)
    const subjectKey = Object.keys(semesterData.subjects).find(
      key => key.toLowerCase() === subjectName.toLowerCase()
    );
    
    console.log(`[getOrganizedMaterials] Available subjects:`, Object.keys(semesterData.subjects));
    console.log(`[getOrganizedMaterials] Looking for subject: ${subjectName.toLowerCase()}`);
    console.log(`[getOrganizedMaterials] Found subject key:`, subjectKey);

    if (!subjectKey) {
      console.log(`[getOrganizedMaterials] Subject not found, returning empty materials`);
      return this.getEmptyOrganizedMaterials();
    }

    const subject = semesterData.subjects[subjectKey];
    console.log(`[getOrganizedMaterials] Subject materials:`, {
      notes: (subject.materials.notes || []).length,
      pyqs: (subject.materials.pyqs || []).length,
      books: (subject.materials.books || []).length,
      lab: (subject.materials.lab || []).length,
      akash: (subject.materials.akash || []).length,
      syllabus: (subject.materials.syllabus || []).length,
      videos: (subject.materials.videos || []).length
    });
    
    // Convert StudyX materials to GoogleDriveFile format
    const result = {
      notes: (subject.materials.notes || []).map(m => this.convertMaterialToGoogleDriveFile(m)),
      pyqs: (subject.materials.pyqs || []).map(m => this.convertMaterialToGoogleDriveFile(m)),
      books: (subject.materials.books || []).map(m => this.convertMaterialToGoogleDriveFile(m)),
      lab: (subject.materials.lab || []).map(m => this.convertMaterialToGoogleDriveFile(m)),
      akash: (subject.materials.akash || []).map(m => this.convertMaterialToGoogleDriveFile(m)),
      syllabus: (subject.materials.syllabus || []).map(m => this.convertMaterialToGoogleDriveFile(m)),
      videos: (subject.materials.videos || []).map(m => this.convertMaterialToGoogleDriveFile(m))
    };
    
    console.log(`[getOrganizedMaterials] Returning organized materials:`, {
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
   * Enhanced material access with native StudyX format
   */
  async getSubjectMaterialsEnhanced(branchName: string, semester: string, subjectName: string): Promise<StudyXSubject | null> {
    const data = await this.loadStudyXData();
    const semesterKey = this.normalizeSemesterKey(semester);
    const branchData = this.getBranchData(data, branchName, semesterKey);
    
    if (!branchData) {
      return null;
    }

    const semesterData = branchData[semesterKey];
    if (!semesterData) {
      return null;
    }

    // Find the subject (case-insensitive search)
    const subjectKey = Object.keys(semesterData.subjects).find(
      key => key.toLowerCase() === subjectName.toLowerCase()
    );

    return subjectKey ? semesterData.subjects[subjectKey] : null;
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
  }
  /**
   * Get available branches
   */
  async getAvailableBranches(): Promise<string[]> {
    const data = await this.loadStudyXData();
    return Object.keys(data.materials.branches);
  }
  /**
   * Get available semesters for a branch
   */
  async getAvailableSemesters(branchName: string): Promise<string[]> {
    const data = await this.loadStudyXData();
    const branchKey = branchName.toUpperCase();
    
    // Common semesters (SEM1, SEM2) are available for all branches
    const commonSemesters = Object.keys(data.materials.common);
    
    // Branch-specific semesters
    const branchInfo = data.materials.branches[branchKey];
    const branchSpecificSemesters = branchInfo ? Object.keys(branchInfo.semesters) : [];
    
    return [...commonSemesters, ...branchSpecificSemesters].sort();
  }
  /**
   * Get available subjects for a branch and semester
   */
  async getAvailableSubjects(branchName: string, semester: string): Promise<string[]> {
    try {
      const data = await this.loadStudyXData();
      const semesterKey = this.normalizeSemesterKey(semester);
      console.log(`Looking for subjects in branch: ${branchName}, semester: ${semesterKey}`);
      
      const branchData = this.getBranchData(data, branchName, semesterKey);
      
      if (!branchData) {
        console.warn(`No branch data found for ${branchName}, semester ${semesterKey}`);
        return [];
      }

      const semesterData = branchData[semesterKey];
      if (!semesterData) {
        console.warn(`No semester data found for ${branchName}, semester ${semesterKey}`);
        return [];
      }

      const subjects = Object.keys(semesterData.subjects);
      console.log(`Found ${subjects.length} subjects for ${branchName}, semester ${semesterKey}`);
      return subjects;
    } catch (error) {
      console.error(`Error fetching subjects for ${branchName}, semester ${semester}:`, error);
      return [];
    }
  }

  /**
   * Get metadata about the StudyX collection
   */
  async getMetadata(): Promise<StudyXMetadata> {
    const data = await this.loadStudyXData();
    return data.metadata;
  }
  /**
   * Search subjects across all branches and semesters
   */
  async searchSubjects(query: string): Promise<Array<{branch: string, semester: string, subject: string}>> {
    const data = await this.loadStudyXData();
    const results: Array<{branch: string, semester: string, subject: string}> = [];
    const searchTerm = query.toLowerCase();

    // Search in common materials
    Object.keys(data.materials.common).forEach(semester => {
      const semesterData = data.materials.common[semester];
      Object.keys(semesterData.subjects).forEach(subjectKey => {
        const subject = semesterData.subjects[subjectKey];
        if (subject.name.toLowerCase().includes(searchTerm) || subjectKey.toLowerCase().includes(searchTerm)) {
          results.push({
            branch: 'common',
            semester,
            subject: subjectKey
          });
        }
      });
    });

    // Search in branch-specific materials
    Object.keys(data.materials.branches).forEach(branchKey => {
      const branchInfo = data.materials.branches[branchKey];
      Object.keys(branchInfo.semesters).forEach(semester => {
        const semesterData = branchInfo.semesters[semester];
        Object.keys(semesterData.subjects).forEach(subjectKey => {
          const subject = semesterData.subjects[subjectKey];
          if (subject.name.toLowerCase().includes(searchTerm) || subjectKey.toLowerCase().includes(searchTerm)) {
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
}

export const studyXDataService = new StudyXDataService();
