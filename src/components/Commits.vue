<template>
  <b-card no-body class="overflow-hidden">
    <b-row no-gutters>
      <b-col md="2" sm="12" class="imgContainer">
        <b-card-img
          :src="item.author.avatar"
          alt="Image"
          class="rounded-0"
          fluid
        ></b-card-img>
      </b-col>
      <b-col md="10" sm="12" class="text-left">
        <b-card-body :title="'Author: ' + item.author.login">
          <b-card-text>
            <p class="repo-info">
              <span>{{ item.repo.name }}</span
              >,
              <span>{{ item.repo.description }}</span>
            </p>
            <h4 class="message">
              Commit: <span v-html="item.commit.message"></span>.
              <a :href="item.commit.url" target="_blank">See commit</a>
            </h4>
            <p class="footer">{{ item.commit.date }}</p>
          </b-card-text>
        </b-card-body>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
export default {
  name: 'Commits',
  props: ['item'],
};
</script>

<style scoped>
.card {
  margin: 20px;
}
.card .imgContainer {
  min-height: 180px;
  max-height: 180px;
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
