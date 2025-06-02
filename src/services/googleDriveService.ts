// Google Drive Service for accessing materials from dotnotes extraction report

export interface GoogleDriveFile {
  name?: string;
  id?: string;
  downloadUrl: string;
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

export interface SemesterData {
  subjects: number;
  files: number;
  subjectDetails: SubjectData[];
}

export interface BranchData {
  branchId: string;
  semesters: Record<string, SemesterData>;
  totalSubjects: number;
  totalFiles: number;
  startTime: string;
  endTime: string;
}

export interface ExtractedData {
  branches: Record<string, BranchData>;
}

class GoogleDriveService {
  private extractedData: ExtractedData | null = null;

  async loadExtractedData(): Promise<ExtractedData> {
    if (this.extractedData) {
      return this.extractedData;
    }

    try {
      const response = await fetch('/extraction-reports/dotnotes_clean_extraction_report.json');
      if (!response.ok) {
        throw new Error('Failed to load extraction report');
      }
      this.extractedData = await response.json() as ExtractedData;
      return this.extractedData;
    } catch (error) {
      console.error('Error loading extracted data:', error);
      throw error;
    }
  }  /**
   * Get materials for a specific subject
   */  async getSubjectMaterials(branchName: string, semester: string, subjectName: string): Promise<SubjectData | null> {
    const data = await this.loadExtractedData();
    
    // Convert branch name to match the data format
    const branchKey = branchName.toUpperCase();
      // Convert semester format from URL format (2ND, 3RD) to data format (SEM3, SEM4)
    let semesterKey = semester.toUpperCase();
    if (semesterKey.includes('2ND')) {
      semesterKey = 'SEM3';
    } else if (semesterKey.includes('3RD')) {
      semesterKey = 'SEM4';
    } else {
      // Handle existing SEM format
      semesterKey = semester.replace(/sem-?/i, 'SEM').toUpperCase();
    }
    
    const branch = data.branches[branchKey];
    if (!branch) {
      console.warn(`Branch ${branchKey} not found`);
      return null;
    }

    const semesterData = branch.semesters[semesterKey];
    if (!semesterData) {
      console.warn(`Semester ${semesterKey} not found for branch ${branchKey}`);
      return null;
    }

    // Find the subject (case-insensitive search)
    const subject = semesterData.subjectDetails.find(
      s => s.name.toLowerCase() === subjectName.toLowerCase()
    );

    return subject || null;
  }  /**
   * Get all materials organized by folder type for a subject
   */
  async getOrganizedMaterials(branchName: string, semester: string, subjectName: string) {
    const subjectData = await this.getSubjectMaterials(branchName, semester, subjectName);
    if (!subjectData) {
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

    const organized: Record<string, GoogleDriveFile[]> = {
      notes: [],
      pyqs: [],
      books: [],
      lab: [],
      akash: [],
      syllabus: [],
      videos: []
    };

    // Organize files by folder type
    subjectData.folderDetails.forEach(folder => {
      const folderName = folder.name.toLowerCase();
      
      if (folderName.includes('note')) {
        organized.notes.push(...folder.fileDetails);
      } else if (folderName.includes('pyq') || folderName.includes('previous') || folderName.includes('exam')) {
        organized.pyqs.push(...folder.fileDetails);
      } else if (folderName.includes('book')) {
        organized.books.push(...folder.fileDetails);
      } else if (folderName.includes('lab') || folderName.includes('practical')) {
        organized.lab.push(...folder.fileDetails);
      } else if (folderName.includes('akash')) {
        organized.akash.push(...folder.fileDetails);
      } else if (folderName.includes('syllabus')) {
        organized.syllabus.push(...folder.fileDetails);
      } else if (folderName.includes('video')) {
        organized.videos.push(...folder.fileDetails);
      } else {
        // Default to notes if unclear
        organized.notes.push(...folder.fileDetails);
      }
    });

    return organized;
  }
  /**
   * Convert Google Drive file ID to embeddable URL
   */
  getEmbedUrl(fileId: string): string {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }

  /**
   * Convert Google Drive file ID to viewable URL
   */
  getViewUrl(fileId: string): string {
    return `https://drive.google.com/file/d/${fileId}/view`;
  }

  /**
   * Get download URL (already provided in the data)
   */
  getDownloadUrl(file: GoogleDriveFile): string {
    return file.downloadUrl;
  }

  /**
   * Extract file ID from Google Drive download URL
   */
  extractFileIdFromUrl(downloadUrl: string): string | null {
    const match = downloadUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  }

  /**
   * Get file ID, extracting from URL if not provided
   */
  getFileId(file: GoogleDriveFile): string | null {
    if (file.id) {
      return file.id;
    }
    return this.extractFileIdFromUrl(file.downloadUrl);
  }

  /**
   * Get file name, generating from URL or using a default if not provided
   */
  getFileName(file: GoogleDriveFile): string {
    if (file.name) {
      return file.name;
    }
    
    // Try to extract filename from URL or use a generic name
    const fileId = this.getFileId(file);
    return fileId ? `Document_${fileId.substring(0, 8)}.pdf` : 'Untitled Document.pdf';
  }

  /**
   * Check if file is a PDF
   */
  isPdfFile(fileName: string): boolean {
    return fileName.toLowerCase().endsWith('.pdf');
  }

  /**
   * Get available branches
   */
  async getAvailableBranches(): Promise<string[]> {
    const data = await this.loadExtractedData();
    return Object.keys(data.branches);
  }

  /**
   * Get available semesters for a branch
   */
  async getAvailableSemesters(branchName: string): Promise<string[]> {
    const data = await this.loadExtractedData();
    const branch = data.branches[branchName.toUpperCase()];
    if (!branch) return [];
    
    return Object.keys(branch.semesters);
  }

  /**
   * Get available subjects for a branch and semester
   */
  async getAvailableSubjects(branchName: string, semester: string): Promise<string[]> {
    const data = await this.loadExtractedData();
    const branchKey = branchName.toUpperCase();
    const semesterKey = semester.replace(/sem-?/i, 'SEM').toUpperCase();
    
    const branch = data.branches[branchKey];
    if (!branch) return [];

    const semesterData = branch.semesters[semesterKey];
    if (!semesterData) return [];

    return semesterData.subjectDetails.map(s => s.name);
  }
}

export const googleDriveService = new GoogleDriveService();
