import GithubSearch from '@/components/GithubSearch'
import GithubCardList from '@/components/GithubCardList'

import styles from '@/styles/What.module.css'

export default function WhatContent() {
  return (
    <section className={styles['section-container-what']}>
      <div className={styles['left-panel']}>
        <GithubSearch />
      </div>
      <div className={styles['right-panel']}>
        <GithubCardList />
      </div>
    </section>
  )
}
