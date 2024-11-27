import EXIF from 'exif-js';

export async function extractTheme(imageFile: File): Promise<string[]> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = function(event) {
      if (!event.target?.result) {
        resolve([]);
        return;
      }

      try {
        // Try to extract theme from metadata
        const content = event.target.result.toString();
        const metadataMatch = content.match(/"theme":\s*"([^"]+)"/);
        
        if (metadataMatch && metadataMatch[1]) {
          const themeText = metadataMatch[1];
          
          // Extract emoji if present (unicode escapes)
          const emojiMatch = themeText.match(/\\u[\dA-Fa-f]{4}\\u[\dA-Fa-f]{4}/);
          const emoji = emojiMatch ? String.fromCodePoint(
            parseInt(emojiMatch[0].slice(2, 6), 16),
            parseInt(emojiMatch[0].slice(8, 12), 16)
          ) : '';
          
          // Get clean theme name
          const cleanTheme = themeText
            .replace(/\\u[\dA-Fa-f]{4}/g, '')
            .replace(/[^\x20-\x7E]/g, '')
            .trim();
          
          if (cleanTheme) {
            // Return both emoji and theme name if emoji exists
            resolve(emoji ? [emoji + ' ' + cleanTheme] : [cleanTheme]);
            return;
          }
        }
      } catch (error) {
        console.error('Error extracting theme:', error);
      }

      // If no theme found in metadata, resolve with empty array
      resolve([]);
    };

    reader.onerror = function() {
      resolve([]);
    };

    // Read the file as text to look for metadata
    reader.readAsText(imageFile);
  });
}
