export default async function handler(req, res) {
  const { tmdbId } = req.query;

  if (!tmdbId) {
    return res.status(400).json({
      success: false,
      message: '"tmdbId" parameter is required'
    });
  }

  try {
    const response = await fetch(
      `https://sonix-movies-v2-beta.vercel.app/api/subtitle?tmdbId=${encodeURIComponent(tmdbId)}&header=02movie`
    );

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      return res.status(502).json({
        success: false,
        message: 'Upstream returned non-JSON response',
        error: text
      });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching subtitles:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}
