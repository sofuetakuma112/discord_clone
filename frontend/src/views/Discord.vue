<template>
  <div class="root">
    <Header :greyBackGround="greyBackGround" :channel="channel" />
    <LeftSidebar
      :darkBackGround="darkBackGround"
      :allData="allData"
      @showChat="showChat"
      @openAddChannelModal="openAddChannelModal"
      @openCreateCategoryModal="createCategoryModal = true"
    />
    <RightSidebar :darkBackGround="darkBackGround" :users="users" />
    <Chat
      :greyBackGround="greyBackGround"
      :chats="chats"
      @openImageModal="openImageModal"
      ref="chatInstance"
    />
    <Footer
      @send="send"
      @imageFileSelectedInChatForm="imageFileSelectedInChatForm"
      :isShowAnyChannel="selectedChannelId.length !== 0"
      v-model="chatInput"
    />
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
  selectedChannelId: string;
  users: types.User[];
  chatInput: string;
  channelNameInput: string;
  categoryNameInput: string;
  imageFiles: Image[];
  currentImageFile: Image | undefined;
  comment: string;
  currentOpeningModalImageData: string;
  allData: any;
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
      createChannelModal: false,
      createCategoryModal: false,
      uploadImageModal: false,
      imageModal: false,
      selectedCategoryId: '',
      selectedChannelId: '',
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
  },
  async created() {
    if (!Object.keys(this.user).length) this.$router.push({ name: 'Login' });
    this.socket.on('latestUsers', (response: any) => {
      const parsedData = JSON.parse(response);
      console.log(parsedData);
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
          (channel: any) => channel._id === this.selectedChannelId
        );
        if (selectedChannelNewData !== undefined) {
          this.chats = [];
          this.chats = selectedChannelNewData.chats.map((chat: types.Chat) => ({
            ...chat,
            created: this.formDate(new Date(Number(chat.created))),
          }));
          break;
        }
      }
    });

    const allData = await this.$apollo.query({
      query: queries.allQuery,
    });
    this.allData = allData.data.categories;

    // userデータの取得
    const response = await this.$apollo.query(queries.usersQuery);
    console.log(response.data);
    this.users = response.data.users;

    // try {
    //   const response = await this.$apollo.query(queries.categoriesQuery);
    //   this.categories = response.data.categories;
    // } catch (error) {
    //   console.log(error.message);
    // }
  },
  watch: {
    $route(to) {
      if (to.name === 'Discord' && !this.$store.getters.getUser) {
        this.$router.push({ name: 'Login' });
      }
    },
  },
  methods: {
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
            channelId: this.selectedChannelId,
            userId: this.user._id,
          },
        });
        if (this.imageFiles.length !== 0) {
          this.currentImageFile = this.imageFiles.shift();
          this.uploadImageModal = true;
          return;
        }
      }
    },
    async showChat(channelId: string) {
      if (this.selectedChannelId === channelId) return;
      this.selectedChannelId = channelId;
      for (const category of this.allData) {
        const selectedChannel = category.channels.find(
          (channel: types.Channel) => channel._id === channelId
        );
        if (selectedChannel) {
          this.chats = selectedChannel.chats.map((chat: types.Chat) => ({
            ...chat,
            created: this.formDate(new Date(Number(chat.created))),
          }));
          break;
        }
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
          channelId: this.selectedChannelId,
          userId: this.user._id,
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
    formDate(date: Date) {
      let format = 'YYYY-MM-DD hh:mm';
      format = format.replace(/YYYY/g, String(date.getFullYear()));
      format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
      format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
      format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
      format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
      return format;
    },
  },
});
</script>

<style scoped>
.root {
  height: 100%;
}

.chat {
  overflow-y: scroll;
  max-height: 90vh;
  background: #36393f;
}

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
</style>
