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
                    <v-list-item
                      v-else
                      :key="channel._id"
                      link
                      @click="connectVoiceChannel(channel._id)"
                    >
                      <v-list-item-content>
                        <v-list-item-title class="grey--text">{{
                          channel.name
                        }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
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
    <video autoplay :srcObject.prop="localStream"></video>
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
  radios: string;
  videoDeviceLists: types.Device[];
  audioDeviceLists: types.Device[];
  selectedAudio: string;
  selectedVideo: string;
  localStream: MediaStream | null;
  isMuteVideo: boolean;
  isMuteAudio: boolean;
  globalRtcPeerConnection: any;
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
      radios: '1',
      audioDeviceLists: [],
      videoDeviceLists: [],
      selectedAudio: '',
      selectedVideo: '',
      localStream: null,
      isMuteAudio: false,
      isMuteVideo: false,
      globalRtcPeerConnection: null,
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

    this.socket.on('signaling', (objData: sdpDataAndType) => {
      console.log('Socket Event : signaling');
      console.log('- type : ', objData.type);
      console.log('- data : ', objData.data);

      if ('offer' === objData.type) {
        // onclickButton_SetOfferSDPandCreateAnswerSDP()と同様の処理
        // 設定するOffserSDPとして、テキストエリアのデータではなく、受信したデータを使用する。

        if (this.globalRtcPeerConnection) {
          // 既にコネクションオブジェクトあり
          alert('Connection object already exists.');
          return;
        }

        // RTCPeerConnectionオブジェクトの作成
        const rtcPeerConnection = this.createPeerConnection(
          this.localStream as MediaStream
        );
        this.globalRtcPeerConnection = rtcPeerConnection; // グローバル変数に設定

        // OfferSDPの設定とAnswerSDPの作成
        this.setOfferSDPAndCreateAnswerSDP(rtcPeerConnection, objData.data); // 受信したSDPオブジェクトを渡す。
      } else if ('answer' === objData.type) {
        // onclickButton_SetAnswerSDPthenChatStarts()と同様の処理
        // 設定するAnswerSDPとして、テキストエリアのデータではなく、受信したデータを使用する。

        if (!this.globalRtcPeerConnection) {
          // コネクションオブジェクトがない
          alert('Connection object does not exist.');
          return;
        }

        // AnswerSDPの設定
        console.log('Call : setAnswerSDP()');
        this.setAnswerSDP(this.globalRtcPeerConnection, objData.data); // 受信したSDPオブジェクトを渡す。
      } else if ('candidate' === objData.type) {
        if (!this.globalRtcPeerConnection) {
          // コネクションオブジェクトがない
          alert('Connection object does not exist.');
          return;
        }

        // Vanilla ICEの場合は、ここには来ない。
        // Trickle ICEの場合は、相手側のICE candidateイベントで送信されたICE candidateを、コネクションに追加する。

        // ICE candidateの追加
        this.addCandidate(this.globalRtcPeerConnection, objData.data);
      } else {
        console.error('Unexpected : Socket Event : signaling');
      }
    });
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
    getLocalDevices() {
      navigator.mediaDevices.enumerateDevices().then((deviceInfos) => {
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
    connectLocalCamera() {
      const constraints = {
        audio: this.selectedAudio
          ? { deviceId: { exact: this.selectedAudio } }
          : true,
        video: this.selectedVideo
          ? { deviceId: { exact: this.selectedVideo } }
          : true,
      };

      navigator.mediaDevices
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
    connectVoiceChannel(id: string) {
      console.log(id, 'connected!');

      // デバイス一覧、ストリームの取得 + videoタグにストリームをセット
      this.getLocalDevices();
      this.connectLocalCamera();

      if (!this.localStream) return;
      // RTCPeerConnectionオブジェクトの作成
      this.globalRtcPeerConnection = this.createPeerConnection(
        this.localStream
      );
      // DataChannelの作成
      const datachannel = this.globalRtcPeerConnection.createDataChannel(
        'my datachannel'
      );
      // DataChannelオブジェクトをRTCPeerConnectionオブジェクトのメンバーに追加。
      this.globalRtcPeerConnection.datachannel = datachannel;
      // DataChannelオブジェクトのイベントハンドラの構築
      this.setupDataChannelEventHandler(this.globalRtcPeerConnection);

      // OfferSDPの作成
      this.createOfferSDP(this.globalRtcPeerConnection);
    },
    setupDataChannelEventHandler(rtcPeerConnection: any) {
      if (!('datachannel' in rtcPeerConnection)) {
        console.error('DataChannelが無いよ');
        return;
      }

      // message イベントが発生したときのイベントハンドラ
      // socket.IOでSDPの交換等を行うのでここは使用しない
      rtcPeerConnection.datachannel.onmessage = (event: any) => {
        console.log('DataChannel Event : message');
        const objData = JSON.parse(event.data);
        console.log('- type : ', objData.type);
        console.log('- data : ', objData.data);

        // if ('message' === objData.type) {
        //   // 受信メッセージをメッセージテキストエリアへ追加
        //   let strMessage = objData.data;
        //   console.log(strMessage);
        // } else if ('offer' === objData.type) {
        //   // 受信したOfferSDPの設定とAnswerSDPの作成
        //   console.log('Call : setOfferSDPAndCreateAnswerSDP()');
        //   this.setOfferSDPAndCreateAnswerSDP(rtcPeerConnection, objData.data);
        // } else if ('answer' === objData.type) {
        //   // 受信したAnswerSDPの設定
        //   console.log('Call : setAnswerSDP()');
        //   this.setAnswerSDP(rtcPeerConnection, objData.data);
        // } else if ('candidate' === objData.type) {
        //   // 受信したICE candidateの追加
        //   console.log('Call : addCandidate()');
        //   this.addCandidate(rtcPeerConnection, objData.data);
        // } else if ('leave' === objData.type) {
        //   // チャット離脱の通知を受信したときの処理を追加します。
        //   // 「コネクションの終了処理」の関数を呼び出します。
        //   console.log('Call : endPeerConnection()');
        //   this.endPeerConnection(rtcPeerConnection);
        // }
      };
    },
    createOfferSDP(rtcPeerConnection: any) {
      // OfferSDPの作成
      rtcPeerConnection
        .createOffer()
        .then((sessionDescription: any) => {
          // 作成されたOfferSDPををLocalDescriptionに設定
          // このタイミングでICE candidate の収集が始まる（収集が完了したらonicegatheringstatechangeイベント発行してテキストエリアにSDPが表示される）
          return rtcPeerConnection.setLocalDescription(sessionDescription);
        })
        .then(() => {
          // Trickle ICEの場合は、初期SDPを相手に送る
          this.socket.emit('signaling', {
            type: 'offer',
            data: rtcPeerConnection.localDescription,
          });
        })
        .catch((error: Error) => {
          console.error('Error : ', error);
        });
    },
    createPeerConnection(stream: MediaStream) {
      // RTCPeerConnectionオブジェクトの生成
      const config = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
        ],
      };
      const rtcPeerConnection = new RTCPeerConnection(config);
      this.globalRtcPeerConnection = rtcPeerConnection;

      // RTCPeerConnectionオブジェクトのイベントハンドラの構築
      // ICE gathering state changeイベントハンドラについて、
      // 「iceGatheringState」が「complete」になったときの処理として、
      // 「収集したICE candidateを保持するSDP」をブラウザ画面の「Offer側のOfferSDP用のテキストエリア」に貼り付ける処理
      this.setupRTCPeerConnectionEventHandler(rtcPeerConnection);

      // RTCPeerConnectionオブジェクトのストリームにローカルのメディアストリームを追加
      if (stream) {
        // - 古くは、RTCPeerConnection.addStream(stream) を使用していたが、廃止予定となった。
        //   現在は、RTCPeerConnection.addTrack(track, stream) を使用する。
        stream.getTracks().forEach((track) => {
          rtcPeerConnection.addTrack(track, stream);
        });
      } else {
        console.log('No local stream.');
      }

      return rtcPeerConnection;
    },
    isDataChannelOpen(rtcPeerConnection: any) {
      if (!('datachannel' in rtcPeerConnection)) {
        // datachannelメンバーが存在しない
        return false;
      }
      if (!rtcPeerConnection.datachannel) {
        // datachannelメンバーがnull
        return false;
      }
      if ('open' !== rtcPeerConnection.datachannel.readyState) {
        // datachannelメンバーはあるが、"open"でない。
        return false;
      }
      // DataCchannelが開いている
      return true;
    },
    setupRTCPeerConnectionEventHandler(rtcPeerConnection: any) {
      // Negotiation needed イベントが発生したときのイベントハンドラ
      // - このイベントは、セッションネゴシエーションを必要とする変更が発生したときに発生する。
      //   一部のセッション変更はアンサーとしてネゴシエートできないため、このネゴシエーションはオファー側として実行されなければならない。
      //   最も一般的には、negotiationneededイベントは、RTCPeerConnectionに送信トラックが追加された後に発生する。
      //   ネゴシエーションがすでに進行しているときに、ネゴシエーションを必要とする方法でセッションが変更された場合、
      //   ネゴシエーションが完了するまで、negotiationneededイベントは発生せず、ネゴシエーションがまだ必要な場合にのみ発生する。
      //   see : https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/onnegotiationneeded
      rtcPeerConnection.onnegotiationneeded = () => {
        console.log('Event : Negotiation needed');

        if (!this.isDataChannelOpen(rtcPeerConnection)) {
          //
        } else {
          console.log('Call : createOfferSDP()');
          this.createOfferSDP(rtcPeerConnection);
        }
      };

      // ICE candidate イベントが発生したときのイベントハンドラ
      // - これは、ローカルのICEエージェントがシグナリング・サーバを介して
      //   他のピアにメッセージを配信する必要があるときはいつでも発生する。
      //   これにより、ブラウザ自身がシグナリングに使用されている技術についての詳細を知る必要がなく、
      //   ICE エージェントがリモートピアとのネゴシエーションを実行できるようになる。
      //   see : https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/onicecandidate
      rtcPeerConnection.onicecandidate = (event: any) => {
        console.log('Event : ICE candidate');
        if (event.candidate) {
          console.log('- ICE candidate : ', event.candidate);

          this.socket.emit('signaling', {
            type: 'candidate',
            data: event.candidate,
          });

          // if (!this.isDataChannelOpen(rtcPeerConnection)) {
          //   console.log('- Send ICE candidate to server');
          //   this.g_socket.emit('signaling', {
          //     type: 'candidate',
          //     data: event.candidate,
          //   });
          // } else {
          //   console.log('- Send ICE candidate through DataChannel');
          //   rtcPeerConnection.datachannel.send(
          //     JSON.stringify({ type: 'candidate', data: event.candidate })
          //   );
          // }
        } else {
          console.log('- ICE candidate : empty');
        }
      };

      rtcPeerConnection.onicecandidateerror = (event: any) => {
        console.error(
          'Event : ICE candidate error. error code : ',
          event.errorCode
        );
      };

      // ICE gathering state change イベントが発生したときのイベントハンドラ
      // - このイベントは、ICE gathering stateが変化したときに発生する。
      //   言い換えれば、ICEエージェントがアクティブに候補者を収集しているかどうかが変化したときに発生する。
      //   see : https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/onicegatheringstatechange
      rtcPeerConnection.onicegatheringstatechange = () => {
        console.log('Event : ICE gathering state change');
        console.log(
          '- ICE gathering state : ',
          rtcPeerConnection.iceGatheringState
        );

        if ('complete' === rtcPeerConnection.iceGatheringState) {
          if ('offer' === rtcPeerConnection.localDescription.type) {
            // OfferSDPをサーバーに送信
            //console.log( "- Send OfferSDP to server" );
            //g_socket.emit( "signaling", { type: "offer", data: rtcPeerConnection.localDescription } );
          } else if ('answer' === rtcPeerConnection.localDescription.type) {
            // AnswerSDPをサーバーに送信
            //console.log( "- Send AnswerSDP to server" );
            //g_socket.emit( "signaling", { type: "answer", data: rtcPeerConnection.localDescription } );
          } else {
            console.error(
              'Unexpected : Unknown localDescription.type. type = ',
              rtcPeerConnection.localDescription.type
            );
          }
        }
      };

      // ICE connection state change イベントが発生したときのイベントハンドラ
      // - このイベントは、ネゴシエーションプロセス中にICE connection stateが変化するたびに発生する。
      // - 接続が成功すると、通常、状態は「new」から始まり、「checking」を経て、「connected」、最後に「completed」と遷移します。
      //   ただし、特定の状況下では、「connected」がスキップされ、「checking」から「completed」に直接移行する場合があります。
      //   これは、最後にチェックされた候補のみが成功した場合に発生する可能性があり、成功したネゴシエーションが完了する前に、
      //   収集信号と候補終了信号の両方が発生します。
      //   see : https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/iceconnectionstatechange_event
      rtcPeerConnection.oniceconnectionstatechange = () => {
        console.log('Event : ICE connection state change');
        console.log(
          '- ICE connection state : ',
          rtcPeerConnection.iceConnectionState
        );
      };

      // Signaling state change イベントが発生したときのイベントハンドラ
      // - このイベントは、ピア接続のsignalStateが変化したときに送信される。
      //   これは、setLocalDescription（）またはsetRemoteDescription（）の呼び出しが原因で発生する可能性がある。
      //   see : https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/onsignalingstatechange
      rtcPeerConnection.onsignalingstatechange = () => {
        console.log('Event : Signaling state change');
        console.log('- Signaling state : ', rtcPeerConnection.signalingState);
      };

      // Connection state change イベントが発生したときのイベントハンドラ
      // - このイベントは、ピア接続の状態が変化したときに送信される。
      //   see : https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/onconnectionstatechange
      rtcPeerConnection.onconnectionstatechange = () => {
        console.log('Event : Connection state change');
        console.log('- Connection state : ', rtcPeerConnection.connectionState);

        if ('failed' === rtcPeerConnection.connectionState) {
          console.log('Call : endPeerConnection()');
          this.endPeerConnection(rtcPeerConnection);
        }
      };

      // Track イベントが発生したときのイベントハンドラ
      // - このイベントは、新しい着信MediaStreamTrackが作成され、
      //   コネクション上のレシーバーセットに追加されたRTCRtpReceiverオブジェクトに関連付けられたときに送信される。
      //   see : https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/ontrack
      // - 古くは、rtcPeerConnection.onaddstream に設定していたが、廃止された。
      //   現在は、rtcPeerConnection.ontrack に設定する。
      // 通信相手のMediaStreamを受け取った際に発行される？
      rtcPeerConnection.ontrack = (event: any) => {
        console.log('Event : Track');
        console.log('- stream', event.streams[0]);
        console.log('- track', event.track);

        // HTML要素へのリモートメディアストリームの設定
        const stream = event.streams[0];
        const track = event.track;
        if ('video' === track.kind) {
          console.log('Call : setStreamToElement( Video_Remote, stream )');
          // this.setStreamToElement(g_elementVideoRemote, stream);
        } else if ('audio' === track.kind) {
          console.log('Call : setStreamToElement( Audio_Remote, stream )');
          // this.setStreamToElement(g_elementAudioRemote, stream);
        } else {
          console.error('Unexpected : Unknown track kind : ', track.kind);
        }

        // 相手のメディアストリームがRTCPeerConnectionから削除されたときのイベントハンドラ
        // - 相手の RTCPeerConnection.removeTrack( sender );
        //   の結果として、streamの「removetrack」イベントが発生する。
        // - 古くは、rtcPeerConnection.onremovetrack に設定していたが、廃止された。
        //   現在は、stream.onremovetrack に設定する。
        // 「相手のメディアストリームがRTCPeerConnectionから削除されたときのイベントハンドラ」を追加します。
        // 処理内容は、削除されたトラックの種類に対応したHTML要素に設定されたメディアストリームをクリアします。
        stream.onremovetrack = (evt: any) => {
          console.log('Stream Event : remove track');
          console.log('- stream', stream);
          console.log('- track', evt.track); // 映像データか音声データを判別するのに使用

          // HTML要素のメディアストリームの解除
          const trackRemove = evt.track;
          if ('video' === trackRemove.kind) {
            console.log('Call : setStreamToElement( Video_Remote, null )');
            // this.setStreamToElement(g_elementVideoRemote, null);
          } else if ('audio' === trackRemove.kind) {
            console.log('Call : setStreamToElement( Audio_Remote, null )');
            // this.setStreamToElement(g_elementAudioRemote, null);
          } else {
            console.error(
              'Unexpected : Unknown track kind : ',
              trackRemove.kind
            );
          }
        };
      };

      // Data channel イベントが発生したときのイベントハンドラ
      // - このイベントは、createDataChannel() を呼び出すリモートピアによって
      //   RTCDataChannelが接続に追加されたときに送信されます。
      //   see : https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/ondatachannel
      // offerされる側は、相手との接続が完了すると、DataChannelイベントが発生します。
      // DataChannelオブジェクトが手に入ります。
      // DataChannelオブジェクトを、RTCPeerConnectionオブジェクトのメンバーに追加します。
      // DataChannelオブジェクトのイベントハンドラを構築します。
      // connectVoiceChannelメソッド内でrtcPeerConnectionインスタンスの作成、
      // createDataChannel()を実行しているのでその最中に呼び出される
      rtcPeerConnection.ondatachannel = (event: any) => {
        console.log('Event : Data channel');

        rtcPeerConnection.datachannel = event.channel;
        console.log('Call : setupDataChannelEventHandler()');
        this.setupDataChannelEventHandler(rtcPeerConnection);

        console.log('Call : createOfferSDP()');
        this.createOfferSDP(rtcPeerConnection);
      };
    },
    // socketでofferSDPを受け取った際に実行される
    setOfferSDPAndCreateAnswerSDP(
      rtcPeerConnection: any,
      sessionDescription: any
    ) {
      rtcPeerConnection
        .setRemoteDescription(sessionDescription)
        .then(() => {
          // AnswerSDPの作成
          return rtcPeerConnection.createAnswer();
        })
        .then((sessionDescription: any) => {
          // 作成されたAnswerSDPををLocalDescriptionに設定
          return rtcPeerConnection.setLocalDescription(sessionDescription);
        })
        .then(() => {
          // Vanilla ICEの場合は、まだSDPを相手に送らない
          // Trickle ICEの場合は、初期SDPを相手に送る

          this.socket.emit('signaling', {
            type: 'answer',
            data: rtcPeerConnection.localDescription,
          });

          // if (!this.isDataChannelOpen(rtcPeerConnection)) {
          //   // チャット前
          //   // 初期AnswerSDPをサーバーを経由して相手に送信
          //   // サーバーがsignalingイベントを受け取った場合、送信元以外の全員へ送信する
          //   this.socket.emit('signaling', {
          //     type: 'answer',
          //     data: rtcPeerConnection.localDescription,
          //   });
          // } else {
          //   // チャット中
          //   // 初期AnswerSDPをDataChannelを通して相手に直接送信
          //   console.log('- Send AnswerSDP through DataChannel');
          //   rtcPeerConnection.datachannel.send(
          //     JSON.stringify({
          //       type: 'answer',
          //       data: rtcPeerConnection.localDescription,
          //     })
          //   );
          // }
        })
        .catch((error: Error) => {
          console.error('Error : ', error);
        });
    },
    // 受け取ったSDPをリモートにセットする
    setAnswerSDP(rtcPeerConnection: any, sessionDescription: any) {
      console.log('Call : rtcPeerConnection.setRemoteDescription()');
      rtcPeerConnection
        .setRemoteDescription(sessionDescription)
        .catch((error: Error) => {
          console.error('Error : ', error);
        });
    },
    // rtcPeerConnectionインスタンスにIceCandidateを追加
    addCandidate(rtcPeerConnection: any, candidate: any) {
      console.log('Call : rtcPeerConnection.addIceCandidate()');
      rtcPeerConnection.addIceCandidate(candidate).catch((error: Error) => {
        console.error('Error : ', error);
      });
    },
    endPeerConnection(rtcPeerConnection: any) {
      // リモート映像の停止
      console.log('Call : setStreamToElement( Video_Remote, null )');
      // setStreamToElement(g_elementVideoRemote, null);
      // リモート音声の停止
      console.log('Call : setStreamToElement( Audio_Remote, null )');
      // setStreamToElement(g_elementAudioRemote, null);

      // DataChannelの終了
      if ('datachannel' in rtcPeerConnection) {
        rtcPeerConnection.datachannel.close();
        rtcPeerConnection.datachannel = null;
      }

      // グローバル変数から解放
      this.globalRtcPeerConnection = null;

      // ピアコネクションの終了
      rtcPeerConnection.close();
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
