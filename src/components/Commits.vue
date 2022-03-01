<template>
  <b-card
    :img-src="item.author.avatar"
    img-alt="Card image"
    img-left
    no-body
    class="overflow-hidden mb-3"
  >
    <b-card-body :title="'Author: ' + item.author.login" class="text-left">
      <b-card-text>
        <p class="repo-info">
          <span>{{ item.repo.name }}</span
          >,
          <span>{{ item.repo.description }}</span>
        </p>
        <b-container class="m-0 p-0">
          <p class="message mb-4">
            Commit: <span v-html="item.commit.message"></span>.
            <a :href="item.commit.url" target="_blank">See commit</a>
          </p>
          <p class="footer">
            {{ getFormatDate(item.commit.date) }}
          </p>
        </b-container>
      </b-card-text>
    </b-card-body>
  </b-card>
</template>

<script>
import moment from 'moment';

export default {
  name: 'Commits',
  props: ['item'],
  methods: {
    getFormatDate(date) {
      return moment(date).format('MMMM Do YYYY, h:mm:ss a');
    },
  },
};
</script>

<style scoped>
.card {
  margin: 20px;
  border-radius: 15px;
}
.card-img-left {
  display: block;
  max-width: 180px;
  max-height: 180px;
  width: auto;
  height: auto;
  aspect-ratio: 1;
  margin: auto 0;
  border-radius: 50%;
  padding: 10px;
}
h4.card-title {
  margin-bottom: 0px;
}
p.repo-info {
  font-style: italic;
  font-weight: 200;
  color: #888184;
}
p.footer {
  position: absolute;
  bottom: 0;
  right: 20px;
}
@media screen and (max-width: 700px) {
  .container-fluid {
    margin: 0;
  }
  .card {
    margin: 20px 0px;
  }
  .imgContainer {
    margin-bottom: 9rem;
  }
  .message {
    margin-bottom: 2rem;
  }
}
</style>
