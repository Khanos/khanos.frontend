import Image from 'next/image';
import styles from '@/styles/Dalle.module.css';
import { useAppContext } from '@/context/appContext';
import DalleGalleryItem from '@/components/DalleGalleryItem';

export default function DalleGallery() {
  const { dalle } = useAppContext();
  return (
    <div className={styles['gallery-container']}>
      <div className={styles['gallery']}>
        {dalle.imageList.length > 0 && dalle.imageList.map((item, index) => {
          return (
            <DalleGalleryItem
              key={item.text}
              image={item.image}
              text={item.text}
              index={index}
            />
          );
        })}
      </div>
    </div>
  );
}