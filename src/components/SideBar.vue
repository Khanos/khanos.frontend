<template>
  <div id="aside">
    <b-button id="toggle-btn" v-b-toggle.sidebar-variant>
      <img src="../assets/img/menu-toggle.png"/>
    </b-button>
    <b-sidebar id="sidebar-variant"
      bg-variant="light"
      text-variant="dark"
      backdrop shadow>
      <b-container class="profile-img">
        <b-img
          :src="require('../assets/img/profile.png')"
          rounded="circle"
          fluid-grow alt="Fluid-grow image">
        </b-img>
      </b-container>
      <div class="title">
        <h1 class="first-row"><span>epilef</span></h1>
        <h1 class="second-row"><span>rodriguez</span></h1>
        <h2><span>Design & Develop</span></h2>
      </div>
      <div class="quote">
        <p>I'm a software engineer specialised in frontend and backend
           development for complex scalable web apps.</p>
        <!-- <h2>This is a work in progress, so don't judge and check out the <a href="https://github.com/Khanos/khanos.github.io" target="_blank">github</a> and <a href="https://trello.com/b/KdkP1DtZ" target="_blank">trello</a> of the project.</h2> -->
      </div>
      <div class="nav-menu">
        <ol>
          <li>
            <router-link to="/">Home </router-link>
            <img class="img-arrow" src="../assets/img/arrow-right.png"/>
          </li>
          <li>
            <router-link to="/what">What i do </router-link>
            <img class="img-arrow" src="../assets/img/arrow-right.png"/>
          </li>
          <li>
            <router-link to="/how">How i do it </router-link>
            <img class="img-arrow" src="../assets/img/arrow-right.png"/>
          </li>
          <li>
            <router-link to="/who">Who am i </router-link>
            <img class="img-arrow" src="../assets/img/arrow-right.png"/>
          </li>
        </ol>
      </div>
    </b-sidebar>
  </div>
</template>

<script>
export default {
  name: 'SideBar',
};
</script>

<style scoped>
  #aside #toggle-btn{
    position: absolute;
    left: 10px;
    top: 10px;
    background-color: transparent;
    border-color: transparent;
    z-index: 1000;
  }
  #aside #toggle-btn:focus, #aside #toggle-btn.focus {
    box-shadow: none !important;
  }
  #aside #toggle-btn img{
    width: 40px;
  }
  #aside {
    background-color: #FDFFFC;
    align-self: stretch;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  #aside .profile-img{
    width: 70%;
  }
  #aside .title {
    width: 100%;
    margin-top: 10%;
    margin-bottom: 10%;
    text-align: center;
  }

  #aside .title h1 {
    color: #FDFFFC;
    font-size: 2vw;
    letter-spacing: 5px;
  }

  #aside .title h2 {
    font-family: "Raleway", sans-serif;
    font-size: 1.4vw;
    letter-spacing: 5px;
  }

  #aside .title h1.first-row span {
    background-color: #4D4444;
    position: relative;
    right: 20%;
  }

  #aside .title h1.second-row span {
    background-color: #4D4444;
    position: relative;
    left: 10%;
  }

  #aside .title h1.second-row::first-letter {
    color: #F800AE;
  }

  #aside .nav-menu {
    position: absolute;
    bottom: 0;
    right: 0;
  }

  #aside img.img-arrow {
    width: 0.8vw;
    margin-left: 8px;
    position: relative;
    top: -5px;
  }

  #aside ol {
    width: 100%;
    text-align: right;
    list-style: none;
    flex-grow: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0px;
  }

  #aside ol li {
    padding: 2vh 10px;
  }

  #aside ol li a {
    text-decoration: none;
    color: #4D4444;
    font-family: "Roboto-Thin", sans-serif;
    font-size: 1.8vw;
    font-weight: bold;
  }
  #aside ol li a.router-link-exact-active {
    background-color: #4d4444;
    color: #ffffff !important;
    padding-left: 6vw;
  }

  @media screen and (max-width: 700px) {
    #aside #toggle-btn{
      position: absolute;
      left: 10px;
      top: 10px;
      background-color: transparent;
      border-color: transparent;
    }
    #aside #toggle-btn img{
      width: 40px;
    }
    #aside {
      height: 100%;
      width: 70%;
      display: none;
      position: fixed;
      z-index: 10;
      top: 0;
      left: 0;
      overflow-x: hidden;
      transition: 0.5s;
    }

    #aside .title h1 {
      font-size: 4.2vh;
    }

    #aside .title h2 {
      font-size: 2.6vh;
    }

    #aside ol li a {
      font-size: 4vh;
    }

    #aside img.img-arrow {
      width: 1rem;
    }
  }
</style>
