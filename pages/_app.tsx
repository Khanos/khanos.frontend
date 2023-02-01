import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { AppProvider } from "@/context/appContext";
import { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // We execute the same script as before
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, []);
  return (
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  )
}
