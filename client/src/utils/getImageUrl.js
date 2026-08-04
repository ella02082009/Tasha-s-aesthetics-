export const formatImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder.png'; // Fallback image

  const liveBackendUrl = import.meta.env.VITE_API_URL || 'https://tasha-s-aesthetics-.onrender.com';

  // Case 1: Database string contains 'http://localhost:5000'
  if (imagePath.includes('http://localhost:5000')) {
    return imagePath.replace('http://localhost:5000', liveBackendUrl);
  }

  // Case 2: Database string is already a full HTTPS URL
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Case 3: Database string is a relative path like '/uploads/image.png'
  return `${liveBackendUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};