import styles from '@/styles/Chatgpt.module.css'
import { parseISO, format } from 'date-fns';
import type { chatGptMessageType } from '@/store/types'

interface chatMessageProp {
  data: chatGptMessageType
}
export default function ChatMessage({ data }: chatMessageProp) {
  return (
    <div className={`${styles['chat-message']} ${
      data.isUser ? styles['chat-message-user'] : styles['chat-message-bot']
    }`}>
      <div className={styles['chat-message-text']}>
        <div dangerouslySetInnerHTML={{ __html: data.message}}></div>
        <div className={styles['chat-message-date']}>
          {format(parseISO(new Date().toISOString()), 'HH:MM')}
        </div>
      </div>
    </div>
  )
}