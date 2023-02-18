import Image from 'next/image'
import ChatContent from '@/components/ChatGPT/ChatContent'
import ChatForm from '@/components/ChatGPT/ChatForm'
import styles from '@/styles/Chatgpt.module.css'

export default function ChatgptContent() {
  return (
    <section className={styles['section-container-chatgpt']}>
      <div className={styles['chat-left-panel']}>
        <div className={styles['chatgpt-img']}>
          <Image 
            src="/img/chatgpt-logo.png" 
            alt="the chatgpt logo"
            width={250}
            height={250}
          />
        </div>
        <div className={styles['what-title']}>
          <h2>Chat<span className={styles['foxy']}>GPT</span></h2>
          <h2><span className={styles['foxy']}>D</span>emo</h2>
        </div>
        <div className={styles['resume']}>
          <p><b>Chat Generative Pre-Trained Transformer</b>, commonly called <b>ChatGPT</b>, is a chatbot launched by OpenAI in November 2022. It is built on top of OpenAIs GPT-3 family of large language models, and is fine-tuned (an approach to transfer learning with both supervised and reinforcement learning techniques.
</p>
          <p>ChatGPT was launched as a prototype on November 30, 2022, and quickly garnered attention for its detailed responses and articulate answers across many domains of knowledge. Its uneven factual accuracy was identified as a significant drawback. Following the release of ChatGPT, OpenAI was valued at $29 billion.
</p>
          <p><a href="https://openai.com/blog/chatgpt/" target="_blank" rel="noopener noreferrer">More info</a></p>
        </div>
      </div>
      <div className={styles['chat-container']}>
        <ChatContent/>
        <ChatForm />
      </div>
    </section>
  )
}