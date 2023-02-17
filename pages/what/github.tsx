import styles from '@/styles/What.module.css'

import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import ChatgptContent from '@/components/Github/GithubContent'

export default function Github() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <Sidebar />
        <ChatgptContent />
      </main>
    </>
  )
}
