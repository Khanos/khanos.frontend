import styles from '@/styles/CardList.module.css'
import GithubCard from '@/components/Github/GithubCard';
import { useAppSelector, useAppDispatch, useFetch } from '@/store/hooks';
import type { githubCommitType } from '@/store/types';
import { setCommitList } from '@/store/slices/GithubSlice';
import { useEffect } from 'react';

interface Props {
  searchWord: string
}

export default function GithubCardList({ searchWord }: Props) {
  const dispatch = useAppDispatch();
  const github = useAppSelector((state) => state.github.github);
  const { response, error, loading } = useFetch({
    url: `https://khanos-backend.herokuapp.com/api/v1/github/getCommits/${searchWord}`,
  });

  useEffect(() => {
    if (response.length > 0) {
      dispatch(setCommitList(response));
    }
  }, [response, dispatch]);

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
      {github.commits.length > 0 || error ? 
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