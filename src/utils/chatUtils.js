/**
 * Formats a date into a time string
 * @param {Date} date - The date to format
 * @returns {string} Formatted time string
 */
export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * Determines the type of file
 * @param {File} file - The file to check
 * @returns {string} The type of file ('image', 'video', or 'file')
 */
export const getFileType = (file) => {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('video/')) return 'video';
  return 'file';
};

/**
 * Formats file size into human readable string
 * @param {number} bytes - The size in bytes
 * @returns {string} Formatted size string
 */
export const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
};

/**
 * Scrolls an element to its bottom
 * @param {React.RefObject} elementRef - Reference to the element
 */
export const scrollToBottom = (elementRef) => {
  if (elementRef.current) {
    elementRef.current.scrollTop = elementRef.current.scrollHeight;
  }
};
