import styles from '@/styles/What.module.css'

import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import ChatgptContent from '@/components/ChatgptContent'

export default function Chatgpt() {
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
