export const formatAvatarUrl = (url) => {
  if (!url) return '';
  
  // If the URL already contains '/api/uploads/', just return it
  if (url.includes('/api/uploads/')) return url;
  
  // If it's just the filename or starts with avatars/, add the full path
  if (url.startsWith('avatars/') || !url.startsWith('/')) {
    return `/api/uploads/${url}`;
  }
  
  // If it starts with /uploads/, add /api prefix
  if (url.startsWith('/uploads/')) {
    return `/api${url}`;
  }
  
  // Remove any leading slashes and ensure proper path
  const cleanPath = url.replace(/^\/+/, '');
  return `/api/uploads/${cleanPath}`;
}; 