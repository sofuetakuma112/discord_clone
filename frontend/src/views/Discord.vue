<template>
  <div class="root">
    <Header :greyBackGround="greyBackGround" :channel="currentChannelData" />
    <LeftSidebar
      :darkBackGround="darkBackGround"
      :allData="allData"
      @goServer="currentView = 1"
      @goHome="goHome"
    >
      <template v-slot:content>
        <template v-if="currentView === 1">
          <v-sheet
            color="grey lighten-5 mb-5"
            height="50"
            width="100%"
            :elevation="5"
            style="padding-left: 70px"
          >
            <v-row
              class="server-title-row"
              no-gutters
              justify="space-between"
              :style="darkBackGround"
            >
              <h3 class="server-title white--text pl-4">テストサーバー</h3>
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    :elevation="0"
                    color="#2f3136"
                    height="50"
                  >
                    <v-icon color="white" medium>mdi-plus</v-icon>
                  </v-btn>
                </template>
                <v-list class="pa-0">
                  <v-list-item @click="createCategoryModal = true">
                    <v-list-item-title>カテゴリーを新規作成</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-row>
          </v-sheet>

          <v-expansion-panels
            focusable
            flat
            accordion
            multiple
            style="padding-left: 70px"
            shaped
          >
            <v-expansion-panel v-for="category in allData" :key="category._id">
              <v-expansion-panel-header
                class="px-4 grey--text"
                :style="darkBackGround"
                hide-actions
              >
                <span class="category-title">{{ category.name }}</span>
                <v-icon
                  color="grey"
                  medium
                  dense
                  @click.stop="openAddChannelModal(category._id)"
                  >mdi-plus</v-icon
                >
              </v-expansion-panel-header>
              <v-expansion-panel-content :style="darkBackGround">
                <v-list>
                  <v-list-item
                    v-for="channel in category.channels"
                    :key="channel._id"
                    link
                    @click="showChat(channel._id, true)"
                  >
                    <v-list-item-content>
                      <v-list-item-title class="grey--text"
                        ># {{ channel.name }}</v-list-item-title
                      >
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </template>
        <template v-if="currentView === 2">
          <v-sheet
            color="grey lighten-5 mb-5"
            height="50"
            width="100%"
            :elevation="5"
            style="padding-left: 70px"
          >
            <div class="participate-or-create-dm">
              <button type="text" class="participate-or-create-dm">
                会話に参加または作成する
              </button>
            </div>
          </v-sheet>

          <v-expansion-panels
            focusable
            flat
            accordion
            style="padding-left: 70px"
            shaped
          >
            <v-expansion-panel>
              <v-expansion-panel-header
                class="px-4 grey--text"
                :style="darkBackGround"
                hide-actions
              >
                <span class="category-title">ダイレクトメッセージ</span>
                <v-icon color="grey" medium dense>mdi-plus</v-icon>
              </v-expansion-panel-header>
              <v-expansion-panel-content :style="darkBackGround">
                <v-list>
                  <v-list-item
                    v-for="dm in dms"
                    :key="dm._id"
                    link
                    @click="showChat(dm._id, false)"
                  >
                    <v-row
                      v-for="user in usersExcludingMyself(dm.users)"
                      :key="user._id"
                      class="d-flex"
                      no-gutters
                    >
                      <v-col class="pa-0" cols="3">
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
                            <img
                              src="../assets/anonymous.png"
                              class="avatar-img"
                            />
                          </template>
                        </v-list-item-avatar>
                      </v-col>

                      <v-col class="pa-0">
                        <div class="dm-list-user-name">
                          <v-list-item-content>
                            <v-list-item-title class="grey--text">
                              {{ user.name }}
                            </v-list-item-title>
                          </v-list-item-content>
                        </div>
                      </v-col>
                    </v-row>
                  </v-list-item>
                </v-list>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </template>
      </template>
    </LeftSidebar>
    <RightSidebar
      :darkBackGround="darkBackGround"
      :users="users"
      v-if="currentView === 1"
      @submitDM="submitDM"
    />
    <Chat
      :greyBackGround="greyBackGround"
      :chats="chats"
      @openImageModal="openImageModal"
      ref="chatInstance"
    />
    <Footer
      @send="send"
      @imageFileSelectedInChatForm="imageFileSelectedInChatForm"
      :isShowAnyChannel="selectedChannelOrDmID.length !== 0"
      v-model="chatInput"
    />
    <!-- <Card /> -->
    <ImageModal :image="currentOpeningModalImageData" v-model="imageModal" />
    <Modal
      v-model="uploadImageModal"
      :greyBackGround="greyBackGround"
      @clickedModalOKButton="uploadImage"
      :width="530"
    >
      <template v-slot:content>
        <img :src="currentImageFile.imageData" alt="" class="upload-img" />
        <p class="img-name">
          {{ currentImageFile.imageTitle }}
        </p>
        <div class="px-4">
          <span class="text-field-name">コメント追加(任意)</span>
          <v-text-field
            solo
            v-model="comment"
            background-color="#40444C"
            flat
          ></v-text-field>
        </div>
      </template>
      <template v-slot:create-button-text>アップロード</template>
    </Modal>
    <Modal
      v-model="createChannelModal"
      :greyBackGround="greyBackGround"
      @clickedModalOKButton="createChannel"
    >
      <template v-slot:content>
        <v-card-title class="pt-5">
          <h3 class="modal-title">
            テキストチャンネルを作成
          </h3>
          <p class="modal-text">
            <slot name="title-text">テキストチャンネル内</slot>
          </p>
        </v-card-title>
        <div class="px-4">
          <span class="text-field-name">チャンネル名</span>
          <v-text-field
            label="Solo"
            solo
            v-model="channelNameInput"
          ></v-text-field>
        </div>
      </template>
      <template v-slot:create-button-text>チャンネルを作成</template>
    </Modal>
    <Modal
      v-model="createCategoryModal"
      :greyBackGround="greyBackGround"
      :categoryId="selectedCategoryId"
      @clickedModalOKButton="createCategory"
    >
      <template v-slot:content>
        <v-card-title class="pt-5">
          <h3 class="modal-title">
            カテゴリーを作成
          </h3>
        </v-card-title>
        <div class="px-4">
          <span class="text-field-name">カテゴリー名</span>
          <v-text-field
            label="Solo"
            solo
            v-model="categoryNameInput"
          ></v-text-field>
        </div>
      </template>
      <template v-slot:create-button-text>カテゴリーを作成</template>
    </Modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Header from '@/components/Header.vue';
