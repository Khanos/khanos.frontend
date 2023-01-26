import { Inter } from '@next/font/google'
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
        <div className={styles.container}>
          <Sidebar />
          <HomeContent />
        </div>
      </main>
    </>
  )
}
