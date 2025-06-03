// Content fetching service for syllabus and videos JSON files from Google Drive
export interface SyllabusData {
  [unitKey: string]: string;
}

export interface VideoData {
  title: string;
  author: string;
  embedUrl: string;
  playlistUrl: string;
  thumbnailUrl: string;
}

export interface ContentFile {
  id: string;
  name: string;
  downloadUrl: string;
  viewUrl: string;
}

class ContentFetchingService {
  private cache = new Map<string, any>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // CORS proxy services in order of preference
  private readonly CORS_PROXIES = [
    'https://api.allorigins.win/raw?url=',
    'https://cors-anywhere.herokuapp.com/',
    'https://api.codetabs.com/v1/proxy?quest=',
    'https://thingproxy.freeboard.io/fetch/'
  ];

  /**
   * Convert Google Drive share URL to direct download URL
   */
  private convertToDirectDownloadUrl(url: string): string {
    // Handle Google Drive share URLs
    const driveRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9-_]+)/;
    const match = url.match(driveRegex);
    
    if (match) {
      const fileId = match[1];
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
    
    // Handle existing direct download URLs
    if (url.includes('drive.google.com/uc?') || url.includes('export=download')) {
      return url;
    }
    
    return url;
  }

  /**
   * Try fetching with CORS proxy
   */
  private async fetchWithCorsProxy(url: string): Promise<any> {
    const directUrl = this.convertToDirectDownloadUrl(url);
    
    for (let i = 0; i < this.CORS_PROXIES.length; i++) {
      const proxyUrl = this.CORS_PROXIES[i] + encodeURIComponent(directUrl);
      
      try {
        console.log(`[ContentFetching] Attempting CORS proxy ${i + 1}/${this.CORS_PROXIES.length}: ${this.CORS_PROXIES[i]}`);
        
        const response = await fetch(proxyUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json, text/plain, */*',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const text = await response.text();
        
        // Try to parse as JSON
        try {
          return JSON.parse(text);
        } catch (parseError) {
          // If it's not JSON, return the text
          console.warn(`[ContentFetching] Response is not JSON from proxy ${i + 1}, got:`, text.substring(0, 200));
          throw new Error('Response is not valid JSON');
        }
      } catch (error) {
        console.warn(`[ContentFetching] CORS proxy ${i + 1} failed:`, error);
        
        // If this is the last proxy, throw the error
        if (i === this.CORS_PROXIES.length - 1) {
          throw error;
        }
      }
    }
    
    throw new Error('All CORS proxies failed');
  }

  /**
   * Fetch JSON content from Google Drive URL with caching and CORS handling
   */
  private async fetchJsonFromUrl(url: string): Promise<any> {
    const cacheKey = url;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log(`[ContentFetching] Cache hit for: ${url}`);
      return cached.data;
    }

    console.log(`[ContentFetching] Fetching JSON from: ${url}`);

    try {
      // First try direct fetch (might work in development or if CORS is properly configured)
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/plain, */*',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Cache the result
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      console.log(`[ContentFetching] Successfully fetched via direct request`);
      return data;
    } catch (error) {
      console.warn(`[ContentFetching] Direct fetch failed, trying CORS proxy:`, error);
      
      try {
        const data = await this.fetchWithCorsProxy(url);
        
        // Cache the result
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now()
        });

        console.log(`[ContentFetching] Successfully fetched via CORS proxy`);
        return data;
      } catch (proxyError) {
        console.error(`[ContentFetching] All fetch methods failed for ${url}:`, proxyError);
        throw proxyError;
      }
    }
  }

  /**
   * Fetch syllabus data from DotNotes syllabus JSON files
   */
  async fetchSyllabusData(syllabusFiles: ContentFile[]): Promise<SyllabusData | null> {
    if (!syllabusFiles || syllabusFiles.length === 0) {
      return null;
    }

    try {
      // Try to fetch from the first syllabus file
      const syllabusFile = syllabusFiles[0];
      console.log(`[ContentFetching] Fetching syllabus from: ${syllabusFile.name}`);
      
      const syllabusData = await this.fetchJsonFromUrl(syllabusFile.downloadUrl);
      
      // Validate syllabus structure
      if (typeof syllabusData !== 'object' || syllabusData === null) {
        throw new Error('Invalid syllabus data structure');
      }

      console.log(`[ContentFetching] Successfully fetched syllabus with ${Object.keys(syllabusData).length} units`);
      return syllabusData as SyllabusData;
    } catch (error) {
      console.error('[ContentFetching] Failed to fetch syllabus data:', error);
      return null;
    }
  }

  /**
   * Fetch videos data from DotNotes videos JSON files
   */
  async fetchVideosData(videosFiles: ContentFile[]): Promise<VideoData[]> {
    if (!videosFiles || videosFiles.length === 0) {
      return [];
    }

    try {
      // Try to fetch from the first videos file
      const videosFile = videosFiles[0];
      console.log(`[ContentFetching] Fetching videos from: ${videosFile.name}`);
      
      const videosData = await this.fetchJsonFromUrl(videosFile.downloadUrl);
      
      // Validate videos structure
      if (!Array.isArray(videosData)) {
        throw new Error('Invalid videos data structure - expected array');
      }

      // Validate each video object
      const validVideos = videosData.filter((video: any) => {
        return video && 
               typeof video.title === 'string' && 
               typeof video.author === 'string' && 
               typeof video.embedUrl === 'string';
      });

      console.log(`[ContentFetching] Successfully fetched ${validVideos.length} videos`);
      return validVideos as VideoData[];
    } catch (error) {
      console.error('[ContentFetching] Failed to fetch videos data:', error);
      return [];
    }
  }
  /**
   * Clear cache (useful for testing or manual refresh)
   */
  clearCache(): void {
    this.cache.clear();
    console.log('[ContentFetching] Cache cleared');
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  /**
   * Test CORS proxy functionality with a known Google Drive URL
   */
  async testCorsProxy(testUrl?: string): Promise<{ success: boolean; method: string; error?: string }> {
    const url = testUrl || 'https://drive.google.com/uc?export=download&id=1example';
    
    try {
      // Try direct fetch first
      await fetch(url, { method: 'HEAD' });
      return { success: true, method: 'direct' };
    } catch (directError) {
      try {
        // Try CORS proxy
        await this.fetchWithCorsProxy(url);
        return { success: true, method: 'cors-proxy' };
      } catch (proxyError) {
        return { 
          success: false, 
          method: 'none', 
          error: `Direct: ${directError}, Proxy: ${proxyError}` 
        };
      }
    }
  }

  /**
   * Get available CORS proxies
   */
  getAvailableProxies(): string[] {
    return [...this.CORS_PROXIES];
  }
}

export const contentFetchingService = new ContentFetchingService();