import RightSidebar from '@/components/RightSideBar.vue';
import LeftSidebar from '@/components/LeftSideBar.vue';
import Chat from '@/components/Chat.vue';
import Footer from '@/components/Footer.vue';
import Modal from '@/components/Modal.vue';
import ImageModal from '@/components/ImageModal.vue';
// import Card from '@/components/Card.vue';
import * as queries from '@/graphql/query';
import * as mutations from '@/graphql/mutation';
// import { io, Socket } from 'socket.io-client';
import * as types from '@/types/index';

type DataType = {
  darkBackGround: types.BackgroundStyle;
  greyBackGround: types.BackgroundStyle;
  channel: types.Channel;
  chats: types.Chat[];
  categories: types.Category[];
  createChannelModal: boolean;
  createCategoryModal: boolean;
  uploadImageModal: boolean;
  imageModal: boolean;
  selectedCategoryId: string;
  selectedChannelOrDmID: string;
  users: types.User[];
  chatInput: string;
  channelNameInput: string;
  categoryNameInput: string;
  imageFiles: Image[];
  currentImageFile: Image | undefined;
  comment: string;
  currentOpeningModalImageData: string;
  allData: any;
  currentView: number;
  dms: any;
  isOpeningChannelChatNow: boolean;
};

type Image = {
  index: number;
  imageData: string;
  imageTitle: string;
};

