import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

import styles from '@/styles/Sidebar.module.css'
import { useAppContext } from '@/context/appContext';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const router = useRouter();
  const { sidebar, toggleSidebar, hideSidebar } = useAppContext();
  const [currentRoute, setCurrentRoute] = useState<string>(router.pathname);

  useEffect (() => {
    setCurrentRoute(router.pathname);
  }, [router.pathname]);

  return (
  <>
    { !sidebar.isOpen &&
    <button type='button' className={styles.toggle} onClick={toggleSidebar} >
      <Image 
      src="/img/menu-toggle.png" 
      alt="Toggle button for the side panel"
      width={30}
      height={30}
      />
    </button>
    }
    <div className={`${styles.sidebar}`} style={{
    opacity: !sidebar.isOpen ? "0" : "1",
    display: !sidebar.isOpen ? "none" : "flex",
    }}> 
      <button onClick={toggleSidebar} type="button" aria-label="Close" className={styles.close}>
        <svg viewBox="0 0 16 16" width="1em" height="1em" focusable="false" role="img" aria-label="x" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><g><path fillRule="evenodd" d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"></path><path fillRule="evenodd" d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"></path></g></svg>
      </button>
      <div className={styles.profile}>
        <Image
          src="/img/profile.JPG"
          alt="Profile image of the author"
          width={160}
          height={160}
          priority
        />
      </div>
      <div className={styles.title}>
        <h1 className={styles['first-row']}>
          <span>epilef</span>
        </h1>
        <h1 className={styles['second-row']}>
          <span>rodriguez</span>
        </h1>
        <h2>
          <span>Design &amp; Develop</span>
        </h2>
      </div>
      <div className={styles.quote}>
        <p>Full=Stack Software Engineer - Looking for the next Challenge.</p>
      </div>
      <div className={styles['nav-menu']}>
        <ol className={styles['link-list']}>
          <li className={`${styles['link']} ${currentRoute === '/' ? styles['link-active'] : ''}`}>
            <Link className={styles['text']} href="/" onClick={hideSidebar}>Home </Link>
            <Image src="/img/arrow-right.png" alt="Arrow right" width={20} height={20} />
          </li>
          <li className={`${styles['link']} ${currentRoute === '/what/github' ? styles['link-active'] : ''}`}>
            <Link className={styles['text']} href="/what/github" onClick={hideSidebar}>
              <div>What i do </div>
              <div className={styles['text-subtitle']}>github demo</div>
            </Link>
            <Image src="/img/arrow-right.png" alt="Arrow right" width={20} height={20} />
          </li>
          <li className={`${styles['link']} ${currentRoute === '/what/chatgpt' ? styles['link-active'] : ''}`}>
            <Link className={styles['text']} href="#" onClick={hideSidebar}>
              <div>What i do </div>
              <div className={styles['text-subtitle']}>chatGPT demo</div>
            </Link>
            <Image src="/img/arrow-right.png" alt="Arrow right" width={20} height={20} />
          </li>
          {/* <li className={styles['link']}>
            <Link className={styles['text']} href="#" onClick={hideSidebar}>How i do it </Link>
            <Image src="/img/arrow-right.png" alt="Arrow right" width={20} height={20} />
          </li> */}
          <li className={styles['link']}>
            <Link className={styles['text']} href="/who" onClick={hideSidebar}>Who am i </Link>
            <Image src="/img/arrow-right.png" alt="Arrow right" width={20} height={20} />
          </li>
        </ol>
      </div>
    </div>
  </>
  )
}