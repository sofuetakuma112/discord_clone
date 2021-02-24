<template>
  <v-navigation-drawer app permanent right clipped :style="darkBackGround">
    <template v-slot:prepend>
      <v-list-item two-line v-for="user in users" :key="user._id">
        <v-list-item-avatar>
          <template
            v-if="
              !toBoolean(user.is_anonymous) &&
                user.imageConvertedToBase64.length !== 0
            "
          >
            <img :src="user.imageConvertedToBase64" alt="" />
          </template>
          <template v-else>
            <img src="../assets/anonymous.png" />
          </template>
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
    users: Array,
  },
  // computed: {
  //   user(): types.User {
  //     return this.$store.getters.getUser;
  //   },
  // },
  methods: {
    toBoolean(booleanStr: string): boolean {
      return booleanStr.toLowerCase() === 'true';
    },
  },
});
</script>