export default Vue.extend({
  components: {
    Header,
    RightSidebar,
    LeftSidebar,
    Chat,
    Footer,
    Modal,
    ImageModal,
    // Card,
  },
  data(): DataType {
    return {
      darkBackGround: {
        background: '#2F3136',
      },
      greyBackGround: {
        background: '#36393f',
      },
      channel: {
        name: '',
        _id: '',
        categoryId: '',
      },
      chats: [],
      categories: [],
      users: [],
      dms: [],
      createChannelModal: false,
      createCategoryModal: false,
      uploadImageModal: false,
      imageModal: false,
      selectedCategoryId: '',
      selectedChannelOrDmID: '',
      chatInput: '',
      imageFiles: [],
      currentImageFile: {
        index: 0,
        imageData: '',
        imageTitle: '',
      },
      comment: '',
      channelNameInput: '',
      categoryNameInput: '',
      currentOpeningModalImageData: '',
      allData: [],
      currentView: 1,
      isOpeningChannelChatNow: false,
    };
  },
  props: {
    socket: Object,
  },
  computed: {
    refs(): any {
      return this.$refs;
    },
    user(): types.User {
      return this.$store.getters.getUser;
    },
    currentChannelData(): any {
      for (const category of this.allData) {
        const channel = category.channels.find((channel: types.Channel) => {
          return channel._id === this.selectedChannelOrDmID;
        });
        if (channel) return channel;
      }
      return {};
    },
  },
  async created() {
    if (!Object.keys(this.user).length) this.$router.push({ name: 'Login' });
    this.socket.on('latestUsers', (response: any) => {
      const parsedData = JSON.parse(response);
      this.users = [];
      this.users = parsedData.data.users;
    });
    this.socket.on('latestCategories', (response: any) => {
      const parsedData = JSON.parse(response);
      this.categories = [];
      this.categories = parsedData.data.categories;
    });
    this.socket.on('latestData', (response: any) => {
      const parsedData = JSON.parse(response);
      this.allData = [];
      this.allData = parsedData.data.categories;
      for (const category of this.allData) {
        const selectedChannelNewData = category.channels.find(
          (channel: any) => channel._id === this.selectedChannelOrDmID
        );
        if (selectedChannelNewData !== undefined) {
          this.chats = [];
          this.chats = selectedChannelNewData.chats;
          break;
        }
      }
    });
    this.socket.on('latestDMs', (response: any) => {
      const parsedData = JSON.parse(response);
      this.dms = parsedData.data.dms;
      const selectedNewDmData = this.dms.find(
        (dm: any) => dm._id === this.selectedChannelOrDmID
      );
      if (selectedNewDmData !== undefined) {
        this.chats = [];
        this.chats = selectedNewDmData.chats;
      }
    });

    const allDm = await this.$apollo.query({
      query: queries.dmsQuery,
    });
    this.dms = allDm.data.dms;

    const allData = await this.$apollo.query({
      query: queries.allQuery,
    });
    this.allData = allData.data.categories;

    // userデータの取得
    const response = await this.$apollo.query(queries.usersQuery);
    this.users = response.data.users;

    // const allQueries = await this.$apollo.query(
    //   queries.getQueryFields,
    // );
    // console.log(allQueries)
  },
  watch: {
    $route(to) {
      if (to.name === 'Discord' && !this.$store.getters.getUser) {
        this.$router.push({ name: 'Login' });
      }
    },
  },
  methods: {
    usersExcludingMyself(users: types.User[]) {
      const filteredUsers = users.filter((user) => {
        return user._id !== this.user._id;
      });
      return filteredUsers;
    },
    goHome() {
      this.currentView = 2;
    },
    async submitDM(messageData: any) {
      await this.$apollo.mutate({
        mutation: mutations.startDm,
        variables: {
          name: messageData.from.name,
          message: messageData.message,
          imageData: '',
          imageTitle: '',
          userIds: [messageData.from._id, messageData.to._id],
          fromUserId: messageData.from._id,
          toUserId: messageData.to._id,
        },
      });
      this.currentView = 2;
    },
    openImageModal(imageData: string) {
      this.imageModal = true;
      this.currentOpeningModalImageData = imageData;
    },
    imageFileSelectedInChatForm(imageFiles: Image[]) {
      this.imageFiles = imageFiles;
      if (this.imageFiles.length !== 0) {
        this.currentImageFile = this.imageFiles.shift();
        this.uploadImageModal = true;
      }
    },
    async uploadImage() {
      this.uploadImageModal = false;
      if (
        this.currentImageFile &&
        this.currentImageFile.imageData &&
        this.currentImageFile.imageData
      ) {
        // 送信処理
        await this.$apollo.mutate({
          mutation: mutations.sendMessageMutation,
          variables: {
            name: this.user.name,
            message: this.comment,
            imageData: this.currentImageFile.imageData,
            imageTitle: this.currentImageFile.imageTitle,
            parentId: this.selectedChannelOrDmID,
            userId: this.user._id,
            isOpeningChannelChatNow: this.isOpeningChannelChatNow,
          },
        });
        if (this.imageFiles.length !== 0) {
          this.currentImageFile = this.imageFiles.shift();
          this.uploadImageModal = true;
          return;
        }
      }
    },
    async showChat(channelOrDmId: string, isSearchInChannel: boolean) {
      this.isOpeningChannelChatNow = isSearchInChannel;
      // 同じparentIdのものをクリックした場合、何もしない
      if (this.selectedChannelOrDmID === channelOrDmId) return;
      this.selectedChannelOrDmID = channelOrDmId;
      if (isSearchInChannel) {
        // チャンネル内を検索
        for (const category of this.allData) {
          const selectedChannel = category.channels.find(
            (channel: types.Channel) => channel._id === channelOrDmId
          );
          if (selectedChannel) {
            this.chats = selectedChannel.chats;
            break;
          }
        }
      } else {
        // DM内を検索
        this.chats = this.dms.find((dm: any) => dm._id === channelOrDmId).chats;
      }
      this.refs.chatInstance.scrollBottom();
    },
    async send() {
      await this.$apollo.mutate({
        mutation: mutations.sendMessageMutation,
        variables: {
          name: this.user.name,
          message: this.chatInput,
          imageData: '',
          imageTitle: '',
          parentId: this.selectedChannelOrDmID,
          userId: this.user._id,
          isOpeningChannelChatNow: this.isOpeningChannelChatNow,
        },
      });
      this.chatInput = '';
      this.refs.chatInstance.scrollBottom();
    },
    async createChannel() {
      await this.$apollo.mutate({
        mutation: mutations.createNewChannel,
        variables: {
          name: this.channelNameInput,
          categoryId: this.selectedCategoryId,
        },
      });
    },
    async createCategory() {
      await this.$apollo.mutate({
        mutation: mutations.createNewCategory,
        variables: {
          name: this.categoryNameInput,
        },
      });
    },
    openAddChannelModal(categoryId: string) {
      this.createChannelModal = true;
      this.selectedCategoryId = categoryId;
    },
    toBoolean(booleanStr: string): boolean {
      return booleanStr.toLowerCase() === 'true';
    },
  },
});
</script>

