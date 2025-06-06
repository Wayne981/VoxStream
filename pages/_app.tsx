import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import '@/styles/globals.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
        <Component {...pageProps} />
        <Toaster />
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
} 