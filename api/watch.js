// pages/api/watch-friend.js
export default async function handler(req, res) {
  const { type, id } = req.query;

  if (!type || !id) {
    return res.status(400).json({ success: false, message: '"type" and "id" parameters are required' });
  }

  try {
    const response = await fetch(
      `https://sonix-movies-v2-beta.vercel.app/api/watch?type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}&header=02movie`
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
    console.error('Error fetching watch data:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
}
