import Image from 'next/image'
import Link from 'next/link'
import { useAppContext } from '@/context/appContext';

import styles from '@/styles/What.module.css'

export default function GithubSearch() {
  const { github, setCommitList } = useAppContext();
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      search: { value: string };
    };
    if(!target.search) {
      return;
    }
    fetch(`https://khanos-backend.herokuapp.com/api/v1/github/getCommits/${target.search}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setCommitList(data);
        }
      }).catch((error) => {
        console.log(error);
      });
  };
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
        <h2><span className={styles['foxy']}>G</span>itHub API connection</h2>
        <h2><span className={styles['foxy']}>d</span>emostration</h2>
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
