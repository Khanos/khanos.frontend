<template>
  <div id="app">
    <SideBar/>

    <router-view/>
  </div>
</template>

<script>
import SideBar from '@/components/SideBar.vue';

export default {
  name: 'Home',
  components: {
    SideBar,
  },
};
</script>

<style>
  #app {
    font-family: "Roboto", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
  }

  @font-face {
    font-family: "Raleway";
    src: url("./assets/fonts/Raleway-Regular.ttf");
  }

  @font-face {
    font-family: "Raleway-Thin";
    src: url("./assets/fonts/Raleway-Thin.ttf");
  }

  @font-face {
    font-family: "Roboto";
    src: url("./assets/fonts/Roboto-Regular.ttf");
  }

  @font-face {
    font-family: "Roboto-Thin";
    src: url("./assets/fonts/Roboto-Thin.ttf");
  }

  :root {
    font-size: 16px;
  }

  @media screen and (max-width: 700px) {
    h1 {
      font-size: 1.6rem;
    }

    h2 {
      font-size: 1.2rem;
    }

    p {
      font-size: 1rem;
    }
  }
</style>
