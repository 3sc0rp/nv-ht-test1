// Yelp Fusion API integration for restaurant data
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { businessId, apiKey } = req.body;

  if (!businessId || !apiKey) {
    return res.status(400).json({ error: 'Missing businessId or apiKey' });
  }

  try {
    const yelpUrl = `https://api.yelp.com/v3/businesses/${businessId}`;
    
    const response = await fetch(yelpUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Yelp API error: ${response.status}`);
    }

    const result = {
      is_open_now: data.hours?.[0]?.is_open_now || false,
      hours: data.hours || [],
      name: data.name,
      location: data.location,
      timestamp: new Date().toISOString(),
      source: 'yelp'
    };

    res.status(200).json(result);

  } catch (error) {
    console.error('Yelp API error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch restaurant data from Yelp',
      details: error.message 
    });
  }
}
