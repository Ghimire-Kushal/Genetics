# GScope AI - Frontend

A futuristic, AI-powered genomic mutation analysis dashboard built with Next.js 15, TypeScript, Tailwind CSS, Framer Motion, and Recharts.

## 🚀 Features

- **Landing Page**: Stunning hero section with animated background and interactive workflow showcase
- **Dataset Upload**: Drag-and-drop file upload interface with real-time progress tracking
- **AI-Powered Analysis**: Integration with backend APIs for genomic mutation analysis
- **Interactive Dashboard**: Real-time visualization of mutation patterns, pathogenicity distribution, and mutation types
- **Advanced Charts**: Recharts visualizations for comprehensive data analysis
- **AI Insights**: Machine-learning generated insights with confidence scores
- **Risk Assessment**: Visual risk profile with recommendations
- **Responsive Design**: Mobile-first, fully responsive layout
- **Dark Theme**: Premium glassmorphism aesthetic with custom color palette
- **Smooth Animations**: Framer Motion transitions for polished user experience

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion
- **Data Visualization**: Recharts
- **UI Components**: shadcn/ui
- **HTTP Client**: Axios
- **Icons**: Lucide React

## 📁 Project Structure

```
frontend/
├── app/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   └── dashboard/
│       └── page.tsx          # Analysis dashboard
├── components/
│   ├── navbar.tsx            # Navigation bar
│   ├── hero-section.tsx      # Hero section
│   ├── problem-section.tsx   # Problem showcase
│   ├── workflow-section.tsx  # How it works
│   ├── upload-component.tsx  # File upload interface
│   ├── insights-display.tsx  # AI insights display
│   ├── footer.tsx            # Footer
│   ├── dna-background.tsx    # Animated DNA helix background
│   └── ui/                   # shadcn/ui components
├── charts/
│   └── mutation-charts.tsx   # Recharts visualizations
├── hooks/
│   ├── useAnalysis.ts        # Analysis state management
│   └── use-mobile.ts         # Mobile detection
├── lib/
│   ├── api.ts                # API client
│   ├── constants.ts          # Color palette and constants
│   └── utils.ts              # Utility functions
├── types/
│   └── index.ts              # TypeScript type definitions
└── public/                   # Static assets
```

## 🎨 Color Palette

- **Background**: `#0B1020` - Deep space black
- **Card Background**: `#121A2F` - Dark navy
- **Primary**: `#3B82F6` - Electric blue
- **Accent**: `#06B6D4` - Cyan
- **Secondary**: `#8B5CF6` - Purple
- **Text**: `#E5E7EB` - Light gray
- **Muted**: `#94A3B8` - Muted gray

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
# Create a .env.local file in the frontend directory
NEXT_PUBLIC_API_URL=https://genetics-jqlc.onrender.com
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📡 API Integration

The frontend connects to the backend API with these endpoints:

- `POST /upload` - Upload genomic dataset
- `POST /analyze` - Trigger AI analysis on uploaded data
- `GET /results/:analysisId` - Retrieve analysis results

## 🎯 Key Components

### UploadComponent
Drag-and-drop file upload with validation and progress tracking.

```tsx
<UploadComponent onFileSelect={handleFileSelect} loading={loading} error={error} />
```

### MutationBarChart
Display mutation frequencies by gene.

```tsx
<MutationBarChart data={mutationData} title="Top Mutations" />
```

### PathogenicityPieChart
Visualize pathogenicity distribution.

```tsx
<PathogenicityPieChart 
  pathogenic={34}
  likely_pathogenic={15}
  uncertain={20}
  likely_benign={30}
  benign={28}
/>
```

## 🎬 Animation Features

- Framer Motion for smooth page transitions
- Animated hero section with gradient text
- Floating particle animations in background
- Interactive hover effects on cards
- Progress bar animations for file uploads
- Staggered component animations

## 📊 Dashboard Workflow

1. **Upload**: User uploads a genomic dataset (CSV, VCF, JSON)
2. **Analysis**: Backend processes the file using AI algorithms
3. **Visualization**: Results displayed in interactive charts
4. **Insights**: AI-generated insights and risk assessment
5. **Download**: Option to export analysis report

## 🔐 Security Features

- File size validation (max 10MB)
- Supported file format validation
- Secure API communication with Axios
- Environment variable protection
- Type-safe API calls with TypeScript

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Optimized layouts for all screen sizes
- Touch-friendly interactive elements

## 🧪 Testing

```bash
# Run linting
npm run lint
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Deploy to Vercel
vercel deploy
```

### Docker

```bash
# Build Docker image
docker build -t genescope-ai .

# Run container
docker run -p 3000:3000 genescope-ai
```

## 📝 Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_API_URL=https://genetics-jqlc.onrender.com
```

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, email support@genescope-ai.com or open an issue on GitHub.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Animated with [Framer Motion](https://www.framer.com/motion/)
- Charts by [Recharts](https://recharts.org/)
- Icons from [Lucide React](https://lucide.dev/)
- UI Components from [shadcn/ui](https://ui.shadcn.com/)
