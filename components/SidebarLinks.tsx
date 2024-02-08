import { useEffect, useState } from 'react';
import styles from '@/styles/Sidebar.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAppDispatch } from '@/store/hooks';
import { hideSidebar } from '@/store/slices/SidebarSlice';
import Arrow from './Arrow';


export default function SidebarLinks() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [currentRoute, setCurrentRoute] = useState<string>(router.pathname);

  const getLinsClassName = (route: string) => {
    return `${styles['link']} ${currentRoute === route ? styles['link-active'] : ''}`;
  };

  const handleHideSidebar = () => {
    dispatch(hideSidebar());
  };

  useEffect (() => {
    setCurrentRoute(router.pathname);
  }, [router.pathname]);

  return (
    <div className={styles['nav-menu']}>
      <ol className={styles['link-list']}>
        <li className={getLinsClassName('/')}>
          <Link className={styles['text']} href="/" onClick={handleHideSidebar}>Home </Link>
          <Arrow />
        </li>
        <li className={getLinsClassName('/what/github')}>
          <Link className={styles['text']} href="/what/github" onClick={handleHideSidebar}>
            <div>What i do </div>
            <div className={styles['text-subtitle']}>github demo</div>
          </Link>
          <Arrow />
        </li>
        <li className={getLinsClassName('/what/projects')}>
          <Link className={styles['text']} href="/Exp" onClick={handleHideSidebar}>
            <div>What i did </div>
            <div className={styles['text-subtitle']}>experience</div>
          </Link>
          <Arrow />
        </li>
        <li className={getLinsClassName('/who')}>
          <Link className={styles['text']} href="/who" onClick={handleHideSidebar}>Who am i </Link>
          <Arrow />
        </li>
      </ol>
    </div>
  )
}
