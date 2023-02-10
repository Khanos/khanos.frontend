import Image from 'next/image'
import styles from '@/styles/Dalle.module.css'

export default function DalleGalleryItem({ src, alt, width, height }: Props) {
  return (
    <div className={styles['gallery-item']}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
      />
    </div>
  )
}