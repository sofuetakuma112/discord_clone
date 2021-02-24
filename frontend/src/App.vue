<template>
  <v-app id="inspire">
    <v-main>
      <router-view :socket="socket"></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import api from '@/api/index';
import { io, Socket } from 'socket.io-client';

type DataType = {
  socket: Socket | null;
};

export default Vue.extend({
  data(): DataType {
    return {
      socket: null,
    };
  },
  async created() {
    this.socket = io('http://0.0.0.0:3000');

    if (localStorage.tokenAndHash) {
      console.log(localStorage.tokenAndHash);
      api()
        .post('/auth', { tokenAndHash: localStorage.tokenAndHash })
        .then((result) => {
          if (result.data.status === 1) {
            this.$store.commit('updateUser', {
              _id: result.data.user._id,
              name: result.data.user.name,
              email: result.data.user.email,
              isAnonymous: result.data.user.is_anonymous,
              imageConvertedToBase64: result.data.user.imageConvertedToBase64,
            });
          }
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
