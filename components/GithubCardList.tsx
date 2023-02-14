import styles from '@/styles/CardList.module.css'
import GithubCard from '@/components/GithubCard';
import { useAppSelector } from '@/store/hooks';
import type { githubCommitType } from '@/store/types';

export default function GithubCardList() {
  const github = useAppSelector((state) => state.github.github);
  const loading = useAppSelector((state) => state.main.loading);
  if (loading) {
    return (
      <div className={styles['github-card-list']}>
        <div className={styles['loading']}>
          <div className={styles['lds-roller']}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div> 
          <div className={styles['loading-text']}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles['github-card-list']}>
      {github.commits.length > 0 ? 
        github.commits.map((item: githubCommitType) => (
          <GithubCard key={item.id} item={ item } />
        ))
        : (
          <div className="error">
            <div className="">
              <i className="far fa-tired"></i> Ups, no luck with the word:
              <span className="foxy">{ github.searchWord }</span> You could try
              with another one.
            </div>
          </div>
        )
      }
    </div>
  );
}