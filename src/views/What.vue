<template>
  <section class="section-container what">
    <b-container fluid>
      <b-row>
        <b-col cols="4">
          <b-container class="github-img">
            <b-img
              :src="require('../assets/img/github.png')"
              rounded="circle"
              fluid-grow alt="Fluid-grow image">
            </b-img>
          </b-container>
          <b-container class="what-title">
            <h2><span class="foxy">G</span>itHub API connection</h2>
            <h2><span class="foxy">d</span>emostration</h2>
          </b-container>
          <b-container class="what-form">
            <b-form @submit="onSubmit" @reset="onReset" v-if="show">
              <b-form-group
                id="input-group-search"
                label="Lets search some FUN words for the most recent
                commits for public repos on GitHub."
                label-for="input-search"
                description="The use of bad words is on your own discretion,
                 it's pretty fun, though."
              >
                <b-form-input
                  id="input-search"
                  v-model="form.search"
                  type="text"
                  required
                  placeholder="e.g. cheese"
                ></b-form-input>
              </b-form-group>
              <b-button class="main-button" type="submit" variant="primary">SEARCH</b-button>
            </b-form>
          </b-container>
          <b-container class="what-explanation text-left">
            <p>This would make a http request to the backend server where all the magic happens,
               then returns a json response.</p>
            <p>Which would render those cards on the right.</p>
            <p>Check Out:</p>
            <ol>
              <li>BackEnd api. <a href="https://khanos-backend.herokuapp.com/" target="_blank">HERE</a></li>
              <li>BackEnd Source Code. <a href="https://github.com/Khanos/khanos.backend" target="_blank">HERE</a></li>
            </ol>
          </b-container>
        </b-col>
        <b-col>
          <b-container class="cards" fluid  v-if="response">
            <Commits
              v-for="commit in response"
              :key="commit.id"
              :item="commit"
            />
          </b-container>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import Commits from '@/components/Commits.vue';
import axios from 'axios';

export default {
  name: 'What',
  components: {
    Commits,
  },
  data() {
    return {
      form: {
        search: '',
      },
      show: true,
      response: null,
    };
  },
  mounted() {
    console.log('hola from mounted');
    this.response = this.getFistCommits('cheese');
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      alert(JSON.stringify(this.form));
    },
    async getFistCommits(word) {
      const options = {
        method: 'get',
        url: `https://khanos-backend.herokuapp.com/api/v1/github/getCommits/${word}`,
        headers: {
          Accept: 'application/vnd.github.cloak-preview',
        },
        responseType: 'json',
      };
      const { data } = await axios(options);
      return data;
    },
  },
};
</script>

<style scoped>
  .what .github-img{
    width: 40%;
    padding: 30px;
  }
  .what .what-title, .what .what-form, .what .what-explanation {
    margin-bottom: 25px;
  }
  .what-title h2 {
    color: #FFFFFF;
    font-weight: 600;
    font-size: 2.5rem;
  }
  .what-title h2 .foxy {
    color: #F800AE;
    font-size: 3rem;
    font-family: "Roboto", sans-serif;
    font-weight: 900;
    font-style: italic;
    text-decoration: none;
    margin-right: 5px;
  }
  .what input#input-search {
    -webkit-box-shadow: 0px 0px 0.2px 1px #F800AE;
    -moz-box-shadow: 0px 0px 0.2px 1px #F800AE;
    box-shadow: 0px 0px 0.2px 1px #F800AE;
    opacity: 0.6;
    height: 40px;
    width: 300px;
    margin: 0 auto;
  }
  .section-container.what button.main-button {
    border: solid 2px #4D4444;
    padding: 8px 80px;
    display: inline-block;
    margin-top: 40px;
    margin-bottom: 40px;
    text-decoration: none;
    text-transform: uppercase;
    font-family: "Roboto", sans-serif;
    font-size: 4vh;
    font-weight: 400;
    color: #4D4444;
    background-color: #D6D5D6;
    -webkit-box-shadow: 0px 0px 0.2px 1px #F800AE;
    -moz-box-shadow: 0px 0px 0.2px 1px #F800AE;
    box-shadow: 0px 0px 0.2px 1px #F800AE;
    opacity: 0.6;
  }
  .section-container.what button.main-button:hover {
    -webkit-box-shadow: 0px 0px 2px 1px #F800AE;
    -moz-box-shadow: 0px 0px 2px 1px #F800AE;
    box-shadow: 0px 0px 2px 1px #F800AE;
    opacity: 1;
  }
</style>
