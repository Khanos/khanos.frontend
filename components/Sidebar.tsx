import Image from 'next/image'
import styles from '@/styles/Sidebar.module.css'
import SidebarLinks from './SidebarLinks';
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { toggleSidebar, hideSidebar } from '@/store/slices/SidebarSlice';

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const sidebar = useAppSelector((state) => state.sidebar.sidebar);

  const handleSidebarToggle = () => {
    dispatch(toggleSidebar());
  };

  const handleHideSidebar = () => {
    dispatch(hideSidebar());
  };
  return (
  <>
    { !sidebar.isOpen &&
    <button type='button' className={styles.toggle} onClick={handleSidebarToggle} >
      <Image 
      src="/img/menu-toggle.png" 
      alt="Toggle button for the side panel"
      width={30}
      height={30}
      />
    </button>
    }
    <div className={`${styles.sidebar} ${!sidebar.isOpen ? styles.sidebarClosed : ''}`} style={{
    opacity: sidebar.isOpen ? "1" : "0",
    display: sidebar.isOpen ? "flex" : "block",
    }}> 
      <button onClick={handleHideSidebar} type="button" aria-label="Close" className={styles.close}>
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
      <SidebarLinks />
    </div>
  </>
  )
}