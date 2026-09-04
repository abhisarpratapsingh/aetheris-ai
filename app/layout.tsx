import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aetheris AI | Cognitive Second Brain & Life OS',
  description: 'Enterprise-grade, authenticated AI journaling and cognitive triage engine deployed on Google Cloud Run with Gemini 2.0 and Firestore isolation.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090d16] text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
