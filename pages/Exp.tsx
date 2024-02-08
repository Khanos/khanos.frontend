import styles from '@/styles/Exp.module.css'

import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import ExpContent from '@/components/ExpContent'

export default function Exp() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <Sidebar />
        <ExpContent />
      </main>
    </>
  )
}
