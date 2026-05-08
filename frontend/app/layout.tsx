import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { COLORS } from '@/lib/constants'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'GeneScope AI - AI-Powered Genomic Mutation Analysis',
  description: 'Advanced AI platform for analyzing genomic datasets and identifying mutations with unprecedented accuracy.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
          :root {
            --background: ${COLORS.background};
            --card-bg: ${COLORS.cardBg};
            --primary: ${COLORS.primary};
            --accent: ${COLORS.accent};
            --secondary: ${COLORS.secondary};
            --text: ${COLORS.text};
            --muted: ${COLORS.muted};
          }
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          html {
            scroll-behavior: smooth;
          }
          body {
            background-color: ${COLORS.background};
            color: ${COLORS.text};
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
              'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
              sans-serif;
          }
          body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
                        radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
                        radial-gradient(circle at 50% 0%, rgba(6, 182, 212, 0.05) 0%, transparent 50%);
            pointer-events: none;
            z-index: -1;
          }
        `}</style>
      </head>
      <body>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
