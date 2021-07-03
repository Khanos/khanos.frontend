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
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
export default {
  name: 'Who',
};
</script>

<style scoped>
h1 {
  color: black;
}
#logo-name {
  width: fit-content;
}
#logo-name .title {
  width: 100%;
  margin-top: 10%;
  margin-bottom: 10%;
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
  max-width: 50%;
  text-align: left;
}
@media screen and (max-width: 700px) {
  #who-description-container {
    width: 90%;
  }
}
</style>
