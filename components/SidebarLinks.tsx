import { useEffect, useState } from 'react';
import styles from '@/styles/Sidebar.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAppDispatch } from '@/store/hooks';
import { hideSidebar } from '@/store/slices/SidebarSlice';


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
          <Image src="/img/arrow-right.png" alt="Arrow right" width={20} height={20} />
        </li>
        <li className={getLinsClassName('/what/github')}>
          <Link className={styles['text']} href="/what/github" onClick={handleHideSidebar}>
            <div>What i do </div>
            <div className={styles['text-subtitle']}>github demo</div>
          </Link>
          <Image src="/img/arrow-right.png" alt="Arrow right" width={20} height={20} />
        </li>
        <li className={getLinsClassName('/what/chatgpt')}>
          <Link className={styles['text']} href="/what/chatgpt" onClick={handleHideSidebar}>
            <div>What i do </div>
            <div className={styles['text-subtitle']}>chatGPT demo</div>
          </Link>
          <Image src="/img/arrow-right.png" alt="Arrow right" width={20} height={20} />
        </li>
        <li className={getLinsClassName('/what/dalle')}>
          <Link className={styles['text']} href="/what/dalle" onClick={handleHideSidebar}>
            <div>What i do </div>
            <div className={styles['text-subtitle']}>Dall-E 2 demo</div>
          </Link>
          <Image src="/img/arrow-right.png" alt="Arrow right" width={20} height={20} />
        </li>
        {/* <li className={getLinsClassName('/how')}>
          <Link className={styles['text']} href="#" onClick={handleHideSidebar}>How i do it </Link>
          <Image src="/img/arrow-right.png" alt="Arrow right" width={20} height={20} />
        </li> */}
        <li className={getLinsClassName('/who')}>
          <Link className={styles['text']} href="/who" onClick={handleHideSidebar}>Who am i </Link>
          <Image src="/img/arrow-right.png" alt="Arrow right" width={20} height={20} />
        </li>
      </ol>
    </div>
  )
}
