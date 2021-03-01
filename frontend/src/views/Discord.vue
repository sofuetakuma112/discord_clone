<template>
  <div class="root">
    <Header :greyBackGround="greyBackGround" :channel="currentChannelData" />
    <LeftSidebar
      :darkBackGround="darkBackGround"
      :allData="allData"
      @goServer="currentView = 1"
      @goHome="goHome"
      @hangUp="hangUp"
      :currentVoiceChannelId="currentVoiceChannelId"
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
                  <template v-for="channel in category.channels">
                    <v-list-item
                      v-if="channel.type === '1'"
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
                    <div v-else :key="channel._id">
                      <v-list-item link @click="connectVoiceChannel(channel)">
                        <v-list-item-content>
                          <v-list-item-title class="grey--text"
                            ><v-icon color="#72767d" dense small class="pr-2"
                              >fas fa-volume-up</v-icon
                            >
                            {{ channel.name }}</v-list-item-title
                          >
                        </v-list-item-content>
                      </v-list-item>
                      <v-list class="py-0 pl-5" dense>
                        <v-list-item
                          v-for="user in channel.connectingUsers"
                          :key="user._id"
                        >
                          <v-list-item-avatar size="24">
                            <img :src="user.imageConvertedToBase64" alt="" />
                          </v-list-item-avatar>
                          <v-list-item-content>
                            <v-list-item-title class="grey--text">{{
                              user.name
                            }}</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </div>
                  </template>
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
                    <template
                      v-if="usersExcludingMyself(dm.users).length === 1"
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
                    </template>
                    <template v-else>
                      <v-row class="d-flex" no-gutters>
                        <v-col class="pa-0" cols="3">
                          <v-list-item-avatar class="mr-2">
                            <v-icon>fas fa-users</v-icon>
                          </v-list-item-avatar>
                        </v-col>
                        <v-col class="pa-0">
                          <div class="dm-list-user-name">
                            <v-list-item-content>
                              <v-list-item-title class="grey--text">
                                {{
                                  usersExcludingMyself(dm.users).length
                                }}人のメンバー
                              </v-list-item-title>
                            </v-list-item-content>
                          </div>
                        </v-col>
                      </v-row>
                    </template>
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
    <!-- <div class="video-chat">
      <input
        type="checkbox"
        id="checkbox_camera"
        v-model="cameraCheckBoxState"
        @change="onclickCheckbox_CameraMicrophone"
      />Camera
      <input
        type="checkbox"
        id="checkbox_microphone"
        v-model="audioCheckBoxState"
        @change="onclickCheckbox_CameraMicrophone"
      />Microphone
      <br />
      <video
        id="video_local"
        width="320"
        height="240"
        style="border: 1px solid black;"
        autoplay
        :srcObject.prop="localStream"
      ></video>
      <video
        id="video_remote"
        style="width: 320px; height: 240px; border: 1px solid black;"
        autoplay
        :srcObject.prop="remoteStreamForVideo"
      ></video
      ><audio
        id="audio_remote"
        :srcObject.prop="remoteStreamForAudio"
        autoplay
      ></audio>
      <v-btn @click="onclickButton_SendOfferSDP">Send OfferSDP.</v-btn>
    </div> -->
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
  localStream: MediaStream | null;
  remoteStreamForVideo: MediaStream | null;
  remoteStreamForAudio: MediaStream | null;
  isMuteVideo: boolean;
  isMuteAudio: boolean;
  peerConnections: any;
  cameraCheckBoxState: boolean;
  audioCheckBoxState: false;
  rtcPeerConnection: any;
  currentVoiceChannelId: string;
};

type Image = {
  index: number;
  imageData: string;
  imageTitle: string;
};

type sdpDataAndType = {
  type: string;
  data: any;
};

