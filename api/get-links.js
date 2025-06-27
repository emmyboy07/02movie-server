export default async function handler(req, res) {
  const { tmdbId, type } = req.query;

  if (!tmdbId) {
    return res.status(400).json({ success: false, message: '"tmdbId" parameter is required' });
  }

  let finalType = type || 'movie';
  let watchId = tmdbId;

  // Detect if it's a TV episode from format: tvId/season/episode
  if (tmdbId.includes('/') && !type) {
    finalType = 'tv'; // auto-detect
  }

  try {
    // Step 1: Get download links from Sonix backend
    const sonixRes = await fetch(
      `https://sonix-movies-v2-beta.vercel.app/api/get-movie-links?tmdbId=${tmdbId}&header=02movie`
    );
    const sonixData = await sonixRes.json();

    // Step 2: Get watch stream from /api/watch
    const watchRes = await fetch(
      `https://sonix-movies.vercel.app/api/watch?type=${finalType}&id=${watchId}&header=02movie`
    );
    const watchData = await watchRes.json();

    return res.status(200).json({
      success: true,
      heading: watchData.heading || 'SONiX MOVIES',
      title: watchData.title || sonixData.title || 'Untitled',
      imdbId: watchData.imdbId || null,
      tmdbId,
      videoUrl: watchData.videoUrl || null,
      videoSources: watchData.videoSources || [],
      downloadLinks: sonixData.downloadLinks || [],
      subtitles: sonixData.subtitles || [],
      message: 'Data fetched successfully from both APIs.'
    });

  } catch (error) {
    console.error('Error fetching movie/TV data:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
}
