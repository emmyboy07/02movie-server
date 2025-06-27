export default async function handler(req, res) {
  const { type, id } = req.query;

  if (!type || !id) {
    return res.status(400).json({ success: false, message: '"type" and "id" parameters are required' });
  }

  try {
    const response = await fetch(
      `https://sonix-movies-v2.vercel.app/api/watch?type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}&header=02movie`
    );

    const data = await response.json();

    // Just return what Sonix returned
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching watch data:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
}
