// Google Places API integration for real restaurant data
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { placeId, apiKey } = req.body;

  if (!placeId || !apiKey) {
    return res.status(400).json({ error: 'Missing placeId or apiKey' });
  }

  try {
    // Fetch place details from Google Places API
    const placeDetailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=opening_hours,business_status&key=${apiKey}`;
    
    const response = await fetch(placeDetailsUrl);
    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Google Places API error: ${data.status}`);
    }

    // Fetch popular times (requires additional API call or third-party service)
    // Note: Google doesn't provide popular times through official API
    // You would need to use services like Populartimes library or similar
    
    const result = {
      opening_hours: data.result.opening_hours,
      business_status: data.result.business_status,
      popular_times: null, // Would need third-party service
      timestamp: new Date().toISOString(),
      source: 'google-places'
    };

    res.status(200).json(result);

  } catch (error) {
    console.error('Google Places API error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch restaurant data',
      details: error.message 
    });
  }
}
