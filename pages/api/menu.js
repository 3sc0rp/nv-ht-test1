// API endpoint for MenuIQ integration
export default function handler(req, res) {
  if (req.method === 'GET') {
    // This would connect to your actual MenuIQ backend
    const menuData = {
      items: [
        {
          id: 1,
          name: { 
            en: 'Kebab-e Kubideh', 
            ku: 'کەباب کوبیده', 
            ar: 'كباب كوبيده' 
          },
          description: {
            en: 'Traditional ground lamb kebab with aromatic spices, served with basmati rice and grilled tomatoes',
            ku: 'کەبابی نەریتی لە گۆشتی بەرخی هاڕاو لەگەڵ بۆنوبێرینی جۆراوجۆر، لەگەڵ برنجی باسماتی و تەماتەی برژاو',
            ar: 'كباب لحم الخروف المفروم التقليدي مع التوابل العطرة، يُقدم مع أرز البسمتي والطماطم المشوية'
          },
          price: 18.99,
          category: 'traditional',
          popular: true,
          available: true,
          allergens: ['none'],
          nutritionalInfo: {
            calories: 450,
            protein: 35,
            carbs: 12,
            fat: 28
          },
          image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=300&h=200&fit=crop'
        },
        {
          id: 2,
          name: { 
            en: 'Dolma', 
            ku: 'دۆڵمە', 
            ar: 'دولمة' 
          },
          description: {
            en: 'Grape leaves stuffed with rice, herbs, and spices - a Kurdish family recipe',
            ku: 'گەڵای مێو پڕکراو لە برنج و ڕووەک و بۆنوبێرین - ڕیسەتی خێزانی کوردی',
            ar: 'أوراق العنب محشوة بالأرز والأعشاب والتوابل - وصفة عائلية كردية'
          },
          price: 14.99,
          category: 'vegan',
          popular: false,
          available: true,
          allergens: ['none'],
          nutritionalInfo: {
            calories: 320,
            protein: 8,
            carbs: 45,
            fat: 12
          },
          image: 'https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?w=300&h=200&fit=crop'
        }
      ],
      categories: ['traditional', 'vegan', 'dessert', 'soup'],
      lastUpdated: new Date().toISOString()
    }
    
    res.status(200).json(menuData)
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}