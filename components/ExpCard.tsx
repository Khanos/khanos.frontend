import Image from 'next/image'
import styles from '@/styles/Exp.module.css'
import type { expItemType } from '../store/types';

interface ComponentProps {
  key: number;
  item: expItemType; // replace 'expItemType' with the actual type of 'item'
}

const ExpCard: React.FC<ComponentProps> = ({ key, item }) => {
  if(!item.avatar) return null;
  return (
    <div className={styles['card']}>
      <div className={styles['card-header']}>
        <div className={styles['header-left']}>
          <h1 className={styles['card-header-title']}>{item.title}</h1>
          <p className={styles['card-header-subtitle']}>{item.location}</p>
          <div className={styles['card-body-tech']}>
            {item.tech.map((tech: string) => (
              <span key={tech} className={styles['tech']}>{tech} </span>
            ))}
          </div>
        </div>
        
      </div>
      <div className={styles['card-body']}>
        <div className={styles['card-body-company']}>
          <h3>{item.company}</h3>
        </div>
        <div className={styles['card-body-project']}>
          <p>{item.description}</p>
        </div>
      </div>
      <div className={styles['card-footer']}>
        <span>{item.date} </span>
        <a href={item.link} target="_blank" rel="noreferrer" className={styles['card-footer-link']}>more 🚀</a>
      </div>
    </div>
  )
};

export default ExpCard;