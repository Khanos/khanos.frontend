import styles from '@/styles/Who.module.css'
import Link from 'next/link'
import Image from 'next/image'

export default function WhoContent(){
  return (
    <section className={styles['section-container']}>
      <div className={styles['logo-name']}>
        <div className={styles['title']}>
          <h1 className={styles['first-row']}><span>epilef</span></h1>
          <h1 className={styles['second-row']}><span>rodriguez</span></h1>
          <h2><span>Design & Develop</span></h2>
        </div>
      </div>
      <div className={styles['description-container']}>
        <p>
          {`
          Every individual possesses unique traits, shaped not by inherent gifts but by persistent effort, learning from mistakes, experiences, and core principles. While I don't claim to know everything, I embrace a lifelong journey of acquiring knowledge through experience and self-learning.`}
        </p>

        <p>
          {`
          Driven by a fascination for challenges, I pursued mathematical sciences, gaining problem-solving skills and a different perspective. This journey seamlessly led me into the realm of information technologies.
          `}
        </p>

        <p>
          {`
          In programming, akin to the world of math, I find beauty in crafting the most harmonious and elegant solutions to problems. Beyond mere coding, I recognize the power of abstracting problems to unveil solutions—a skill mastered by a select few.
          `}
        </p>

        <p>
          {`
          My uniqueness lies in acknowledging that success is a deliberate outcome, forged through continual and conscious efforts.
          `}
        </p>
      </div>
      <div className={styles['social-networks-links']}>
        <Link
          href='https://www.instagram.com/epilef.js'
          className={`$styles['link-container] ${styles['instagram']}`}
          target="_blank"
        >
          <Image 
            src="/icons/instagram.png" 
            alt="Image of of the logo of instagram"
            width={40}
            height={40}
          />
        </Link>
        <Link
          href='https://twitter.com/EpilefRodrigue'
          className={`$styles['link-container] ${styles['twitter']}`}
          target="_blank"
        >
          <Image 
            src="/icons/twitter.png" 
            alt="Image of of the logo of twitter"
            width={40}
            height={40}
          />
        </Link>
        <Link
          href='https://www.linkedin.com/in/khanos/'
          className={`$styles['link-container] ${styles['linkedin']}`}
          target="_blank"
        >
          <Image 
            src="/icons/linkedin.png" 
            alt="Image of of the logo of linkedin"
            width={40}
            height={40}
          />
        </Link>
        <Link
          href='https://github.com/khanos'
          className={`$styles['link-container] ${styles['github']}`}
          target="_blank"
        >
          <Image 
            src="/icons/github.png" 
            alt="Image of of the logo of github"
            width={40}
            height={40}
          />
        </Link>
        <Link
          href='https://www.hackerrank.com/KhanosVe'
          className={`$styles['link-container] ${styles['hackerrank']}`}
          target="_blank"
        >
          <Image 
            src="/icons/hackerrank.png" 
            alt="Image of of the logo of hackerrank"
            width={40}
            height={40}
          />
        </Link>
      </div>
    </section>
  )
}