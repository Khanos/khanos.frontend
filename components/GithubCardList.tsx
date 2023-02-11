import styles from '@/styles/CardList.module.css'
import { useAppContext } from '@/context/appContext';
import GithubCard from '@/components/GithubCard';

import type { githubCommitType } from '@/context/types';

export default function GithubCardList() {
  const { github, loading } = useAppContext();

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