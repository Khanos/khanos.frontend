<template>
  <section class="section-container what">
    <b-container fluid>
      <b-row>
        <b-col class="left-pane" lg="6" md="12" sm="12">
          <b-container class="github-img">
            <b-img
              :src="require('../assets/img/github.png')"
              rounded="circle"
              fluid-grow
              alt="Fluid-grow image"
            >
            </b-img>
          </b-container>
          <b-container class="what-title">
            <h2><span class="foxy">G</span>itHub API connection</h2>
            <h2><span class="foxy">d</span>emostration</h2>
          </b-container>
          <b-container class="what-form">
            <b-form @submit="onSubmit" v-if="show">
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
              <b-button class="main-button" type="submit" variant="primary">
                SEARCH
              </b-button>
            </b-form>
          </b-container>
          <b-container class="what-explanation text-left">
            <p>
              This would make a http request to the backend server where all the
              magic happens, then returns a json response.
            </p>
            <p>Which would render those cards on the right.</p>
            <p>Check Out:</p>
            <ol>
              <li>
                BackEnd api.
                <a href="https://khanos-backend.herokuapp.com/" target="_blank"
                  >HERE</a
                >
              </li>
              <li>
                BackEnd Source Code.
                <a
                  href="https://github.com/Khanos/khanos.backend"
                  target="_blank"
                  >HERE</a
                >
              </li>
            </ol>
          </b-container>
        </b-col>
        <b-col class="right-pane" lg="6" md="12" sm="12">
          <b-container id="cards" class="cards" fluid v-if="response">
            <div class="loading" v-if="loading">
              <p>
                <b-spinner
                  style="width: 2.5rem; height: 2.5rem"
                  label="Spinning"
                ></b-spinner>
                Loading...
              </p>
            </div>
            <div v-else>
              <div v-if="response.length > 0">
                <Commits
                  v-for="commit in response"
                  v-bind:item="commit"
                  :key="commit.id"
                />
              </div>
              <div class="error" v-else>
                <b-alert class="" variant="danger" show>
                  <i class="far fa-tired"></i> Ups, no luck with the word:
                  <span class="foxy">{{ this.form.search }}</span> You could try
                  with another one.
                </b-alert>
              </div>
            </div>
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
      loading: false,
      response: [],
      show: true,
    };
  },
  mounted() {
    this.getFirstCommits('cheese');
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      this.getFirstCommits(this.form.search);
    },
    getFirstCommits(word) {
      this.loading = true;
      const options = {
        method: 'get',
        url: `https://khanos-backend.herokuapp.com/api/v1/github/getCommits/${word}`,
        headers: {
          Accept: 'application/vnd.github.cloak-preview',
        },
        responseType: 'json',
      };
      axios(options)
        .then((response) => {
          const { data } = response;
          data.map((item) => {
            const localItem = item;
            const regex = new RegExp(`${word}`, 'gi');
            localItem.commit.message = item.commit.message.replace(
              regex,
              `<span class="foxy">${word}</span>`,
            );
            return localItem;
          });
          this.response = data;
          this.loading = false;
        })
        .catch((error) => {
          this.response = error;
        })
        .finally(() => {
          this.loading = false;
          document.getElementById('cards').scrollIntoView({ behavior: 'smooth' });
        });
    },
  },
};
</script>

<style scoped>
*::-webkit-scrollbar {
  width: 0.5em;
  border-radius: 0.5em;
}

*::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px #f800ae44;
}

*::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  outline: 1px solid slategrey;
}
.loading {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
}
.error {
  position: absolute !important;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.what .what-title,
.what .what-form,
.what .what-explanation {
  margin-bottom: 25px;
}
.what-title h2 {
  color: #ffffff;
  font-weight: 600;
  font-size: 2.5rem;
}
.what-title h2 .foxy {
  color: #f800ae;
  font-size: 3rem;
  font-family: "Roboto", sans-serif;
  font-weight: 900;
  font-style: italic;
  text-decoration: none;
  margin-right: 5px;
}
.what input#input-search {
  -webkit-box-shadow: 0px 0px 0.2px 1px #f800ae;
  -moz-box-shadow: 0px 0px 0.2px 1px #f800ae;
  box-shadow: 0px 0px 0.2px 1px #f800ae;
  opacity: 0.6;
  height: 40px;
  width: 300px;
  margin: 0 auto;
}
.section-container.what button.main-button {
  border: solid 2px #4d4444;
  padding: 8px 80px;
  display: inline-block;
  margin-top: 40px;
  margin-bottom: 40px;
  text-decoration: none;
  text-transform: uppercase;
  font-family: "Roboto", sans-serif;
  font-size: 4vh;
  font-weight: 400;
  color: #4d4444;
  background-color: #d6d5d6;
  -webkit-box-shadow: 0px 0px 0.2px 1px #f800ae;
  -moz-box-shadow: 0px 0px 0.2px 1px #f800ae;
  box-shadow: 0px 0px 0.2px 1px #f800ae;
  opacity: 0.6;
}
.section-container.what button.main-button:hover {
  -webkit-box-shadow: 0px 0px 2px 1px #f800ae;
  -moz-box-shadow: 0px 0px 2px 1px #f800ae;
  box-shadow: 0px 0px 2px 1px #f800ae;
  opacity: 1;
}
.what .cards {
  max-height: 100vh;
  overflow: auto;
}
@media screen and (max-width: 700px) {
  .loading[data-v-12cc5bfe] {
    width: 10rem;
    height: fit-content;
    position: fixed;
    top: 50%;
    left: 30%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    background: #fff;
    padding: 10px;
  }
  .left-pane {
    margin-left: 0;
  }
  .what .github-img {
    width: 5rem;
    margin: 0 auto;
    padding: 10px;
  }
  .what .right-pane {
    padding: 0;
  }
}
</style>
