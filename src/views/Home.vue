<template>
  <div class="main-container">
    <section class="section-container home">
      <div class="img-home"><img class="img-notebook" src="../assets/img/notebook.png" /></div>
      <div class="main-title">
        <h1>Hi, i am a full stack web developer.</h1>
        <h1>and i<span class="love" > love </span>what i <span class="me"> do</span></h1>
        <h1></h1><a class="main-button" href="#">start</a>
      </div>
      <footer class="home-footer">
        <p>shared on <a href="https://github.com/Khanos/khanos.github.io" target="_blank">GitHub
          </a>& managed on <a href="https://trello.com/b/KdkP1DtZ" target="_blank">Trello</a></p>
      </footer>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Home',
};
</script>

<style>
  .section-container.home {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: center;
  }

  .section-container.home .img-home {
    flex-grow: 1;
    max-height: 300px;
    display: inline-block;
    margin-bottom: 40px;
    overflow: hidden;
  }

  .section-container.home .img-home img {
    position: relative;
    top: -44px;
    width: 50vh;
  }

  .section-container.home .main-title {
    flex-grow: 1;
    font-weight: 100;
    color: #4D4444;
    text-align: center;
  }

  .section-container.home .main-title .love {
    font-family: "Roboto", sans-serif;
    font-weight: bolder;
    font-style: italic;
    text-decoration: none;
  }

  .section-container.home .main-title .me {
    color: #F800AE;
    font-family: "Roboto", sans-serif;
    font-weight: bolder;
    font-style: italic;
    text-decoration: none;
  }

  .section-container.home .main-title a.main-button {
    border: solid 2px #4D4444;
    padding: 8px 80px;
    display: inline-block;
    margin-top: 40px;
    text-decoration: none;
    text-transform: uppercase;
    font-family: "Roboto", sans-serif;
    font-size: 4vh;
    font-weight: 400;
    color: #4D4444;
    -webkit-box-shadow: 0px 0px 0.2px 1px #F800AE;
    -moz-box-shadow: 0px 0px 0.2px 1px #F800AE;
    box-shadow: 0px 0px 0.2px 1px #F800AE;
    opacity: 0.6;
  }

  .section-container.home .main-title a.main-button:hover {
    -webkit-box-shadow: 0px 0px 2px 1px #F800AE;
    -moz-box-shadow: 0px 0px 2px 1px #F800AE;
    box-shadow: 0px 0px 2px 1px #F800AE;
    opacity: 1;
  }

  .section-container.home footer.home-footer {
    position: absolute;
    bottom: 0;
    padding: 20px;
    width: 100%;
  }

  .section-container.home footer.home-footer p {
    font-family: "Raleway", sans-serif;
    font-weight: 100;
    color: #4D4444;
    text-align: right;
  }

  .section-container.home footer.home-footer p a {
    text-decoration: none;
    color: #4D4444;
    font-weight: 600;
  }
</style>
