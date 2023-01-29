import styles from '@/styles/Who.module.css'

import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import WhoContent from '@/components/WhoContent'

export default function Who() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <Sidebar />
        <WhoContent />
      </main>
    </>
  )
}
