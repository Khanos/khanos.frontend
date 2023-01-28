import Image from 'next/image'

import styles from '@/styles/What.module.css'

export default function HomeContent() {
  return (
    <div className={`${styles.content}`}> 
      <section className={styles['section-container-what']}>
        <div className={styles['left-panel']}>
          <div className={styles['github-img']}>
            <Image 
              src="/img/github.png" 
              alt="the github logo, a catopus"
              width={250}
              height={250}
            />
          </div>
          <div className={styles['what-title']}>
            <h2><span className={styles['foxy']}>G</span>itHub API connection</h2>
            <h2><span className={styles['foxy']}>d</span>emostration</h2>
          </div>
        </div>
        <div className={styles['right-panel']}>
          <h1>Right panel</h1>
        </div>
      </section>
    </div>
  )
}
