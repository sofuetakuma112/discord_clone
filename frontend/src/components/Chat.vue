<template>
  <div class="chat">
    <v-list two-line :style="greyBackGround" height="100%">
      <template v-if="chats.length !== 0">
        <template v-for="chat in chats">
          <template v-if="chat.user">
            <v-list-item :key="chat._id">
              <div class="d-inline-flex flex-column">
                <div class="d-inline-flex">
                  <template
                    v-if="
                      !toBoolean(chat.user.is_anonymous) &&
                        chat.user.imageConvertedToBase64.length !== 0
                    "
                  >
                    <v-list-item-avatar color="grey darken-1">
                      <img :src="chat.user.imageConvertedToBase64" alt="" />
                    </v-list-item-avatar>
                  </template>
                  <template v-else>
                    <v-list-item-avatar>
                      <img src="../assets/anonymous.png" />
                    </v-list-item-avatar>
                  </template>

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
                </div>
                <template v-if="chat.imageData.length !== 0">
                  <v-img
                    lazy-src="https://picsum.photos/id/11/10/6"
                    max-height="300"
                    max-width="250"
                    :src="chat.imageData"
                    @click="clickImage(chat.imageData)"
                  ></v-img>
                </template>
              </div>
            </v-list-item>
          </template>
          <template v-else>
            <v-list-item :key="chat._id">
              <v-list-item-avatar color="grey darken-1">
                <img src="../assets/delete.png" />
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title class="white--text"
                  >{{ chat.name
                  }}<span class="isAlreadyDeleted">(削除済みのアカウント)</span
                  ><span class="date">{{
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
      </template>
      <template v-else>
        <div class="no-chat">
          <h2>
            このチャンネルではまだ誰も発言していません<br />あなたが一番の発言者になりましょう！
          </h2>
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
    toBoolean(booleanStr: string): boolean {
      return booleanStr.toLowerCase() === 'true';
    },
    clickImage(imageData: string) {
      this.$emit('openImageModal', imageData);
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

.isAlreadyDeleted {
  font-size: 10px;
  margin-left: 5px;
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
