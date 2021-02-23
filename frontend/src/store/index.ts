import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
  },
  getters: {
    getUser: (state) => {
      return state.user;
    },
  },
  mutations: {
    updateUser(state, payload) {
      state.user = payload;
    },
  },
  actions: {},
  modules: {},
});
