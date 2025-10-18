# Nature Village - Middle Eastern Restaurant Website

A modern, multilingual website for Nature Village Middle Eastern Restaurant built with Next.js and Tailwind CSS.

## Features

- 🌍 **Multilingual Support**: English and Arabic (العربية)
- 📱 **Responsive Design**: Mobile-first approach with modern UI/UX
- 🍽️ **MenuIQ Integration**: AI-enhanced menu management system
- 🎨 **Middle Eastern Cultural Elements**: Traditional patterns and cultural design
- ⚡ **Performance Optimized**: Fast loading with Next.js optimization
- 🔒 **Security Headers**: Enhanced security with proper headers configuration

## Tech Stack

- **Framework**: Next.js 14.2.31
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Language**: JavaScript/JSX
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd nvtest-claude
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── components/
│   └── NatureVillageWebsite.js    # Main website component
├── pages/
│   ├── _app.js                    # App wrapper with global styles
│   ├── index.js                   # Homepage
│   └── api/                       # API routes
│       ├── menu.js                # Menu API endpoint
│       └── reservation.js         # Reservation API endpoint
├── styles/
│   └── globals.css                # Global styles and Tailwind imports
├── public/                        # Static assets
├── next.config.js                 # Next.js configuration
├── tailwind.config.js             # Tailwind CSS configuration
├── postcss.config.js              # PostCSS configuration
└── vercel.json                    # Vercel deployment configuration
```

## Features Overview

### Multilingual Support
- RTL (Right-to-Left) support for Arabic
- Dynamic language switching
- Culturally appropriate typography and layouts

### Sections
- **Hero**: Eye-catching banner with Middle Eastern patterns
- **Featured Dishes**: Showcase of popular menu items
- **Menu**: Complete menu with filtering options
- **About**: Restaurant story and heritage
- **Gallery**: Visual showcase of food and ambiance
- **Visit Us**: Location, hours, and contact information
- **Footer**: Additional links and contact details

### MenuIQ Integration
The website includes placeholder integration for MenuIQ, an AI-enhanced dining experience platform that can provide:
- Dynamic menu updates
- Nutritional information
- Allergen tracking
- Personalized recommendations

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Vercel will automatically detect it's a Next.js project
3. Deploy with default settings

### Manual Deployment

1. Build the project
```bash
npm run build
```

2. The build output will be in `.next/` directory
3. Deploy to your preferred hosting platform

## Configuration

### Environment Variables

Create a `.env.local` file for local development:

```env
# Add your environment variables here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Customization

- **Colors**: Modify `tailwind.config.js` for brand colors
- **Content**: Update translations in `components/NatureVillageWebsite.js`
- **Images**: Replace placeholder images with actual restaurant photos
- **Contact**: Update contact information and location details

## Security

The website includes security headers configured in `vercel.json`:
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Referrer-Policy
- CORS headers for API routes

## Performance

- Optimized images with Next.js Image component
- Code splitting and lazy loading
- Minimal bundle size
- Fast page transitions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact the development team or create an issue in the repository.

---

Built with ❤️ for Nature Village Middle Eastern Restaurant
