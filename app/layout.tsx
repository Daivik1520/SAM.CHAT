import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { ThemeProviderWrapper } from '@/lib/theme-provider';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SAM.CHAT - Social Media Messaging',
  description: 'Connect, chat, and share with friends seamlessly',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProviderWrapper>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
