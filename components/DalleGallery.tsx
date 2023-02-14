import Image from 'next/image';
import styles from '@/styles/Dalle.module.css';
import DalleGalleryItem from '@/components/DalleGalleryItem';
import { useAppSelector } from '@/store/hooks'

export default function DalleGallery() {
  const dalle = useAppSelector((state) => state.dalle.dalle);
  return (
    <div className={styles['gallery-container']}>
      <div className={styles['gallery']}>
        {dalle.imageList.map((item, index) => {
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