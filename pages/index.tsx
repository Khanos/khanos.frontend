import { Inter } from '@next/font/google'
import Script from 'next/script'
import styles from '@/styles/Home.module.css'

import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import HomeContent from '@/components/HomeContent'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        {/* eslint-disable-next-line @next/next/next-script-for-ga */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-525CEBLYVE"/>
        <Script
          id='gtag-init'
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-525CEBLYVE');
            `,  
          }}
        />
        <Sidebar />
        <HomeContent />
      </main>
    </>
  )
}
