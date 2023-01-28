import GithubSearch from '@/components/GithubSearch'

import styles from '@/styles/What.module.css'

export default function WhatContent() {
  return (
    <div className={`${styles.content}`}> 
      <section className={styles['section-container-what']}>
        <div className={styles['left-panel']}>
          <GithubSearch />
        </div>
        <div className={styles['right-panel']}>
          <h1>Right panel</h1>
        </div>
      </section>
    </div>
  )
}
