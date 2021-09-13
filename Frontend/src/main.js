import Vue from 'vue'
import App from './App.vue'

import Home from './Home.vue'
import Petitions from './Petitions.vue'
import Register from './Register.vue'
import Profile from "./Profile";
import EditPetition from "./EditPetition";
import CreatePetition from "./CreatePetition";
import ViewPetition from "./ViewPetition";


import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios);

import VueRouter from 'vue-router'
Vue.use(VueRouter);

import { BootstrapVue, NavbarPlugin } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
Vue.use(BootstrapVue);
Vue.use(NavbarPlugin);

import VueCookies from 'vue-cookies';
Vue.use(VueCookies);

const routes = [
  {
    path: "/",
    component: Home,
    name: "login"
  },
  {
    path: "/register",
    name: "register",
    component: Register
  },
  {
    path: "/petitions/",
    name: "petitions",
    component: Petitions
  },
  {
    path: "/petitions/:petitionId",
    name: "viewPetition",
    component: ViewPetition
  },
  {
    path: "/createPetition",
    component: CreatePetition,
    name: 'CreatePetition'
  },
  {
    path: "/petitions/:petitionId/edit",
    component: EditPetition,
    name: 'editPetition'
  },
  {
    path: "/myPetitions",
    component: Profile,
    name: 'myPetitions'
  },
  {
    path: "/viewProfile",
    component: Profile,
    name: 'viewProfile'
  },
  {
    path: "/editProfile",
    component: Profile,
    name: 'editProfile'
  }

];

const router = new VueRouter({
  routes: routes,
  mode: 'history'
});


new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
});
