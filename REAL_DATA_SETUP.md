# Real Restaurant Data Integration Setup

This system can integrate with multiple real data sources instead of using assumptions:

## 🔌 Available Data Sources

### 1. Google Places API (Recommended)
- **Real-time open/closed status**
- **Accurate business hours**
- **Popular times data** (with third-party services)
- **High reliability**

**Setup:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable Places API
3. Create API credentials
4. Find your restaurant's Place ID

### 2. Yelp Fusion API
- **Business hours and status**
- **Restaurant information**
- **Customer reviews data**

**Setup:**
1. Visit [Yelp Developers](https://www.yelp.com/developers)
2. Create developer account
3. Register your application
4. Get API key and business ID

### 3. POS System Integration
- **Real-time order volume**
- **Actual wait times**
- **Kitchen capacity status**
- **Most accurate busy levels**

**Setup:**
- Contact your POS system provider
- Request API access or webhook endpoints
- Popular systems: Square, Toast, Clover, etc.

### 4. Website Analytics (Already Active)
- **Current website visitors**
- **Order button clicks**
- **Page engagement metrics**

## 🚀 How to Enable Real Data

1. **Copy environment file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Add your API keys to `.env.local`:**
   ```
   NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_key_here
   NEXT_PUBLIC_RESTAURANT_PLACE_ID=your_place_id_here
   NEXT_PUBLIC_YELP_API_KEY=your_yelp_key_here
   NEXT_PUBLIC_YELP_BUSINESS_ID=your_business_id_here
   ```

3. **Restart your development server:**
   ```bash
   npm run dev
   ```

## 📊 Data Priority Order

1. **POS System** (most accurate - real kitchen data)
2. **Google Places** (reliable business hours)
3. **Yelp** (backup business status)
4. **Time-based calculation** (fallback when no APIs available)

## 🔄 Real-time Updates

- **With APIs:** Updates every 2 minutes
- **Fallback mode:** Updates every 5 minutes
- **Automatic failover** if APIs are unavailable

## 🎯 Benefits of Real Data

- **Accurate open/closed status** from business systems
- **Real busy levels** based on actual orders
- **Reliable hours** that update automatically
- **Customer trust** with "LIVE" data indicators
- **Better user experience** with accurate information

## 🛠️ Current Status

The system will automatically detect which data sources are available and use them in priority order. If no real data sources are configured, it falls back to intelligent time-based calculations.

Check the browser console for logs showing which data source is being used.
