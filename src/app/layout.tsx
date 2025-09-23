
import type { Metadata } from 'next';
import './globals.css';
import AppLayout from '@/components/app-layout';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Hastagger',
  description: 'A new way to connect.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased bg-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
            <AppLayout>{children}</AppLayout>
          <Toaster />
        </ThemeProvider>
         <Script
          src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyCAPu1XYY_yqEw4UMpTyO8TFH44YX8iVZU&libraries=places`}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
