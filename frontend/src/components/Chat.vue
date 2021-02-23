<template>
  <div class="chat">
    <v-list two-line :style="greyBackGround" height="100%">
      <template v-if="chats.length !== 0">
        <template v-for="chat in chats">
          <v-list-item :key="chat._id">
            <v-list-item-avatar color="grey darken-1">
              <img v-if="chat.user.is_anonymous" src="../assets/anonymous.png" />
              <!-- <img src="" alt=""> -->
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title class="white--text"
                >{{ chat.name
                }}<span class="date">{{
                  chat.created
                }}</span></v-list-item-title
              >

              <v-list-item-subtitle class="white--text">
                {{ chat.message }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
      </template>
      <template v-else>
        <div class="no-chat">
          <h2>このチャンネルではまだ誰も発言していません<br />あなたが一番の発言者になりましょう！</h2>
        </div>
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
  methods: {
    scrollBottom() {
      this.$nextTick(() => {
        this.$el.scrollTo(0, document.body.clientHeight);
      });
    },
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
  height: 100%;
}

.date {
  margin-left: 10px;
  font-size: 12px;
}

.no-chat {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.no-chat h2 {
  color: #fff;
  text-align: center;
}
</style>
