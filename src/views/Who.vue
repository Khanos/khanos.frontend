<template>
  <section class="section-container what">
    <b-container fluid>
      <b-row>
        <b-col>
          <b-container id="logo-name">
            <div class="title">
              <h1 class="first-row"><span>epilef</span></h1>
              <h1 class="second-row"><span>rodriguez</span></h1>
              <h2><span>Design & Develop</span></h2>
            </div>
          </b-container>
          <b-container id="who-description-container">
            <p>
              All human beings have characteristics that make us unique. But
              contrary to what most people thinks, these features do not come
              from a gift, but are the product of sustained effort, many
              mistakes, experience, principles and values. I do not know
              everything and i never will, but I have always shown interest in
              acquiring knowledge through experience and self learning.
            </p>

            <p>
              I always tilt toward the challenges, so I decided to study
              mathematical sciences. I've learned a lot about solving problems
              and see things from another perspective. This gave me the
              advantage to enter the world of information technologies.
            </p>

            <p>
              Programing has a lot to do with the math world, Getting the most
              harmonious and elegant way to solve a problem. Everyone can
              program, but there is something very few can dominate and is the
              power of abstracting the problems to obtain a solution.
            </p>

            <p>
              I am unique because I understand that success is not an accident
              but the result of a constant and conscious effort.
            </p>
          </b-container>
          <b-container id="who-social-networks-links">
            <div class="mb-2 outer">
              <b-avatar
                button
                v-on:click="openLink('https://www.instagram.com/epilef.js')"
                class="link-container instagram"
                size="4em"
              >
                <i class="fab fa-instagram fa-3x"></i>
              </b-avatar>
              <b-avatar
                button
                v-on:click="openLink('https://twitter.com/EpilefRodriguez')"
                class="link-container twitter"
                size="4em"
              >
                <i class="fab fa-twitter fa-3x"></i>
              </b-avatar>
              <b-avatar
                button
                v-on:click="openLink('https://www.linkedin.com/in/khanos/')"
                class="link-container linkedin"
                size="4em"
              >
                <i class="fab fa-linkedin-in fa-3x"></i>
              </b-avatar>
              <b-avatar
                button
                v-on:click="openLink('https://github.com/khanos')"
                class="link-container github"
                size="4em"
              >
                <i class="fab fa-github fa-3x"></i>
              </b-avatar>
              <b-avatar
                button
                v-on:click="openLink('https://www.hackerrank.com/KhanosVe')"
                class="link-container hackerrank"
                size="4em"
              >
                <i class="fab fa-hackerrank fa-3x"></i>
              </b-avatar>
            </div>
          </b-container>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
export default {
  name: 'Who',
  methods: {
    openLink(url) {
      const safeUrl = url
        || /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
          url,
        );
      return window.open(safeUrl, '_blank');
    },
  },
};
</script>

<style scoped>
#who-social-networks-links .outer {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 5rem;
}
h1 {
  color: black;
}
#logo-name {
  margin-top: 4rem;
  width: fit-content;
}
#logo-name .title {
  width: 100%;
  margin-top: 10%;
  text-align: center;
}

#logo-name .title h1 {
  color: #fdfffc;
  font-size: 2vw;
  letter-spacing: 5px;
}

#logo-name .title h2 {
  font-family: "Raleway", sans-serif;
  font-size: 1.4vw;
  letter-spacing: 5px;
}

#logo-name .title h1.first-row span {
  background-color: #4d4444;
  position: relative;
  right: 20%;
}

#logo-name .title h1.second-row span {
  background-color: #4d4444;
  position: relative;
  left: 10%;
}

#logo-name .title h1.second-row::first-letter {
  color: #f800ae;
}
#who-description-container {
  margin-top: 4rem;
  max-width: 50%;
  text-align: left;
}
#who-social-networks-links {
  margin-top: 4rem;
}
.link-container {
  margin: 5px;
}
.instagram:hover {
  background: linear-gradient(
    45deg,
    #405de6,
    #5851db,
    #833ab4,
    #c13584,
    #e1306c,
    #fd1d1d
  );
  transform: translate(0px, 5px);
  -webkit-transform: translate(0px, 5px);
  box-shadow: 0px 1px 0px 0px;
  transition: all 0.5s ease-in-out;
}
.twitter:hover {
  background: #1da1f2;
  transform: translate(0px, 5px);
  -webkit-transform: translate(0px, 5px);
  box-shadow: 0px 1px 0px 0px;
  transition: all 0.5s ease-in-out;
}
.linkedin:hover {
  background: #0077b5;
  transform: translate(0px, 5px);
  -webkit-transform: translate(0px, 5px);
  box-shadow: 0px 1px 0px 0px;
  transition: all 0.5s ease-in-out;
}
.github:hover {
  background: #333333;
  transform: translate(0px, 5px);
  -webkit-transform: translate(0px, 5px);
  box-shadow: 0px 1px 0px 0px;
  transition: all 0.5s ease-in-out;
}
.hackerrank:hover {
  background: #2ec866;
  transform: translate(0px, 5px);
  -webkit-transform: translate(0px, 5px);
  box-shadow: 0px 1px 0px 0px;
  transition: all 0.5s ease-in-out;
}
@media screen and (max-width: 700px) {
  #logo-name .title h1 {
    color: #fdfffc;
    font-size: 2rem;
    letter-spacing: 5px;
  }

  #logo-name .title h2 {
    font-family: "Raleway", sans-serif;
    font-size: 1rem;
    letter-spacing: 5px;
  }
  #who-description-container {
    width: 90%;
    max-width: unset;
    font-size: 4rem;
  }
}
</style>
