import Image from 'next/image'
import styles from '@/styles/Dalle.module.css'
import type { dalleImageType } from '@/store/types'
import { useState } from 'react'

interface Props {
  image: dalleImageType['image']
  text: dalleImageType['text']
  index: number
}

export default function DalleGalleryItem({ text, image, index }: Props) {
  const [loading, setIsLoading] = useState(false);
  function downloadImage(url: string) {
    setIsLoading(true);
    setTimeout(() => {
      // Create a link element to download the image
      const link = document.createElement('a');
      link.download = 'image.png';
      link.href = url;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      
      setIsLoading(false);
    } , 1000);
  }

  return (
    <div className={`${index === 0 ? styles['gallery-item-current'] : styles['gallery-item']}`}>
      <div className={styles['gallery-item-text']}>
        {text}
        {loading ?
          <span className={styles['gallery-item-download-loading']}>⏳</span>
          :
          <span className={styles['gallery-item-download']} onClick={() => downloadImage(image)}>⤵️</span>
        } 
      </div>
      <Image
        className={styles['gallery-item-image']}
        src={image}
        alt={text}
        placeholder="blur"
        blurDataURL="/img/image-placeholder.png"
        width={1024}
        height={1024}
      />
    </div>
  )
}