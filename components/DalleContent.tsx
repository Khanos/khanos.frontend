import styles from '@/styles/Dalle.module.css'

export default function DalleContent() {
  return (
    <section className={styles['section-container-chatgpt']}>
      <div className={styles['chat-left-panel']}>
        <h1>This is left</h1>
      </div>
      <div className={styles['chat-container']}>
        <h1>This is right</h1>
      </div>
    </section>
  )
}