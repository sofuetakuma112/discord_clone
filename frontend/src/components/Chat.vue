<template>
  <div class="chat">
    <v-list two-line :style="greyBackGround">
      <template v-for="chat in chats">
        <v-list-item :key="chat._id">
          <v-list-item-avatar color="grey darken-1">
            <img src="https://randomuser.me/api/portraits/women/81.jpg" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title class="white--text"
              >{{ chat.name
              }}<span class="date">{{ chat.created }}</span></v-list-item-title
            >

            <v-list-item-subtitle class="white--text">
              {{ chat.message }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    greyBackGround: Object,
    chats: Array,
  },
});
</script>

<style scoped>
.root {
  background-color: #36393f;
}

.chat {
  overflow-y: scroll;
  max-height: 90%;
}

.date {
  margin-left: 10px;
  font-size: 12px;
}
</style>
