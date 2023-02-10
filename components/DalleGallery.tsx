import Image from 'next/image';
import styles from '@/styles/Dalle.module.css';
import { useAppContext } from '@/context/appContext';

export default function DalleGallery() {
  const { dalle } = useAppContext();
  return (
    <div className={styles['gallery-container']}>
      <div className={styles['gallery']}>
        {dalle.imageList.length > 0 && dalle.imageList.map((image, index) => (
          <div key={index} className={`${styles['gallery-item']} ${index === 0 ? styles['gallery-item-current'] : ''}`}>
            <Image
              src="/img/github.png" 
              alt="a generated image"
              width={300}
              height={300}
            />
          </div>
        ))}
      </div>
    </div>
  );
}