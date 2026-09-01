import { ChatInterface } from '@/components/chat/ChatInterface';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-950">
      <ChatInterface />
    </main>
  );
}
// app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FlyRank Capstone | Interactive AI Chat & 3D Showcase',
  description: 'A responsive, accessible Next.js AI chat interface and R3F 3D experience featuring real-time streaming and robust UI/UX design.',
  openGraph: {
    title: 'FlyRank Capstone | Interactive AI Showcase',
    description: 'Explore the interactive AI chat interface and 3D web experience built with Next.js 16 and Tailwind CSS.',
    url: 'https://flyrank-capstone.vercel.app',
    siteName: 'FlyRank Capstone Portfolio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FlyRank Capstone Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FlyRank Capstone | Interactive AI Showcase',
    description: 'Interactive AI chat interface and 3D experience built with Next.js and TypeScript.',
  },
};