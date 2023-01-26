import Image from 'next/image'
import Link from 'next/link'
import styles from '@/styles/Home.module.css'
import { Inter } from '@next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function HomeContent() {
  return (
    <div className={`${styles.item} ${styles.content}`}> 
      <section className={styles['section-container-home']}>
        <div className={styles['img-home']}>
          <Image 
            src="/img/notebook.png" 
            alt="Image of a generic notebook"
            width={960}
            height={682}
          />
        </div>
        <div className={styles['main-title']}>
          <h1>Hi, i am a full stack web developer.</h1>
          <h1>and i<span className={styles['love']} > love </span>what i <span className={styles['me']}> do</span></h1>
          <h1></h1><Link className={styles['main-button']} href="/what">start</Link>
        </div>
        <footer className={styles['home-footer']}>
          <p>shared on <a href="https://github.com/Khanos/khanos.github.io" target="_blank" rel="noreferrer">GitHub
            </a> & managed on <a href="https://trello.com/b/KdkP1DtZ" target="_blank" rel="noreferrer">Trello</a></p>
        </footer>
      </section>
    </div>
  )
}
