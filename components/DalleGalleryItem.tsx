import Image from 'next/image'
import styles from '@/styles/Dalle.module.css'
import type { dalleImageType } from '@/context/types'
import { useEffect } from 'react'

interface Props {
  image: dalleImageType['image']
  text: dalleImageType['text']
  index: number
}

export default function DalleGalleryItem({ text, image, index }: Props) {
  return (
    <div className={`${styles['gallery-item']} ${index === 0 ? styles['gallery-item-current'] : ''}`}>
      <div className={styles['gallery-item-text']}>
        {text}
      </div>
      <Image
        src={image}
        alt={text}
        width={index === 0 ? 450 : 300}
        height={index === 0 ? 450 : 300}
      />
    </div>
  )
}