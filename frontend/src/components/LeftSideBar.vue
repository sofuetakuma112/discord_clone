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
        style="cursor: pointer"
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
          style="cursor: pointer"
          @click="goServer"
          ><img
            alt="Avatar"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/1200px-Typescript_logo_2020.svg.png"
        /></v-avatar>
      </v-hover>
    </v-navigation-drawer>

    <slot name="content"></slot>

    <div class="user-container d-flex">
      <div class="user-icon my-auto mx-2">
        <v-avatar size="32"
          ><img
            :src="user.imageConvertedToBase64"
            alt=""
            height="32px"
            width="32px"
        /></v-avatar>
      </div>
      <div class="user-info my-auto">
        <p class="user-name">{{ user.name }}</p>
        <p class="user-id">{{ user._id }}</p>
      </div>
      <div class="d-flex my-auto">
        <v-btn icon height="32px" width="32px" @click="isMicMute = !isMicMute"
          ><v-icon v-if="!isMicMute" dark size="32px" dense small color="#b9bbbe"
            >fas fa-microphone</v-icon
          ><v-icon v-else dark size="32px" dense small color="#b9bbbe"
            >fas fa-microphone-slash</v-icon
          ></v-btn
        >
        <v-btn
          icon
          height="32px"
          width="32px"
          @click="isSpeakerMute = !isSpeakerMute"
        >
          <v-icon v-if="!isSpeakerMute" dark size="32px" dense small color="#b9bbbe"
            >fas fa-volume-up</v-icon
          ><v-icon v-else dark size="32px" dense small color="#b9bbbe"
            >fas fa-volume-off</v-icon
          >
        </v-btn>
        <v-btn
          icon
          height="32px"
          width="32px"
          @click="hangUp"
          :disabled="currentVoiceChannelId.length === 0"
          ><v-icon dark size="32px" dense small color="#b9bbbe">
            fas fa-phone-slash
          </v-icon></v-btn
        >
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue';
import * as types from '@/types/index.d.ts';

export default Vue.extend({
  data() {
    return {
      drawer: null,
      isMicMute: false,
      isSpeakerMute: false,
      isSettingOpen: false,
    };
  },
  props: {
    darkBackGround: Object,
    allData: Array,
    currentVoiceChannelId: String,
  },
  computed: {
    user(): types.User {
      return this.$store.getters.getUser;
    },
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
    hangUp() {
      this.$emit('hangUp');
    },
  },
});
</script>

<style scoped>
.user-container {
  padding-left: 70px;
  height: 53px;
  background-color: #292b2f;
  position: absolute;
  bottom: 0;
  width: 100%;
}

.user-icon {
  max-width: 32px;
}

.user-info p {
  margin: 0;
  padding: 0;
  max-width: 84px;
}

.user-name {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  line-height: 18px;
  font-weight: 600;
  font-size: 14px;
  color: #fff;
}

.user-id {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: #b9bbbe;
  line-height: 13px;
  font-size: 12px;
}

.device-checkbox {
  max-width: 96px;
}
</style>

<style>
.theme--light.v-navigation-drawer .v-divider {
  border-color: hsla(0, 0%, 100%, 0.06);
}

.v-navigation-drawer.v-navigation-drawer--absolute.v-navigation-drawer--mini-variant.v-navigation-drawer--open.theme--light {
  z-index: 5;
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
