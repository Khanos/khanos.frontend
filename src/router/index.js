import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import What from '../views/What.vue';
import Who from '../views/Who.vue';
import How from '../views/How.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/what',
    name: 'What',
    component: What,
  },
  {
    path: '/who',
    name: 'Who',
    component: Who,
  },
  {
    path: '/how',
    name: 'How',
    component: How,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
