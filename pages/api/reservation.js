export default function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, phone, date, time, guests, message } = req.body
    
    // Basic validation
    if (!name || !email || !phone || !date || !time || !guests) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      })
    }
    
    // Here you would integrate with your reservation system
    // For example: send email, save to database, integrate with booking platform
    
    // Simulate processing
    console.log('Reservation request:', {
      name,
      email,
      phone,
      date,
      time,
      guests,
      message
    })
    
    // Return success response
    res.status(200).json({
      success: true,
      message: 'Reservation request received. We will contact you shortly to confirm.',
      reservationId: `NV-${Date.now()}`,
      details: {
        name,
        date,
        time,
        guests
      }
    })
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}