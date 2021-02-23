<template>
  <v-navigation-drawer app permanent right clipped :style="darkBackGround">
    <template v-slot:prepend>
      <v-list-item two-line>
        <v-list-item-avatar>
          <img src="https://randomuser.me/api/portraits/women/81.jpg" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title class="grey--text">{{
            user.name
          }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue';
import * as types from '@/types/index.d.ts';

export default Vue.extend({
  props: {
    darkBackGround: Object,
  },
  computed: {
    user(): types.User {
      return this.$store.getters.getUser;
    },
  },
});
</script>
