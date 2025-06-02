import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a subject name string to be more readable
 * Example: "applied-mathematics-2" -> "Applied Mathematics 2"
 * @param subjectName The subject name to format
 * @returns Formatted subject name with proper capitalization and spacing
 */
export function formatSubjectName(subjectName: string): string {
  if (!subjectName) return "";
  
  // Replace hyphens and underscores with spaces
  let formatted = subjectName.replace(/[-_]/g, ' ');
  
  // Capitalize the first letter of each word
  formatted = formatted.replace(/\w\S*/g, (word) => {
    // Don't capitalize certain words like "of", "and", "the" if they're not the first word
    const lowercaseWords = ['of', 'and', 'the', 'in', 'on', 'at', 'to', 'for', 'with'];
    
    // Check if the word is numeric (e.g., "2" in "Mathematics 2")
    if (/^\d+$/.test(word)) {
      return word;
    }
    
    // Check if the word should remain lowercase
    if (lowercaseWords.includes(word.toLowerCase()) && formatted.indexOf(word) !== 0) {
      return word.toLowerCase();
    }
    
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
  
  return formatted;
}
