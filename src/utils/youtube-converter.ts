/**
 * YouTube URL conversion utilities
 * Converts various YouTube URL formats to yout-ube.com equivalents
 */

export interface ConversionResult {
  success: boolean;
  convertedUrl?: string;
  error?: string;
}

/**
 * Extract video ID from various YouTube URL formats
 * @param url - The YouTube URL to parse
 * @returns The video ID or null if not found
 */
function extractVideoId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    // Handle youtu.be short links
    if (hostname === 'youtu.be' || hostname === 'www.youtu.be') {
      const videoId = urlObj.pathname.slice(1).split('/')[0].split('?')[0];
      return videoId || null;
    }
    
    // Handle youtube.com links
    if (hostname === 'youtube.com' || 
        hostname === 'www.youtube.com' || 
        hostname === 'm.youtube.com' ||
        hostname === 'music.youtube.com') {
      
      // Check for /watch?v= format
      const vParam = urlObj.searchParams.get('v');
      if (vParam) {
        return vParam;
      }
      
      // Check for /embed/ format
      const embedMatch = urlObj.pathname.match(/^\/embed\/([^/?]+)/);
      if (embedMatch) {
        return embedMatch[1];
      }
      
      // Check for /v/ format
      const vMatch = urlObj.pathname.match(/^\/v\/([^/?]+)/);
      if (vMatch) {
        return vMatch[1];
      }
      
      // Check for /shorts/ format
      const shortsMatch = urlObj.pathname.match(/^\/shorts\/([^/?]+)/);
      if (shortsMatch) {
        return shortsMatch[1];
      }
      
      // Check for /live/ format
      const liveMatch = urlObj.pathname.match(/^\/live\/([^/?]+)/);
      if (liveMatch) {
        return liveMatch[1];
      }
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Check if a URL is a valid YouTube URL
 * @param url - The URL to validate
 * @returns True if the URL is a valid YouTube URL
 */
export function isYouTubeUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }
  
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    const validHosts = [
      'youtube.com',
      'www.youtube.com',
      'm.youtube.com',
      'music.youtube.com',
      'youtu.be',
      'www.youtu.be',
    ];
    
    return validHosts.includes(hostname);
  } catch (error) {
    return false;
  }
}

/**
 * Convert a YouTube URL to yout-ube.com format
 * @param inputUrl - The YouTube URL to convert
 * @returns ConversionResult with the converted URL or error
 */
export function convertYouTubeUrl(inputUrl: string): ConversionResult {
  // Validate input
  if (!inputUrl || typeof inputUrl !== 'string' || inputUrl.trim() === '') {
    return {
      success: false,
      error: 'emptyInput',
    };
  }
  
  const url = inputUrl.trim();
  
  // Check if it's a valid YouTube URL
  if (!isYouTubeUrl(url)) {
    return {
      success: false,
      error: 'invalidUrl',
    };
  }
  
  try {
    const urlObj = new URL(url);
    const videoId = extractVideoId(url);
    
    if (!videoId) {
      return {
        success: false,
        error: 'invalidUrl',
      };
    }
    
    // Build the yout-ube.com URL
    const convertedUrl = new URL('https://yout-ube.com/watch');
    convertedUrl.searchParams.set('v', videoId);
    
    // Preserve important query parameters
    const paramsToPreserve = ['t', 'list', 'index', 'start'];
    paramsToPreserve.forEach(param => {
      const value = urlObj.searchParams.get(param);
      if (value) {
        convertedUrl.searchParams.set(param, value);
      }
    });
    
    return {
      success: true,
      convertedUrl: convertedUrl.toString(),
    };
  } catch (error) {
    return {
      success: false,
      error: 'conversionFailed',
    };
  }
}

/**
 * Normalize a URL by adding protocol if missing
 * @param url - The URL to normalize
 * @returns The normalized URL
 */
export function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  
  // If it starts with youtube.com or youtu.be, add https://
  if (trimmed.match(/^(www\.)?(youtube\.com|youtu\.be|m\.youtube\.com|music\.youtube\.com)/i)) {
    return `https://${trimmed}`;
  }
  
  // If it doesn't have a protocol, add https://
  if (!trimmed.match(/^https?:\/\//i)) {
    return `https://${trimmed}`;
  }
  
  return trimmed;
}

