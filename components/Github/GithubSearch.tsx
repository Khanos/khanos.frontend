import { useEffect } from 'react';
import Image from 'next/image'
import Link from 'next/link'
import styles from '@/styles/What.module.css'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { setLoading } from '@/store/slices/MainSlice';
import { setCommitList, setGithubSearchWord } from '@/store/slices/GithubSlice';

export default function GithubSearch() {
  const dispatch = useAppDispatch();
  const github = useAppSelector((state) => state.github.github);
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      search: { value: string };
    };
    if(!target.search) {
      return;
    }
    getCommitsData(target.search.value);
  };

  const getCommitsData = (searchWord: string ) => {
    if(searchWord.length < 4) return;
    dispatch(setLoading(true));
    dispatch(setGithubSearchWord(searchWord));
    fetch(`https://khanos-backend.herokuapp.com/api/v1/github/getCommits/${searchWord}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          dispatch(setCommitList(data));
        }
      }).catch((error) => {
        console.log(error);
      }).finally(() => {
        dispatch(setLoading(false));
      });
  };

  useEffect(() => {
    if(github.commits.length === 0) getCommitsData('cheese');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <> 
      <div className={styles['github-img']}>
        <Image 
          src="/img/github.png" 
          alt="the github logo, a catopus"
          width={250}
          height={250}
        />
      </div>
      <div className={styles['what-title']}>
        <h2><span className={styles['foxy']}>G</span>itHub API</h2>
        <h2><span className={styles['foxy']}>D</span>emo</h2>
      </div>
      <div className={styles['what-form']}>
        <form onSubmit={handleSubmit}>
          <div className={styles['input-label']}>
            {`Lets search some FUN words for the most recent commits for public repos on GitHub.`}
          </div>
          <input
            className={styles['input-search']}
            type="text"
            placeholder="e.g. cheese"
            name='search'
            onKeyUp={(e) => {
              if (e.key === "Enter") getCommitsData(e.currentTarget.value);
            }}
          ></input>
          <div className={styles['input-description']}>
            {`The use of bad words is on your own discretion, it's pretty fun, though.`}
          </div>
          <button className={styles['main-button']} type="submit">
            SEARCH
          </button>
        </form>
      </div>
      <div className={`${styles['explanation']}`}>
        <p>
          This would make a http request to the backend server where all the magic happens, then returns a json response.
        </p>
        <p>Which would render those cards on the right.</p>
        <p>Check Out:</p>
        <ol>
          <li>
            BackEnd api.
            <Link href="https://khanos-backend.herokuapp.com/" target="_blank">
                HERE
            </Link>
          </li>
          <li>
            BackEnd Source Code.
            <Link
                href="https://github.com/Khanos/khanos.backend"
                target="_blank"
                >
              HERE
            </Link>
          </li>
        </ol>
      </div>
    </>
  )
}
