import styles from '@/styles/What.module.css'

import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import DalleContent from '@/components/DalleContent'

export default function Dalle() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <Sidebar />
        <DalleContent />
      </main>
    </>
  )
}
