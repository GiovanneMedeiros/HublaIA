import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HublaIA - AI WhatsApp Automation',
  description: 'Transform conversations into opportunities with AI-powered WhatsApp automation.',
  keywords: [
    'WhatsApp',
    'AI',
    'Automation',
    'Real Estate',
    'CRM',
    'Lead Generation',
    'Chatbot',
  ],
  openGraph: {
    title: 'HublaIA - AI WhatsApp Automation',
    description: 'Transform conversations into opportunities with AI-powered WhatsApp automation.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="bg-bg-primary text-neutral-white antialiased">
        {children}
      </body>
    </html>
  );
}
