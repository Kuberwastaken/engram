// Configuration for materials hosting via JSDelivr CDN
// This fetches files directly from the engram-files GitHub repository
// using JSDelivr's free CDN service - no environment variables needed

export interface MaterialConfig {
  // Base URL for materials via JSDelivr CDN
  baseUrl: string;
  
  // Alternative CDN endpoints
  fallbackUrls: string[];
  
  // GitHub repository info
  repository: {
    owner: string;
    name: string;
    branch: string;
  };
}

// Configuration using JSDelivr CDN - completely free and open source
export const MATERIALS_CONFIG: MaterialConfig = {
  // JSDelivr CDN URL for direct file access
  baseUrl: 'https://cdn.jsdelivr.net/gh/kuberwastaken/engram-files@main/',
  
  // Alternative CDN endpoints for redundancy
  fallbackUrls: [
    'https://raw.githubusercontent.com/kuberwastaken/engram-files/main/',
    'https://gitcdn.xyz/repo/kuberwastaken/engram-files/main/',
  ],
  
  // Repository information
  repository: {
    owner: 'kuberwastaken',
    name: 'engram-files',
    branch: 'main'
  }
};

// Helper function to construct material URLs
export const getMaterialUrl = (branch: string, semester: string, subject: string, resourceType: string, filename: string): string => {
  const { baseUrl } = MATERIALS_CONFIG;
  
  // JSDelivr CDN URL pattern: baseUrl + branch/semester/subject/resourceType/filename
  const path = `${branch}/${semester}/${encodeURIComponent(subject)}/${resourceType}/${encodeURIComponent(filename)}`;
  return `${baseUrl}${path}`;
};

// Helper function to get fallback URLs for a material
export const getMaterialFallbackUrls = (branch: string, semester: string, subject: string, resourceType: string, filename: string): string[] => {
  const { fallbackUrls } = MATERIALS_CONFIG;
  const path = `${branch}/${semester}/${encodeURIComponent(subject)}/${resourceType}/${encodeURIComponent(filename)}`;
  
  return fallbackUrls.map(baseUrl => `${baseUrl}${path}`);
};

// Helper function to check if a material exists (with fallback)
export const checkMaterialExists = async (url: string, fallbackUrls: string[] = []): Promise<string | null> => {
  const urlsToTry = [url, ...fallbackUrls];
  
  for (const tryUrl of urlsToTry) {
    try {
      const response = await fetch(tryUrl, { method: 'HEAD' });
      if (response.ok) {
        return tryUrl;
      }
    } catch {
      // Continue to next URL
    }
  }
  
  return null;
};

// Helper function to download a material with fallback
export const downloadMaterial = async (branch: string, semester: string, subject: string, resourceType: string, filename: string): Promise<void> => {
  const primaryUrl = getMaterialUrl(branch, semester, subject, resourceType, filename);
  const fallbackUrls = getMaterialFallbackUrls(branch, semester, subject, resourceType, filename);
  
  const workingUrl = await checkMaterialExists(primaryUrl, fallbackUrls);
  
  if (workingUrl) {
    // Create download link and trigger download
    const link = document.createElement('a');
    link.href = workingUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    throw new Error(`Material not found: ${filename}`);
  }
};
