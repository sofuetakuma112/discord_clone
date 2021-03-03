<template>
  <v-navigation-drawer v-model="drawer" app width="300" :style="darkBackGround">
    <v-navigation-drawer
      v-model="drawer"
      absolute
      mini-variant
      style="background: #202225"
      width="70px"
    >
      <v-avatar
        class="d-block text-center mx-auto mt-4"
        color="grey darken-1"
        size="48"
        style="cursor: pointer"
        @click="goHome"
        ><v-icon dark>
          fab fa-discord
        </v-icon></v-avatar
      >

      <v-divider class="mx-3 my-2"></v-divider>

      <v-hover v-slot="{ hover }" v-for="n in 1" :key="n">
        <v-avatar
          class="d-block text-center mx-auto mb-2"
          color="grey lighten-1"
          size="48"
          :class="{ 'on-hover': hover }"
          style="cursor: pointer"
          @click="goServer"
          ><img
            alt="Avatar"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/1200px-Typescript_logo_2020.svg.png"
        /></v-avatar>
      </v-hover>
    </v-navigation-drawer>

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
                <template v-if="usersExcludingMyself(dm.users).length === 1">
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

    <div class="user-container d-flex">
      <div class="user-icon my-auto mx-2">
        <v-avatar size="32"
          ><img
            :src="user.imageConvertedToBase64"
            alt=""
            height="32px"
            width="32px"
        /></v-avatar>
      </div>
      <div class="user-info my-auto">
        <p class="user-name">{{ user.name }}</p>
        <p class="user-id">{{ user._id }}</p>
      </div>
      <div class="d-flex my-auto">
        <v-btn icon height="32px" width="32px" @click="changeAudioState"
          ><v-icon
            v-if="!isMicMute"
            dark
            size="32px"
            dense
            small
            color="#b9bbbe"
            >fas fa-microphone</v-icon
          ><v-icon v-else dark size="32px" dense small color="#b9bbbe"
            >fas fa-microphone-slash</v-icon
          ></v-btn
        >
        <v-btn
          icon
          height="32px"
          width="32px"
          @click="isSpeakerMute = !isSpeakerMute"
        >
          <v-icon
            v-if="!isSpeakerMute"
            dark
            size="32px"
            dense
            small
            color="#b9bbbe"
            >fas fa-volume-up</v-icon
          ><v-icon v-else dark size="32px" dense small color="#b9bbbe"
            >fas fa-volume-off</v-icon
          >
        </v-btn>
        <v-btn
          icon
          height="32px"
          width="32px"
          @click="hangUp"
          :disabled="currentVoiceChannelId.length === 0"
          ><v-icon dark size="32px" dense small color="#b9bbbe">
            fas fa-phone-slash
          </v-icon></v-btn
        >
      </div>
    </div>
    <div class="video">
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
        width="320"
        height="240"
        style="border: 1px solid black;"
        autoplay
        :srcObject.prop="remoteStreamForVideo"
      ></video
      ><audio
        id="audio_remote"
        autoplay
        :srcObject.prop="remoteStreamForAudio"
      ></audio>
    </div>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue';
import * as types from '@/types/index.d.ts';
import * as mutations from '@/graphql/mutation';
//@ts-ignore
import joinSound from '@/assets/sounds/join.mp3';
//@ts-ignore
import leaveSound from '@/assets/sounds/leave.mp3';

interface DataType {
  drawer: any;
  isMicMute: boolean;
  isSpeakerMute: boolean;
  isSettingOpen: boolean;
  localStream: MediaStream | null;
  remoteStreamForVideo: MediaStream | null;
  remoteStreamForAudio: MediaStream | null;
}

type sdpDataAndType = {
  type: string;
  data: any;
  channelId: string;
};

const rtcPeerConnections = new Map<string, RTCPeerConnection>();

const black = '\u001b[30m';
const red = '\u001b[31m';
const green = '\u001b[32m';
const yellow = '\u001b[33m';
const blue = '\u001b[34m';
const magenta = '\u001b[35m';
const cyan = '\u001b[36m';
const white = '\u001b[37m';

const reset = '\u001b[0m';

