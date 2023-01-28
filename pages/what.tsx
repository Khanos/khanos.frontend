import styles from '@/styles/What.module.css'

import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import WhatContent from '@/components/WhatContent'

export default function Home() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <Sidebar />
        <WhatContent />
      </main>
    </>
  )
}
