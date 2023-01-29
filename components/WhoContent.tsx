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
          All human beings have characteristics that make us unique. But
          contrary to what most people thinks, these features do not come
          from a gift, but are the product of sustained effort, many
          mistakes, experience, principles and values. I do not know
          everything and i never will, but I have always shown interest in
          acquiring knowledge through experience and self learning.`}
        </p>

        <p>
          {`
          I always tilt toward the challenges, so I decided to study
          mathematical sciences. I've learned a lot about solving problems
          and see things from another perspective. This gave me the
          advantage to enter the world of information technologies.
          `}
        </p>

        <p>
          {`
          Programing has a lot to do with the math world, Getting the most
          harmonious and elegant way to solve a problem. Everyone can
          program, but there is something very few can dominate and is the
          power of abstracting the problems to obtain a solution.
          `}
        </p>

        <p>
          {`
          I am unique because I understand that success is not an accident
          but the result of a constant and conscious effort.
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