const config = { iceServers: [] };

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
      localStream: null,
      remoteStreamForVideo: null,
      remoteStreamForAudio: null,
      cameraCheckBoxState: false,
      audioCheckBoxState: false,
      rtcPeerConnection: new RTCPeerConnection(config),
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
    this.$socket.on('signaling', (objData: sdpDataAndType) => {
      console.log('Socket Event : signaling');
      console.log('- type : ', objData.type);
      console.log('- data : ', objData.data);

      // OfferSDPをリモートへ、作成したAnswerSDPをローカルへセット
      if ('offer' === objData.type) {
        // onclickButton_SetOfferSDPandCreateAnswerSDP()と同様の処理

        // RTCPeerConnectionオブジェクトの作成
        console.log('Call : createPeerConnection()');
        this.createPeerConnection();

        // OfferSDPの設定とAnswerSDPの作成
        console.log('Call : setOfferSDP_and_createAnswerSDP()');
        // 受信したOfferSDPオブジェクトを渡す。
        this.setOfferSDP_and_createAnswerSDP(objData.data);

        // AnserSDPをリモートへセットする
      } else if ('answer' === objData.type) {
        // onclickButton_SetAnswerSDPthenChatStarts()と同様の処理
        // 設定するAnswerSDPとして、テキストエリアのデータではなく、受信したデータを使用する。

        if (!this.rtcPeerConnection) {
          // コネクションオブジェクトがない
          console.log(
            '\u001b[31m' + 'Connection object does not exist.' + '\u001b[0m'
          );
          return;
        }

        // AnswerSDPの設定
        console.log('Call : setAnswerSDP()');
        this.setAnswerSDP(objData.data); // 受信したSDPオブジェクトを渡す。
      } else {
        console.error('Unexpected : Socket Event : signaling');
      }
    });

    // this.$socket.on('disconnect', () => {
    //   if (this.currentVoiceChannelId.length !== 0) {
    //     this.hangUp()
    //   }
    // });

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
    // 選択したデバイス or 既定のデバイスを元にMediaStreamを作成
    async connectLocalCamera() {
      const constraints = {
        audio: this.selectedAudio
          ? { deviceId: { exact: this.selectedAudio } }
          : true,
        video: this.selectedVideo
          ? { deviceId: { exact: this.selectedVideo } }
          : true,
      };

      await navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          this.localStream = stream;
        })
        .catch((error) => {
          console.error('mediaDevice.getUserMedia() error:', error);
        });
    },
    muteAudio() {
      if (!this.localStream) return;
      this.localStream.getAudioTracks()[0].enabled = !this.isMuteAudio;
      this.isMuteAudio = !this.isMuteAudio;
    },
    muteVideo() {
      if (!this.localStream) return;
      if (this.isMuteVideo) {
        // Mute
        this.localStream.getVideoTracks()[0].stop();
        this.localStream.removeTrack(this.localStream.getVideoTracks()[0]);
        // document.getElementById('my-video').srcObject = null;
      } else {
        // Re-connect
        this.connectLocalCamera();
      }
      this.isMuteVideo = !this.isMuteVideo;
    },
    connectVoiceChannel(channel: types.Channel) {
      if (
        !channel.connectingUserIds.some((userId) => userId === this.user._id)
      ) {
        this.currentVoiceChannelId = channel._id;
        console.log(channel._id, 'connected!');
        this.$socket.emit('connectVoiceChannel', {
          userId: this.user._id,
          channelId: this.currentVoiceChannelId,
        });
        this.$apollo.mutate({
          mutation: mutations.updateChannel,
          variables: {
            name: channel.name,
            type: channel.type,
            channelId: channel._id,
            userId: this.user._id,
          },
        });
      }
    },
    findUserFromUsers(userId: string) {
      return this.users.find((userData) => userData._id === userId);
    },
    onclickCheckbox_CameraMicrophone() {
      console.log('UI Event : Camera/Microphone checkbox clicked.');

      // これまでの状態
      let trackCamera_old = null;
      let trackMicrophone_old = null;
      let bCamera_old = false;
      let bMicrophone_old = false;
      if (this.localStream) {
        trackCamera_old = this.localStream.getVideoTracks()[0];
        if (trackCamera_old) {
          bCamera_old = true;
        }
        trackMicrophone_old = this.localStream.getAudioTracks()[0];
        if (trackMicrophone_old) {
          bMicrophone_old = true;
        }
      }

      // 今後の状態
      let bCamera_new = false;
      if (this.cameraCheckBoxState) {
        bCamera_new = true;
      }
      let bMicrophone_new = false;
      if (this.audioCheckBoxState) {
        bMicrophone_new = true;
      }

      // 状態変化
      console.log('Camera :  %s => %s', bCamera_old, bCamera_new);
      console.log('Microphoneo : %s = %s', bMicrophone_old, bMicrophone_new);

      if (bCamera_old === bCamera_new && bMicrophone_old === bMicrophone_new) {
        // チェックボックスの状態の変化なし
        return;
      }

      // 古いメディアストリームのトラックの停止（トラックの停止をせず、HTML要素のstreamの解除だけではカメラは停止しない（カメラ動作LEDは点いたまま））
      if (trackCamera_old) {
        console.log('Call : trackCamera_old.stop()');
        trackCamera_old.stop();
      }
      if (trackMicrophone_old) {
        console.log('Call : trackMicrophone_old.stop()');
        trackMicrophone_old.stop();
      }
      // HTML要素のメディアストリームの解除
      this.localStream = null;

      if (!bCamera_new && !bMicrophone_new) {
        // （チェックボックスの状態の変化があり、かつ、）カメラとマイクを両方Offの場合
        return;
      }

      // （チェックボックスの状態の変化があり、かつ、）カメラとマイクのどちらかもしくはどちらもOnの場合

      // 自分のメディアストリームを取得する。
      // - 古くは、navigator.getUserMedia() を使用していたが、廃止された。
      //   現在は、navigator.mediaDevices.getUserMedia() が新たに用意され、これを使用する。
      console.log(
        'Call : navigator.mediaDevices.getUserMedia( video=%s, audio=%s )',
        bCamera_new,
        bMicrophone_new
      );
      navigator.mediaDevices
        .getUserMedia({ video: bCamera_new, audio: bMicrophone_new })
        .then((stream: MediaStream) => {
          // HTML要素へのメディアストリームの設定
          this.localStream = stream;
        })
        .catch((error: Error) => {
          // メディアストリームの取得に失敗⇒古いメディアストリームのまま。チェックボックスの状態を戻す。
          console.error('Error : ', error);
          alert('Could not start Camera.');
          this.cameraCheckBoxState = false;
          this.audioCheckBoxState = false;
          return;
        });
    },
    createPeerConnection() {
      // RTCPeerConnectionオブジェクトの生成
      // const config = { iceServers: [] };
      // this.rtcPeerConnection = new RTCPeerConnection(config);
      // RTCPeerConnectionオブジェクトのイベントハンドラの構築
      this.setupRTCPeerConnectionEventHandler();

      // RTCPeerConnectionオブジェクトのストリームにローカルのメディアストリームを追加
      if (this.localStream) {
        this.localStream.getTracks().forEach((track: any) => {
          this.rtcPeerConnection.addTrack(track, this.localStream);
        });
      } else {
        console.log('\u001b[31m' + 'No local stream.' + '\u001b[0m');
      }
    },
    setupRTCPeerConnectionEventHandler() {
      this.rtcPeerConnection.onnegotiationneeded = () => {
        console.log('Event : Negotiation needed');
      };

      this.rtcPeerConnection.onicecandidate = (event: any) => {
        // console.log('Event : ICE candidate');
        if (event.candidate) {
          // ICE candidateがある
          // console.log('- ICE candidate : ', event.candidate);
        } else {
          console.log('- ICE candidate : empty');
        }
      };

      this.rtcPeerConnection.onicecandidateerror = (event: any) => {
        console.error(
          'Event : ICE candidate error. error code : ',
          event.errorCode
        );
      };

      // 収集の状態が変化したら実行されるハンドラ
      // 収集したICE candidateを保持するSDP
      this.rtcPeerConnection.onicegatheringstatechange = () => {
        console.log('Event : ICE gathering state change');
        console.log(
          '- ICE gathering state : ',
          this.rtcPeerConnection.iceGatheringState
        );

        if ('complete' === this.rtcPeerConnection.iceGatheringState) {
          // Vanilla ICEの場合は、ICE candidateを含んだOfferSDP/AnswerSDPを相手に送る
          // Trickle ICEの場合は、何もしない

          if ('offer' === this.rtcPeerConnection.localDescription.type) {
            // OfferSDPをサーバーに送信
            console.log('- Send OfferSDP to server');
            this.$socket.emit('signaling', {
              type: 'offer',
              data: this.rtcPeerConnection.localDescription,
            });
          } else if (
            'answer' === this.rtcPeerConnection.localDescription.type
          ) {
            // AnswerSDPをサーバーに送信
            console.log('- Send AnswerSDP to server');
            this.$socket.emit('signaling', {
              type: 'answer',
              data: this.rtcPeerConnection.localDescription,
            });
          } else {
            console.error(
              'Unexpected : Unknown localDescription.type. type = ',
              this.rtcPeerConnection.localDescription.type
            );
          }
        }
      };

      this.rtcPeerConnection.oniceconnectionstatechange = () => {
        console.log('Event : ICE connection state change');
        console.log(
          '- ICE connection state : ',
          this.rtcPeerConnection.iceConnectionState
        );
      };

      this.rtcPeerConnection.onsignalingstatechange = () => {
        console.log('Event : Signaling state change');
        console.log(
          '- Signaling state : ',
          this.rtcPeerConnection.signalingState
        );
      };

      this.rtcPeerConnection.onconnectionstatechange = () => {
        console.log('Event : Connection state change');
        console.log(
          '- Connection state : ',
          this.rtcPeerConnection.connectionState
        );
      };

      // - このイベントは、新しい着信MediaStreamTrackが作成され、
      //   コネクション上のレシーバーセットに追加されたRTCRtpReceiverオブジェクトに関連付けられたときに送信される。
      // 接続相手がRTCPeerConnectionのトラックにストリームを追加すると発行されるイベント
      // 引数のイベントには通信相手のストリームが入っている
      this.rtcPeerConnection.ontrack = (event: any) => {
        console.log('Event : Track');
        console.log('- stream', event.streams[0]);
        console.log('- track', event.track);

        // HTML要素へのリモートメディアストリームの設定
        const stream = event.streams[0];
        const track = event.track;
        if ('video' === track.kind) {
          this.remoteStreamForVideo = stream;
        } else if ('audio' === track.kind) {
          this.remoteStreamForAudio = stream;
        } else {
          console.error('Unexpected : Unknown track kind : ', track.kind);
        }
      };
    },
    createOfferSDP() {
      // OfferSDPの作成
      console.log('Call : rtcPeerConnection.createOffer()');
      this.rtcPeerConnection
        .createOffer()
        .then((sessionDescription: any) => {
          // 作成されたOfferSDPををLocalDescriptionに設定
          console.log('Call : rtcPeerConnection.setLocalDescription()');
          return this.rtcPeerConnection.setLocalDescription(sessionDescription);
        })
        .then(() => {
          // Vanilla ICEの場合は、まだSDPを相手に送らない
          // Trickle ICEの場合は、初期SDPを相手に送る
        })
        .catch((error: Error) => {
          console.error('Error : ', error);
        });
    },
    setOfferSDP_and_createAnswerSDP(sessionDescription: any) {
      console.log('Call : rtcPeerConnection.setRemoteDescription()');
      this.rtcPeerConnection
        .setRemoteDescription(sessionDescription)
        .then(() => {
          // AnswerSDPの作成
          console.log('Call : rtcPeerConnection.createAnswer()');
          // このタイミングでICE candidateの収集が始まる
          return this.rtcPeerConnection.createAnswer();
        })
        .then((sessionDescription: any) => {
          // 作成されたAnswerSDPををLocalDescriptionに設定
          console.log('Call : rtcPeerConnection.setLocalDescription()');
          return this.rtcPeerConnection.setLocalDescription(sessionDescription);
        })
        .then(() => {
          // Vanilla ICEの場合は、まだSDPを相手に送らない
          // Trickle ICEの場合は、初期SDPを相手に送る
        })
        .catch((error: Error) => {
          console.error('Error : ', error);
        });
    },
    setAnswerSDP(sessionDescription: any) {
      console.log(this.rtcPeerConnection);
      // offerした側でanswerSDPをリモートにセットする
      this.rtcPeerConnection
        .setRemoteDescription(sessionDescription)
        .catch((error: Error) => {
          console.error('Error : ', error);
        });
    },
    onclickButton_SendOfferSDP() {
      console.log("UI Event : 'Send OfferSDP.' button clicked.");

      // if (this.rtcPeerConnection) {
      //   // 既にコネクションオブジェクトあり
      //   alert('Connection object already exists.');
      //   return;
      // }

      // RTCPeerConnectionオブジェクトの作成
      console.log('Call : createPeerConnection()');
      this.createPeerConnection();

      // OfferSDPの作成
      this.createOfferSDP();
    },
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
    hangUp() {
      this.$apollo.mutate({
        mutation: mutations.deleteUserFromVoiceChannel,
        variables: {
          channelId: this.currentVoiceChannelId,
          userId: this.user._id,
        },
      });
      this.currentVoiceChannelId = '';
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

.video-chat {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 10;
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
