import Head from 'next/head';
import '@/index.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import AppLayout from '@/components/layout/AppLayout';
import { Toaster } from '@/components/ui/toaster';

export default function NextApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>
      <QueryClientProvider client={queryClientInstance}>
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
        <Toaster />
      </QueryClientProvider>
    </>
  );
}
