
// pages/api/get-series-episode-links.js

export default async function handler(req, res) {
  const { id, season, episode } = req.query;

  if (!id || !season || !episode) {
    return res.status(400).json({ success: false, message: '"id", "season", and "episode" parameters are required' });
  }

  try {
    const response = await fetch(
      `https://sonix-movies-v2-beta.vercel.app/api/series?id=${encodeURIComponent(id)}&season=${encodeURIComponent(season)}&episode=${encodeURIComponent(episode)}&header=02movie`
    );

    const data = await response.json();

    // Just return what Sonix returned
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching series episode links:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
}