export default Vue.extend({
  data(): DataType {
    return {
      drawer: null,
      isMicMute: false,
      isSpeakerMute: false,
      isSettingOpen: false,
      localStream: null,
      remoteStreamForVideo: null,
      remoteStreamForAudio: null,
    };
  },
  props: {
    darkBackGround: Object,
    allData: Array,
    value: String,
    currentView: Number,
    dms: Array,
  },
  computed: {
    user(): types.User {
      return this.$store.getters.getUser;
    },
    currentVoiceChannelId: {
      get(): string {
        return this.value;
      },
      set(value: string): void {
        this.$emit('input', value);
      },
    },
  },
  mounted() {
    console.log('mounted!');
    this.$socket.on('signaling', async (objData: sdpDataAndType) => {
      if ('offer' === objData.type) {
        console.log('offerSDPを受信');

        if (!rtcPeerConnections.size) {
          // コネクションオブジェクトが一つも無い
          const rtcPeerConnection = this.createPeerConnection();
          rtcPeerConnections.set(this.$socket.id, rtcPeerConnection);
        }

        await rtcPeerConnections
          .get(this.$socket.id)
          .setRemoteDescription(objData.data);
        const answer = await rtcPeerConnections
          .get(this.$socket.id)
          .createAnswer();
        await rtcPeerConnections
          .get(this.$socket.id)
          .setLocalDescription(answer);

        // AnserSDPをリモートへセットする
      } else if ('answer' === objData.type) {
        console.log('answerSDP received!');
        if (!rtcPeerConnections.size) {
          console.log(
            '\u001b[31m' + 'Connection object does not exist.' + '\u001b[0m'
          );
          return;
        }

        // AnswerSDPの設定
        await rtcPeerConnections
          .get(this.$socket.id)
          .setRemoteDescription(objData.data);
      } else {
        console.error('Unexpected : Socket Event : signaling');
      }
    });
  },
  methods: {
    createPeerConnection() {
      const config = {
        iceServers: [
          {
            urls: [
              'stun:stun.l.google.com:19302',
              'stun:stun1.l.google.com:19302',
              'stun:stun2.l.google.com:19302',
              'stun:stun3.l.google.com:19302',
              'stun:stun4.l.google.com:19302',
            ],
          },
        ],
      };

      const rtcPeerConnection = new RTCPeerConnection(config);

      this.setupRTCPeerConnectionEventHandler(rtcPeerConnection);

      if (this.localStream) {
        this.localStream.getTracks().forEach((track: any) => {
          rtcPeerConnection.addTrack(track, this.localStream as MediaStream);
        });
      } else {
        console.log('\u001b[31m' + 'No local stream.' + '\u001b[0m');
      }

      return rtcPeerConnection;
    },
    changeAudioState() {
      this.isMicMute = !this.isMicMute;

      // これまでの状態
      let trackCamera_old = null;
      let trackMicrophone_old = null;
      let idCameraTrack_old = '';
      let idMicrophoneTrack_old = '';
      // 新しい状態
      let bCamera_old = false;
      let bMicrophone_old = false;
      if (this.localStream) {
        trackCamera_old = this.localStream.getVideoTracks()[0];
        if (trackCamera_old) {
          bCamera_old = true;
          idCameraTrack_old = trackCamera_old.id;
        }
        trackMicrophone_old = this.localStream.getAudioTracks()[0];
        if (trackMicrophone_old) {
          bMicrophone_old = true;
          idMicrophoneTrack_old = trackMicrophone_old.id;
        }
      }

      // 今後の状態
      const bCamera_new = false;
      // if (false) {
      //   bCamera_new = true;
      // }
      let bMicrophone_new = false;
      if (!this.isMicMute) {
        bMicrophone_new = true;
      }

      // 状態変化
      console.log('Camera :  %s => %s', bCamera_old, bCamera_new);
      console.log('Microphoneo : %s = %s', bMicrophone_old, bMicrophone_new);

      if (bCamera_old === bCamera_new && bMicrophone_old === bMicrophone_new) {
        // チェックボックスの状態の変化なし
        return;
      }

      // コネクションオブジェクトから古いトラックの削除
      rtcPeerConnections.forEach((rtcPeerConnection) => {
        if (rtcPeerConnection) {
          console.log('コネクションオブジェクトから古いトラックの削除');
          // コネクションオブジェクトに対してTrack削除を行う。
          // （コネクションオブジェクトに対してTrack削除を行わなかった場合、使用していないstream通信が残る。）
          const senders = rtcPeerConnection.getSenders();
          senders.forEach((sender: any) => {
            if (sender.track) {
              if (
                idCameraTrack_old === sender.track.id ||
                idMicrophoneTrack_old === sender.track.id
              ) {
                rtcPeerConnection.removeTrack(sender);
                // removeTrack()の結果として、通信相手に、streamの「removetrack」イベントが発生する。
              }
            }
          });
        }
      });

      // 古いメディアストリームのトラックの停止（トラックの停止をせず、HTML要素のstreamの解除だけではカメラは停止しない（カメラ動作LEDは点いたまま））
      if (trackCamera_old) {
        console.log('Call : trackCamera_old.stop()');
        trackCamera_old.stop();
      }
      if (trackMicrophone_old) {
        console.log('古いメディアストリームのトラックの停止');
        trackMicrophone_old.stop();
      }
      // HTML要素のメディアストリームの解除
      this.localStream = null;

      if (!bCamera_new && !bMicrophone_new) {
        // （チェックボックスの状態の変化があり、かつ、）カメラとマイクを両方Offの場合
        console.log('----------------------------------------');
        return;
      }

      // 自分のメディアストリームを取得する。
      // - 古くは、navigator.getUserMedia() を使用していたが、廃止された。
      //   現在は、navigator.mediaDevices.getUserMedia() が新たに用意され、これを使用する。
      console.log(
        'Call : 自分のメディアストリームを取得する ( video=%s, audio=%s )',
        bCamera_new,
        bMicrophone_new
      );
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: bMicrophone_new })
        .then((stream: MediaStream) => {
          if (rtcPeerConnections.size) {
            console.log('コネクションオブジェクトに対してTrack追加を行う');
            rtcPeerConnections.forEach(async (rtcPeerConnection) => {
              stream.getTracks().forEach((track) => {
                rtcPeerConnection.addTrack(track, stream);
              });

              // 本来ならここでonnegotiationneededイベントが発行され、
              // 同イベント内でofferSDPの作成、送信を行うが今回はここで行っている

              // offerSDPの作成、送信
              const offer = await rtcPeerConnection.createOffer();
              await rtcPeerConnection.setLocalDescription(offer);
            });
          }
          this.localStream = stream;
          console.log('----------------------------------------');
        })
        .catch((error: Error) => {
          // メディアストリームの取得に失敗⇒古いメディアストリームのまま。チェックボックスの状態を戻す。
          console.error('Error : ', error);
          alert('Could not start Camera.');
          // this.cameraCheckBoxState = false;
          this.isMicMute = true;
          return;
        });
    },
    async connectVoiceChannel(channel: types.Channel) {
      if (
        !channel.connectingUserIds.some((userId) => userId === this.user._id)
      ) {
        const audio = new Audio(joinSound);
        audio.play();

        await navigator.mediaDevices
          .getUserMedia({ video: true, audio: !this.isMicMute })
          .then((stream: MediaStream) => {
            // HTML要素へのメディアストリームの設定
            this.localStream = stream;
          })
          .catch((error: Error) => {
            // メディアストリームの取得に失敗⇒古いメディアストリームのまま。チェックボックスの状態を戻す。
            console.error('Error : ', error);
            alert('Could not start Camera.');
            // this.cameraCheckBoxState = false;
            this.isMicMute = true;
            return;
          });

        this.currentVoiceChannelId = channel._id;

        // DBのチャンネルデータの同時接続者数を更新
        await this.$apollo.mutate({
          mutation: mutations.updateChannel,
          variables: {
            name: channel.name,
            type: channel.type,
            channelId: channel._id,
            userId: this.user._id,
          },
        });

        // ここからWebRTC関連
        if (channel.connectingUserIds.length === 0) {
          // 一人目は何もしない
        } else {
          // 2人目以降からofferSDPを作成して同じチャンネル内のユーザーに送信する
          const rtcPeerConnection = this.createPeerConnection();
          rtcPeerConnections.set(this.$socket.id, rtcPeerConnection);

          const offer = await rtcPeerConnections
            .get(this.$socket.id)
            .createOffer();
          await rtcPeerConnections
            .get(this.$socket.id)
            .setLocalDescription(offer);
        }
      }
    },
    setupRTCPeerConnectionEventHandler(rtcPeerConnection: any) {
      rtcPeerConnection.onnegotiationneeded = () => {
        // 自分のコネクションオブジェクトのトラックを追加、削除すると実行される
        // negotiationneededイベントは、
        // RTCPeerConnectionに送信トラックが追加された後に発生する。
        // OfferSDPを作成し、相手に送信（このときコネクションオブジェクトは使いまわす）
        console.log(red + 'RTCPeerConnectionのトラック変更を検知' + reset);
      };

      // 収集の状態が変化したら実行されるハンドラ
      // 収集したICE candidateを保持するSDP
      rtcPeerConnection.onicegatheringstatechange = () => {
        if ('complete' === rtcPeerConnection.iceGatheringState) {
          if ('offer' === rtcPeerConnection.localDescription.type) {
            console.log(blue + 'OfferSDPを送信' + reset);
            this.$socket.emit('signaling', {
              type: 'offer',
              data: rtcPeerConnection.localDescription,
              userId: this.user._id,
              channelId: this.currentVoiceChannelId,
            });
          } else if ('answer' === rtcPeerConnection.localDescription.type) {
            console.log(blue + 'AnswerSDPを送信', reset);
            this.$socket.emit('signaling', {
              type: 'answer',
              data: rtcPeerConnection.localDescription,
              userId: this.user._id,
              channelId: this.currentVoiceChannelId,
            });
          } else {
            console.error(
              'Unexpected : Unknown localDescription.type. type = ',
              rtcPeerConnection.localDescription.type
            );
          }
        }
      };

      // 通信相手のコネクションオブジェクトにトラックが追加されると発行される
      rtcPeerConnection.ontrack = (event: any) => {
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

        stream.onremovetrack = (event: any) => {
          // HTML要素のメディアストリームの解除
          console.log(
            '相手のトラックが変更されたので古いリモートメディアストリームを破棄する'
          );
          const trackRemove = event.track;
          if ('video' === trackRemove.kind) {
            this.remoteStreamForVideo = null;
          } else if ('audio' === trackRemove.kind) {
            this.remoteStreamForAudio = null;
          } else {
            console.error(
              'Unexpected : Unknown track kind : ',
              trackRemove.kind
            );
          }
        };
      };
    },
    showChat(channelId: string) {
      this.$emit('showChat', channelId);
    },
    openAddChannelModal(categoryId: string) {
      this.$emit('openAddChannelModal', categoryId);
    },
    createNewCategory() {
      this.$emit('openCreateCategoryModal');
    },
    goHome() {
      this.$emit('goHome');
    },
    goServer() {
      this.$emit('goServer');
    },
    hangUp() {
      const audio = new Audio(leaveSound);
      audio.play();

      this.$apollo.mutate({
        mutation: mutations.deleteUserFromVoiceChannel,
        variables: {
          channelId: this.currentVoiceChannelId,
          userId: this.user._id,
        },
      });
      this.currentVoiceChannelId = '';
      // rtcPeerConnection = null;
    },
    usersExcludingMyself(users: types.User[]) {
      const filteredUsers = users.filter((user) => {
        return user._id !== this.user._id;
      });
      return filteredUsers;
    },
  },
});
</script>

<style scoped>
.user-container {
  padding-left: 70px;
  height: 53px;
  background-color: #292b2f;
  position: absolute;
  bottom: 0;
  width: 100%;
}

.user-icon {
  max-width: 32px;
}

.user-info p {
  margin: 0;
  padding: 0;
  max-width: 84px;
}

.user-name {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  line-height: 18px;
  font-weight: 600;
  font-size: 14px;
  color: #fff;
}

.user-id {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: #b9bbbe;
  line-height: 13px;
  font-size: 12px;
}

.device-checkbox {
  max-width: 96px;
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
.theme--light.v-navigation-drawer .v-divider {
  border-color: hsla(0, 0%, 100%, 0.06);
}

.v-navigation-drawer.v-navigation-drawer--absolute.v-navigation-drawer--mini-variant.v-navigation-drawer--open.theme--light {
  z-index: 5;
  width: 70px !important;
}

.v-expansion-panel-header {
  min-height: auto !important;
  padding: 0 !important;
}

.v-expansion-panel--active > .v-expansion-panel-header {
  min-height: auto !important;
}

.v-list-item--link:before {
  background-color: #33363c !important;
}

.v-expansion-panel-content__wrap {
  padding: 0 !important;
}
</style>
