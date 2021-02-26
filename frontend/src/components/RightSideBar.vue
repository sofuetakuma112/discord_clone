<template>
  <v-navigation-drawer
    app
    permanent
    right
    clipped
    :style="darkBackGround"
    class="nav"
  >
    <template v-slot:prepend>
      <template>
        <v-menu
          min-width="auto"
          left
          :offset-x="true"
          v-for="user in users"
          :key="user._id"
          :close-on-content-click="false"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-list-item
              style="cursor: pointer"
              two-line
              class="mb-2 v-list-item"
              @click="selectedUserId = user._id"
              v-bind="attrs"
              v-on="on"
            >
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
          </template>
          <Card :user="user" @submitDM="submitDM" />
        </v-menu>
        <!-- <v-hover v-slot="{ hover }" v-for="user in users" :key="user._id">
          <v-list-item
            style="cursor: pointer"
            two-line
            class="mb-2 v-list-item"
            :class="{ 'on-hover': hover }"
            :key="user._id"
            @click="selectedUserId = user._id"
          >
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
            <Card v-if="selectedUserId === user._id" :user="user" />
          </v-list-item>
        </v-hover> -->
      </template>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue';
import Card from '@/components/Card.vue';
// import * as types from '@/types/index.d.ts';

export default Vue.extend({
  data() {
    return {
      selectedUserId: '',
    };
  },
  components: {
    Card,
  },
  props: {
    darkBackGround: Object,
    users: Array,
  },
  methods: {
    toBoolean(booleanStr: string): boolean {
      return booleanStr.toLowerCase() === 'true';
    },
    submitDM(messageData: any) {
      this.$emit('submitDB', messageData);
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

.card {
  position: absolute;
}
</style>

<style>
.v-navigation-drawer__prepend {
  padding-top: 10px;
}

.v-navigation-drawer--clipped:not(.v-navigation-drawer--temporary):not(.v-navigation-drawer--is-mobile) {
  overflow: visible;
}

.v-list-item.v-list-item--two-line.theme--light {
  height: 44px;
}

.v-list--two-line .v-list-item,
.v-list-item--two-line {
  min-height: auto !important;
}
</style>
