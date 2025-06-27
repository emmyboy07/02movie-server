// pages/api/get-links.js

export default async function handler(req, res) {
  const { tmdbId } = req.query;

  if (!tmdbId) {
    return res.status(400).json({ success: false, message: '"tmdbId" parameter is required' });
  }

  try {
    const response = await fetch(
      `https://sonix-movies-v2-beta.vercel.app/api/get-movie-links?tmdbId=${tmdbId}&header=02movie`
    );

    const data = await response.json();

    // Just return what Sonix returned
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching movie links:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
}
