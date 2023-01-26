import Image from 'next/image'
import Link from 'next/link'
import { Inter } from '@next/font/google'
import styles from '@/styles/Sidebar.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Sidebar() {
    return (
        <>
            <button type='button' className={styles.toggle} >
                <Image 
                    src="/img/menu-toggle.png" 
                    alt="Toggle button for the side panel"
                    width={30}
                    height={30}
                />
            </button>
            <div className={`${styles.sidebar}`}> 
                <button type="button" aria-label="Close" className={styles.close}>
                    <svg viewBox="0 0 16 16" width="1em" height="1em" focusable="false" role="img" aria-label="x" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><g><path fill-rule="evenodd" d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"></path><path fill-rule="evenodd" d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"></path></g></svg>
                </button>
                <div className={styles.profile}>
                    <Image
                        src="/img/profile.png"
                        alt="Profile image of the author"
                        width={100}
                        height={100}
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
                        <li className={styles['link']}>
                            <Link className={styles['text']} href="/">Home </Link>
                            <Image src="/img/arrow-right.png" alt="Arrow right" width={20} height={20} />
                        </li>
                        <li className={styles['link']}>
                            <Link className={styles['text']} href="/what">What i do </Link>
                            <Image src="/img/arrow-right.png" alt="Arrow right" width={20} height={20} />
                        </li>
                        <li className={styles['link']}>
                            <Link className={styles['text']} href="/how">How i do it </Link>
                            <Image src="/img/arrow-right.png" alt="Arrow right" width={20} height={20} />
                        </li>
                        <li className={styles['link']}>
                            <Link className={styles['text']} href="/who">Who am i </Link>
                            <Image src="/img/arrow-right.png" alt="Arrow right" width={20} height={20} />
                        </li>
                    </ol>
                </div>
            </div>
        </>
    )
  }