<style scoped>
.root {
  height: 100%;
}

.avatar-img {
  width: 32px;
  height: 32px;
}

.dm-list-user-name {
  display: flex;
  align-items: center;
  height: 100%;
}

.chat {
  overflow-y: scroll;
  max-height: 90vh;
  background: #36393f;
}

.modal-title {
  text-align: center;
  width: 100%;
  color: #fff;
}

.modal-text {
  text-align: center;
  width: 100%;
  font-size: 12px;
  color: #dcddde;
}

.text-field-name {
  font-size: 12px;
  color: #dcddde;
}

.text-subtitle {
  text-align: center;
  color: #b9bbbe;
  font-size: 12px;
  line-height: 16px;
}

.img-name {
  margin: 0;
  padding: 100px 16px 20px;
  margin-bottom: 20px;
}

.upload-img {
  max-height: 105px;
  height: 100%;
  position: absolute;
  transform: translate(-50%, -50%);
  top: 35px;
  left: 70px;
}

.img-name {
  font-size: 20px;
  font-weight: 700;
  height: 22px;
  white-space: nowrap;
  color: #fff;
}

.category-title {
  width: 100%;
}

.server-title {
  height: 100%;
  line-height: 50px;
}

.server-title-row {
  background: #2f3136;
}

.participate-or-create-dm {
  background-color: #2f3136;
  z-index: 2;
  -webkit-box-flex: 0;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  padding: 0 10px;
  height: 100%;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-shadow: 0 1px 0 rgba(4, 4, 5, 0.2), 0 1.5px 0 rgba(6, 6, 7, 0.05),
    0 2px 0 rgba(4, 4, 5, 0.05);
  box-shadow: 0 1px 0 rgba(4, 4, 5, 0.2), 0 1.5px 0 rgba(6, 6, 7, 0.05),
    0 2px 0 rgba(4, 4, 5, 0.05);
  display: flex;
  align-items: center;
}

.participate-or-create-dm button {
  width: 100%;
  height: 28px;
  overflow: hidden;
  border-radius: 4px;
  background-color: #202225;
  -webkit-box-shadow: none;
  box-shadow: none;
  color: #72767d;
  text-align: left;
  text-overflow: ellipsis;
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
  white-space: nowrap;
}
</style>

<style>
::-webkit-scrollbar {
  width: 6px;
}

/*スクロールバーの軌道*/
::-webkit-scrollbar-track {
  border-radius: 10px;
  box-shadow: inset 0 0 6px #202225;
}

/*スクロールバーの動く部分*/
::-webkit-scrollbar-thumb {
  background-color: #202225;
  border-radius: 10px;
}
</style>
