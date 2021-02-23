import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import VueApollo from 'vue-apollo';

// Apollo Clientは、ReactやAngularなどの統合機能を備えた、
// フル機能を備えたキャッシング用のGraphQLクライアントです。
// Apollo Boost は、設定不要で Apollo Client を使い始めることができます。
import ApolloClient from 'apollo-boost';

Vue.use(VueApollo);

Vue.config.productionTip = false;

// Create Apollo Client
const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
});

// Create Apollo Provider
const apolloProvider = new VueApollo({
  defaultClient: client,
});

// router.beforeEach((to, from, next) => {
//   if (to.matched.some((record) => record.meta.requiresAuth)) {
//     console.log(store.getters.getUser)
//     if (store.getters.getUser) next()
//     else next('/login')
//   }
//   next();
// });

new Vue({
  store,
  router,
  vuetify,
  apolloProvider,
  render: (h) => h(App),
}).$mount('#app');
