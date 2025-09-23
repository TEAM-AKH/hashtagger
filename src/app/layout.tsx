
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
         {/*
          IMPORTANT: You are seeing a "Google Maps JavaScript API error: InvalidKeyMapError".
          This means the API key is missing or invalid.
          
          To fix this:
          1. Go to the Google Cloud Console: https://console.cloud.google.com/google/maps-apis/credentials
          2. Create a new API key or use an existing one.
          3. Make sure the "Maps JavaScript API" is enabled for this key.
          4. Replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` below with your new key.
          5. For production, it's recommended to restrict the key to your website's domain.
        */}
         <Script
          src={`https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY_HERE&libraries=places`}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
