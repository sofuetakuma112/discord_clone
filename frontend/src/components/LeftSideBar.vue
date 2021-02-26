<template>
  <v-navigation-drawer v-model="drawer" app width="300" :style="darkBackGround">
    <v-navigation-drawer
      v-model="drawer"
      absolute
      mini-variant
      style="background: #202225"
      width="70px"
    >
      <v-avatar
        class="d-block text-center mx-auto mt-4"
        color="grey darken-1"
        size="48"
        @click="goHome"
        ><v-icon dark>
          fab fa-discord
        </v-icon></v-avatar
      >

      <v-divider class="mx-3 my-2"></v-divider>

      <v-hover v-slot="{ hover }" v-for="n in 1" :key="n">
        <v-avatar
          class="d-block text-center mx-auto mb-2"
          color="grey lighten-1"
          size="48"
          :class="{ 'on-hover': hover }"
          @click="goServer"
          ><img
            alt="Avatar"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/1200px-Typescript_logo_2020.svg.png"
        /></v-avatar>
      </v-hover>
    </v-navigation-drawer>

    <slot name="content"></slot>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      drawer: null,
    };
  },
  props: {
    darkBackGround: Object,
    allData: Array,
  },
  methods: {
    showChat(channelId: string) {
      this.$emit('showChat', channelId);
    },
    openAddChannelModal(categoryId: string) {
      this.$emit('openAddChannelModal', categoryId);
    },
    createNewCategory() {
      this.$emit('openCreateCategoryModal');
    },
    goHome() {
      this.$emit('goHome');
    },
    goServer() {
      this.$emit('goServer');
    },
  },
});
</script>

<style>
.theme--light.v-navigation-drawer .v-divider {
  border-color: hsla(0, 0%, 100%, 0.06);
}

.v-navigation-drawer.v-navigation-drawer--absolute.v-navigation-drawer--mini-variant.v-navigation-drawer--open.theme--light {
  width: 70px !important;
}

.v-expansion-panel-header {
  min-height: auto !important;
  padding: 0 !important;
}

.v-expansion-panel--active > .v-expansion-panel-header {
  min-height: auto !important;
}

.v-list-item--link:before {
  background-color: #33363c !important;
}

.v-expansion-panel-content__wrap {
  padding: 0 !important;
}
</style>
