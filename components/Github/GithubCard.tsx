import Image from 'next/image'
import { parseISO, format } from 'date-fns';
import styles from '@/styles/Card.module.css'
import type { githubCommitType } from '@/store/types';
import { useAppSelector } from '@/store/hooks';
interface GithubCardProps {
  item: githubCommitType
}

// create a method that finds a specific word in a string and wraps it in a span
// with a class name of foxy
const findAndReplace = (string: string, word: string) => {
  const stringLimit = 300;
  const regex = new RegExp(word, 'gi');
  const newString = string.replace(regex, `<span class='foxy'>${word}</span>`);
  if (newString.length > stringLimit) {
    return `${newString.substring(0, stringLimit)}...`;
  }
  return newString;
}

export default function GithubCard( { item }: GithubCardProps ) {
  const github = useAppSelector((state) => state.github.github);
  return item.author && (
    <div className={styles['github-card']}>
       <Image 
        className={styles['github-card-avatar']}
        src={item.author.avatar_url || ''}
        alt="Author avatar"
        width={120}
        height={120}
      />
      <div className={styles['card-body']}>
        <div className={styles['card-body-header']}>
          <h1>Author: {item.author.login}</h1>
          <p className={styles['card-body-sub-header']}>
            {item.repository.name}, {item.repository.description}
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
          <time dateTime={item.commit.author.date}>{format(parseISO(item.commit.author.date), 'LLLL d, yyyy, HH:MM')}</time> 
        </div>
      </div>
    </div>
  );
}