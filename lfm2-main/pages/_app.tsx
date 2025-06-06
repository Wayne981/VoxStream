import "@/styles/globals.css";
import { Inter, Quicksand } from "next/font/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import type { AppProps } from "next/app";
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const inter = Inter({ subsets: ["latin"] });
const quickSand = Quicksand({ subsets: ["latin"] });

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId="1035721632642-v75lq48u9raua69nfv9dr0cpj7j13s1a.apps.googleusercontent.com">
        <div className={inter.className}>
          <Component {...pageProps} />
          <Toaster position="bottom-center" />
        </div>
      </GoogleOAuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}