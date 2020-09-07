<template>
  <b-card no-body class="overflow-hidden">
    <b-row no-gutters>
      <b-col md="2">
        <b-card-img :src="item.author.avatar" alt="Image" class="rounded-0"></b-card-img>
      </b-col>
      <b-col md="10" class="text-left">
        <b-card-body :title="'Author: '+item.author.login">
          <b-card-text>
            <p class="repo-info">
              <span>{{ item.repo.name }}</span>,
              <span>{{ item.repo.description }}</span>
            </p>
            <p class="message">{{item.commit.message}}.
               <a :href="item.commit.url">See commit</a></p>
            <p class="footer">{{item.commit.date}}</p>
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
</style>
