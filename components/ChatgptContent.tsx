import ChatContent from '@/components/Chat/ChatContent'
import ChatForm from '@/components/Chat/ChatForm'
import styles from '@/styles/Chatgpt.module.css'

export default function ChatgptContent() {
  return (
    <section className={styles['section-container-chatgpt']}>
      <div className={styles['chat-container']}>
        <ChatContent />
        <ChatForm />
      </div>
    </section>
  )
}