import GithubSearch from '@/components/Github/GithubSearch'
import GithubCardList from '@/components/Github/GithubCardList'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import styles from '@/styles/What.module.css'

export default function GithubContent() {
  const github = useAppSelector((state) => state.github.github);
  return (
    <section className={styles['section-container-what']}>
      <div className={styles['left-panel']}>
        <GithubSearch />
      </div>
      <div className={styles['right-panel']}>
        <GithubCardList searchWord={github.searchWord} />
      </div>
    </section>
  )
}
