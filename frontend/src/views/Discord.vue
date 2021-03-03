<template>
  <div class="root">
    <Header :greyBackGround="greyBackGround" :channel="currentChannelData" />
    <LeftSidebar
      v-model="currentVoiceChannelId"
      :darkBackGround="darkBackGround"
      :allData="allData"
      :currentView="currentView"
      :dms="dms"
      @goServer="currentView = 1"
      @goHome="goHome"
    >
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
          <span class="text-field-name">チャンネルの種類</span>
          <v-radio-group v-model="radios" mandatory>
            <v-radio label="テキストチャンネル" value="1"></v-radio>
            <v-radio label="ボイスチャンネル" value="2"></v-radio>
          </v-radio-group>
        </div>
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
  radios: string;
  videoDeviceLists: types.Device[];
  audioDeviceLists: types.Device[];
  selectedAudio: string;
  selectedVideo: string;
  isMuteVideo: boolean;
  isMuteAudio: boolean;
  peerConnections: any;
  cameraCheckBoxState: boolean;
  audioCheckBoxState: false;
  currentVoiceChannelId: string;
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
        connectingUserIds: [],
        type: '',
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
      radios: '1',
      audioDeviceLists: [],
      videoDeviceLists: [],
      selectedAudio: '',
      selectedVideo: '',
      isMuteAudio: false,
      isMuteVideo: false,
      peerConnections: {},
      cameraCheckBoxState: false,
      audioCheckBoxState: false,
      currentVoiceChannelId: '',
    };
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
    this.$socket.on('latestUsers', (response: any) => {
      const parsedData = JSON.parse(response);
      this.users = [];
      this.users = parsedData.data.users;
    });
    this.$socket.on('latestCategories', (response: any) => {
      const parsedData = JSON.parse(response);
      this.categories = [];
      this.categories = parsedData.data.categories;
    });
    this.$socket.on('latestData', (response: any) => {
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
    this.$socket.on('latestDMs', (response: any) => {
      const parsedData = JSON.parse(response);
      this.dms = parsedData.data.dms.filter((dm: any) =>
        dm.userIds.some((userId: string) => userId === this.user._id)
      );
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
    this.dms = allDm.data.dms.filter((dm: any) =>
      dm.userIds.some((userId: string) => userId === this.user._id)
    );

    const allData = await this.$apollo.query({
      query: queries.allQuery,
    });
    this.allData = allData.data.categories;

    // userデータの取得
    const response = await this.$apollo.query(queries.usersQuery);
    this.users = response.data.users;

    this.getLocalDevices();
  },
  watch: {
    $route(to) {
      if (to.name === 'Discord' && !this.$store.getters.getUser) {
        this.$router.push({ name: 'Login' });
      }
    },
  },
  methods: {
    // デバイス一覧を取得
    async getLocalDevices() {
      await navigator.mediaDevices.enumerateDevices().then((deviceInfos) => {
        const audios = [{ text: '指定なし', value: '' }];
        const videos = [{ text: '指定なし', value: '' }];
        for (let i = 0; i < deviceInfos.length; i++) {
          const deviceInfo = deviceInfos[i];
          if (deviceInfo.kind === 'audioinput') {
            audios.push({
              text: deviceInfo.label || `Microphone ${audios.length + 1}`,
              value: deviceInfo.deviceId,
            });
          } else if (deviceInfo.kind === 'videoinput') {
            videos.push({
              text: deviceInfo.label || `Camera  ${videos.length + 1}`,
              value: deviceInfo.deviceId,
            });
          }
        }
        this.audioDeviceLists = audios;
        this.videoDeviceLists = videos;
      });
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
          type: this.radios,
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

.video {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 50;
  background-color: #fff;
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
