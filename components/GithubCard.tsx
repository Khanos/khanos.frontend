import Image from 'next/image'
import { parseISO, format } from 'date-fns';
import styles from '@/styles/Card.module.css'
import { useAppContext } from '@/context/appContext';

import type { githubCommitType } from '@/context/appContext';

interface GithubCardProps {
  item: githubCommitType
}

// create a method that finds a specific word in a string and wraps it in a span
// with a class name of foxy
const findAndReplace = (string: string, word: string) => {
  const regex = new RegExp(word, 'gi');
  const newString = string.replace(regex, `<span class='foxy'>${word}</span>`);
  return newString;
}

export default function GithubCard( { item }: GithubCardProps ) {
  const { github } = useAppContext();
  return (
    <div className={styles['github-card']}>
       <Image 
        className={styles['github-card-avatar']}
        src={item.author.avatar || ''}
        alt="Author avatar"
        width={120}
        height={120}
      />
      <div className={styles['card-body']}>
        <div className={styles['card-body-header']}>
          <h1>Author: {item.author.login}</h1>
          <p className={styles['card-body-sub-header']}>
            {item.repo.name}, {item.repo.description}
          </p>
        </div>
        <div className={styles['card-body-content']}>
          <p>
            <b>Commit: </b>
            <span dangerouslySetInnerHTML={{ __html: findAndReplace(item.commit.message, github.searchWord) }}></span>.
            <a className={styles['commit-link']} href={item.commit.url}>See commit</a>
          </p>
        </div>
        <div className={styles['card-body-footer']}>
          <time dateTime={item.commit.date}>{format(parseISO(item.commit.date), 'LLLL d, yyyy, HH:MM')}</time> 
        </div>
      </div>
    </div>
  );
}