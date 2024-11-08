export const formatAvatarUrl = (url) => {
  if (!url) return null;
  
  // If the URL is already a full URL (starts with http:// or https://)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If the URL already contains '/api/uploads/', just return it
  if (url.includes('/api/uploads/')) return url;
  
  // If it's just the filename or starts with avatars/, add the full path
  if (url.startsWith('avatars/') || !url.includes('/')) {
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