import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import store from '@/store/index';
import Discord from '@/views/Discord.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/discord',
    name: 'Discord',
    component: Discord,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
