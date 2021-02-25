<template>
  <div class="chat">
    <v-list two-line :style="greyBackGround" height="100%">
      <template v-if="chats.length !== 0">
        <template v-for="chat in chats">
          <template v-if="chat.user">
            <v-hover :key="chat._id" v-slot="{ hover }">
              <v-list-item :class="{ 'on-hover': hover }">
                <div class="menu" v-if="hover && chat.user._id === user._id">
                  <v-row>
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <div
                          class="icon-wrapper"
                          :class="{
                            'on-hover-icon': toBoolean(attrs['aria-expanded']),
                          }"
                          v-bind="attrs"
                          v-on="on"
                          @click="edit(chat._id, chat.message)"
                        >
                          <v-icon size="22px" color="#fff" class="mt-1">{{
                            mdiPencil
                          }}</v-icon>
                        </div>
                      </template>
                      <span>編集</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <div
                          class="icon-wrapper"
                          :class="{
                            'on-hover-icon': toBoolean(attrs['aria-expanded']),
                          }"
                          v-bind="attrs"
                          v-on="on"
                          @click="showDeleteModal(chat)"
                        >
                          <v-icon size="20" color="#fff">fas fa-trash</v-icon>
                        </div>
                      </template>
                      <span>削除</span>
                    </v-tooltip>
                  </v-row>
                </div>
                <v-row class="d-flex flex-column dense no-gutters">
                  <div class="d-flex">
                    <v-col class="flex-grow-0 flex-shrink-0 pa-0">
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
                    </v-col>
                    <v-col class="pa-0">
                      <v-list-item-content>
                        <v-list-item-title class="white--text"
                          >{{ chat.name
                          }}<span class="date">{{
                            chat.created
                          }}</span></v-list-item-title
                        >

                        <v-list-item-subtitle
                          class="white--text"
                          v-if="!(editChatId === chat._id)"
                        >
                          {{ chat.message }}
                        </v-list-item-subtitle>
                        <div v-else class="edit-field">
                          <v-text-field
                            solo
                            dense
                            v-model="editChatMessage"
                            full-width
                            height="44px"
                            background-color="#40444b"
                            color="#fff"
                            flat
                          >
                          </v-text-field>
                          <div class="text-field-bottom">
                            Escキーで<span
                              @click="closeEdit"
                              class="cancel-or-save"
                              >キャンセル</span
                            >
                            • Enterキーで
                            <span @click="editSave" class="cancel-or-save"
                              >保存</span
                            >
                          </div>
                        </div>
                      </v-list-item-content>
                    </v-col>
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
                </v-row>
              </v-list-item>
            </v-hover>
          </template>
          <!-- 削除済みの匿名ユーザーのチャットを表示 -->
          <template v-else>
            <v-hover :key="chat._id" v-slot="{ hover }">
              <v-list-item :key="chat._id" :class="{ 'on-hover': hover }">
                <div class="d-inline-flex flex-column">
                  <div class="d-inline-flex">
                    <v-list-item-avatar color="grey darken-1">
                      <img src="../assets/delete.png" />
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title class="white--text"
                        >{{ chat.name
                        }}<span class="isAlreadyDeleted"
                          >(削除済みのアカウント)</span
                        ><span class="date">{{
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
            </v-hover>
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
    <Modal
      v-model="isModalOpen"
      :greyBackGround="greyBackGround"
      @clickedModalOKButton="clickedModalOKButton"
      :width="440"
      :danger="true"
    >
      <template v-slot:content v-if="Object.keys(this.deleteChat).length">
        <h3 class="delete-title">メッセージを削除</h3>
        <p class="delete-message">メッセージを削除します。よろしいですか？</p>
        <v-card elevation="2" color="#36393F" class="mx-5 mb-3">
          <v-list :style="greyBackGround">
            <v-list-item :key="deleteChat._id">
              <div class="d-inline-flex flex-column">
                <div class="d-inline-flex">
                  <template
                    v-if="
                      !toBoolean(deleteChat.user.is_anonymous) &&
                        deleteChat.user.imageConvertedToBase64.length !== 0
                    "
                  >
                    <v-list-item-avatar color="grey darken-1">
                      <img
                        :src="deleteChat.user.imageConvertedToBase64"
                        alt=""
                      />
                    </v-list-item-avatar>
                  </template>
                  <template v-else>
                    <v-list-item-avatar>
                      <img src="../assets/anonymous.png" />
                    </v-list-item-avatar>
                  </template>

                  <v-list-item-content>
                    <v-list-item-title class="white--text"
                      >{{ deleteChat.name
                      }}<span class="date">{{
                        deleteChat.created
                      }}</span></v-list-item-title
                    >

                    <v-list-item-subtitle class="white--text">
                      {{ deleteChat.message }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </div>
                <template v-if="deleteChat.imageData.length !== 0">
                  <v-img
                    lazy-src="https://picsum.photos/id/11/10/6"
                    max-height="300"
                    max-width="250"
                    :src="deleteChat.imageData"
                  ></v-img>
                </template>
              </div>
            </v-list-item>
          </v-list>
        </v-card>
      </template>
      <template v-slot:create-button-text>削除</template>
    </Modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import types from '@/types/index';
import { mdiPencil } from '@mdi/js';
import * as mutations from '@/graphql/mutation';
import Modal from '@/components/Modal.vue';

type DataType = {
  mdiPencil: any;
  editChatId: string;
  editChatMessage: string;
  isModalOpen: boolean;
  deleteChat: any;
};

export default Vue.extend({
  components: {
    Modal,
  },
  data(): DataType {
    return {
      mdiPencil,
      editChatId: '',
      editChatMessage: '',
      isModalOpen: false,
      deleteChat: {},
    };
  },
  props: {
    greyBackGround: Object,
    chats: Array,
  },
  computed: {
    user(): types.User {
      return this.$store.getters.getUser;
    },
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
    edit(id: string, message: string) {
      this.editChatId = '';
      this.editChatId = id;
      this.editChatMessage = message;
    },
    closeEdit() {
      this.editChatId = '';
    },
    async editSave() {
      await this.$apollo.mutate({
        mutation: mutations.editChat,
        variables: {
          id: this.editChatId,
          message: this.editChatMessage,
        },
      });
      this.editChatId = '';
    },
    showDeleteModal(chat: any) {
      this.deleteChat = { ...chat };
      this.isModalOpen = true;
    },
    async clickedModalOKButton() {
      // 削除
      await this.$apollo.mutate({
        mutation: mutations.deleteChat,
        variables: {
          id: this.deleteChat._id,
        },
      });
      this.isModalOpen = false;
    },
  },
});
</script>

<style scoped>
.root {
  background-color: #36393f;
}

.on-hover {
  background-color: #32353b;
  position: relative;
}

.icon-wrapper {
  height: 32px;
  width: 32px;
  background-color: #34373d;
  display: flex;
  text-align: center;
  justify-content: center;
}

.on-hover-icon {
  opacity: 0.8;
  cursor: pointer;
}

.menu {
  position: absolute;
  top: 0;
  right: 60px;
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

.edit-field {
  position: relative;
  width: 100%;
}

.text-field-bottom {
  font-size: 12px;
  color: hsla(0, 0%, 100%, 0.3);
  position: absolute;
  top: 75%;
  left: 0;
}

.cancel-or-save {
  color: #7289da;
  cursor: pointer;
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

.delete-title {
  padding: 16px;
  color: #fff;
  font-size: 16px;
  margin: 0;
  font-weight: 600;
}

.delete-message {
  margin: 0;
  padding: 0 16px;
  margin-bottom: 20px;
  font-size: 16px;
  color: #dcddde;
  line-height: 20px;
}

.v-card {
  padding: 0 8px 20px 16px;
}
</style>

<style>
.v-text-field__details {
  min-height: 0px m !important;
}
</style>
