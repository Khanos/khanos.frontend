import styles from '@/styles/Who.module.css'

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
      <div className={styles['who-description-container']}>
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
      <div className={styles['who-social-networks-links']}>
        {/* <div className="mb-2 outer">
          <div
            button
            v-on:click="openLink('https://www.instagram.com/epilef.js')"
            className="link-container instagram"
            size="4em"
          >
            <i className="fab fa-instagram fa-3x"></i>
          </div>
          <div
            button
            v-on:click="openLink('https://twitter.com/EpilefRodriguez')"
            className="link-container twitter"
            size="4em"
          >
            <i className="fab fa-twitter fa-3x"></i>
          </div>
          <div
            button
            v-on:click="openLink('https://www.linkedin.com/in/khanos/')"
            className="link-container linkedin"
            size="4em"
          >
            <i className="fab fa-linkedin-in fa-3x"></i>
          </div>
          <div
            button
            v-on:click="openLink('https://github.com/khanos')"
            className="link-container github"
            size="4em"
          >
            <i className="fab fa-github fa-3x"></i>
          </div>
          <div
            button
            v-on:click="openLink('https://www.hackerrank.com/KhanosVe')"
            className="link-container hackerrank"
            size="4em"
          >
            <i className="fab fa-hackerrank fa-3x"></i>
          </div>
        </div> */}
      </div>
    </section>
  )
}