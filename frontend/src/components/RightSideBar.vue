<template>
  <v-navigation-drawer app permanent right clipped :style="darkBackGround">
    <template v-slot:prepend>
      <v-hover v-slot="{ hover }" v-for="user in users" :key="user._id">
        <v-list-item style="cursor: pointer" two-line class="mb-2" :class="{ 'on-hover': hover }">
          <v-list-item-avatar class="mr-2">
            <template
              v-if="
                !toBoolean(user.is_anonymous) &&
                  user.imageConvertedToBase64.length !== 0
              "
            >
              <img
                :src="user.imageConvertedToBase64"
                alt=""
                class="avatar-img"
              />
            </template>
            <template v-else>
              <img src="../assets/anonymous.png" class="avatar-img" />
            </template>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title class="grey--text">{{
              user.name
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-hover>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue';
// import * as types from '@/types/index.d.ts';

export default Vue.extend({
  props: {
    darkBackGround: Object,
    users: Array,
  },
  methods: {
    toBoolean(booleanStr: string): boolean {
      return booleanStr.toLowerCase() === 'true';
    },
  },
});
</script>

<style scoped>
.avatar-img {
  height: 32px;
  width: 32px;
}

.on-hover {
  background-color: #32353b;
  position: relative;
}
</style>

<style>
.v-navigation-drawer__prepend {
  padding-top: 10px;
}

.v-navigation-drawer--clipped:not(.v-navigation-drawer--temporary):not(.v-navigation-drawer--is-mobile) {
  overflow-y: scroll;
}

.v-list-item.v-list-item--two-line.theme--light {
  height: 44px;
}

.v-list--two-line .v-list-item,
.v-list-item--two-line {
  min-height: auto !important;
}
</style>
