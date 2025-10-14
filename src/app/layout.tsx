
import type { Metadata } from 'next';
import './globals.css';
import { MainLayout } from '@/components/layout/MainLayout';
import { Toaster } from '@/components/ui/toaster';
import { MusicProvider } from '@/context/MusicContext';
import { EventsProvider } from '@/context/EventsContext';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

export const metadata: Metadata = {
  title: 'Ritmo Latino',
  description: 'La red social para los amantes de la música latina.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider>
          <AuthProvider>
              <EventsProvider>
              <MusicProvider>
                  <MainLayout>{children}</MainLayout>
              </MusicProvider>
              </EventsProvider>
              <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
