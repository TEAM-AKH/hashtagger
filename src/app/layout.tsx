import type { Metadata } from 'next';
import './globals.css';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppLayout from '@/components/app-layout';
import { Toaster } from '@/components/ui/toaster';

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
          href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <SidebarProvider>
          <AppLayout>{children}</AppLayout>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
