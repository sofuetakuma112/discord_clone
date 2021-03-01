<template>
  <v-app id="inspire">
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import api from '@/api/index';

export default Vue.extend({
  async created() {
    if (localStorage.tokenAndHash) {
      api()
        .post('/auth', { tokenAndHash: localStorage.tokenAndHash })
        .then((result) => {
          if (result.data.status === 1) {
            localStorage.tokenAndHash = result.data.tokenAndHash;
            this.$store.commit('updateUser', {
              _id: result.data._id,
              name: result.data.name,
              email: result.data.email,
              isAnonymous: result.data.is_anonymous,
              imageConvertedToBase64: result.data.imageConvertedToBase64,
            });
            if (this.$route.name !== 'Discord')
              this.$router.push({ name: 'Discord' });
          } else localStorage.removeItem('tokenAndHash');
        });
    }
  },
});
</script>

<style scoped>
#inspire {
  overflow-y: hidden;
  height: 100vh;
}
</style>
