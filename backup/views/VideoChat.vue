<template>
  <div>
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

    <table border="1">
      <tbody>
        <tr>
          <td></td>
          <td>Offer side</td>
          <td>Answer side</td>
        </tr>
        <tr>
          <td>OfferSDP</td>
          <td>
            <v-btn @click="onclickButton_CreateOfferSDP">
              Create OfferSDP.
            </v-btn>
            <br />
            <textarea
              id="textarea_offerside_offsersdp"
              rows="10"
              cols="40"
              readonly="readonly"
              v-model="textarea_offerside_offsersdp"
            ></textarea>
          </td>
          <td>
            <br />
            <textarea
              id="textarea_answerside_offsersdp"
              rows="10"
              cols="40"
              v-model="textarea_answerside_offsersdp"
            ></textarea>
          </td>
        </tr>
        <tr>
          <td>AnswerSDP</td>
          <td>
            <br />
            <textarea
              id="textarea_offerside_answersdp"
              rows="10"
              cols="40"
              v-model="textarea_offerside_answersdp"
            ></textarea
            ><br />
            <v-btn @click="onclickButton_SetAnswerSDPthenChatStarts">
              Set AnswerSDP. Then the chat starts.
            </v-btn>
          </td>
          <td>
            <v-btn @click="onclickButton_SetOfferSDPandCreateAnswerSDP">
              Set OfferSDP and Create AnswerSDP.
            </v-btn>
            <br />
            <textarea
              id="textarea_answerside_answersdp"
              rows="10"
              cols="40"
              readonly="readonly"
              v-model="textarea_answerside_answersdp"
            ></textarea
            ><br />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

interface DataType {
  localStream: MediaStream | null;
  remoteStreamForVideo: MediaStream | null;
  remoteStreamForAudio: MediaStream | null;
  cameraCheckBoxState: boolean;
  audioCheckBoxState: boolean;
  rtcPeerConnection: RTCPeerConnection | null;
  textarea_offerside_offsersdp: string;
  textarea_answerside_offsersdp: string;
  textarea_offerside_answersdp: string;
  textarea_answerside_answersdp: string;
}

export default Vue.extend({
  data(): DataType {
    return {
      localStream: null,
      remoteStreamForVideo: null,
      remoteStreamForAudio: null,
      cameraCheckBoxState: false,
      audioCheckBoxState: false,
      rtcPeerConnection: null,
      textarea_offerside_offsersdp: '',
      textarea_answerside_offsersdp: '',
      textarea_offerside_answersdp: '',
      textarea_answerside_answersdp: '',
    };
  },
  methods: {
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
        .then((stream) => {
          // HTML要素へのメディアストリームの設定
          console.log('Call : setStreamToElement( Video_Local, stream )');
          this.localStream = stream;
        })
        .catch((error) => {
          // メディアストリームの取得に失敗⇒古いメディアストリームのまま。チェックボックスの状態を戻す。
          console.error('Error : ', error);
          alert('Could not start Camera.');
          this.cameraCheckBoxState = false;
          this.audioCheckBoxState = false;
          return;
        });
    },
    onclickButton_CreateOfferSDP() {
      console.log("UI Event : 'Create Offer SDP.' button clicked.");

      if (this.rtcPeerConnection) {
        // 既にコネクションオブジェクトあり
        alert('Connection object already exists.');
        return;
      }

      // RTCPeerConnectionオブジェクトの作成
      console.log('Call : createPeerConnection()');
      const rtcPeerConnection = this.createPeerConnection();
      this.rtcPeerConnection = rtcPeerConnection; // グローバル変数に設定
      console.log(this.rtcPeerConnection === rtcPeerConnection);

      // OfferSDPの作成
      this.createOfferSDP(rtcPeerConnection);
    },
    createPeerConnection() {
      // RTCPeerConnectionオブジェクトの生成
      const config = { iceServers: [] };
      const rtcPeerConnection = new RTCPeerConnection(config);

      // RTCPeerConnectionオブジェクトのイベントハンドラの構築
      this.setupRTCPeerConnectionEventHandler(rtcPeerConnection);

      // RTCPeerConnectionオブジェクトのストリームにローカルのメディアストリームを追加
      if (this.localStream) {
        this.localStream.getTracks().forEach((track) => {
          rtcPeerConnection.addTrack(track, this.localStream);
        });
      } else {
        console.log('No local stream.');
      }

      return rtcPeerConnection;
    },
    setupRTCPeerConnectionEventHandler(rtcPeerConnection: any) {
      rtcPeerConnection.onnegotiationneeded = () => {
        console.log('Event : Negotiation needed');
      };

      rtcPeerConnection.onicecandidate = (event: any) => {
        console.log('Event : ICE candidate');
        if (event.candidate) {
          // ICE candidateがある
          console.log('- ICE candidate : ', event.candidate);
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

      // 収集の状態が変化したら実行されるハンドラ
      // 収集したICE candidateを保持するSDP
      rtcPeerConnection.onicegatheringstatechange = () => {
        console.log('Event : ICE gathering state change');
        console.log(
          '- ICE gathering state : ',
          rtcPeerConnection.iceGatheringState
        );

        if ('complete' === rtcPeerConnection.iceGatheringState) {
          // Vanilla ICEの場合は、ICE candidateを含んだOfferSDP/AnswerSDPを相手に送る
          // Trickle ICEの場合は、何もしない
          if ('offer' === rtcPeerConnection.localDescription.type) {
            // Offer側のOfferSDP用のテキストエリアに貼付
            console.log('- Set OfferSDP in textarea');
            this.textarea_offerside_offsersdp =
              rtcPeerConnection.localDescription.sdp;
            // g_elementTextareaOfferSideOfferSDP.focus();
            // g_elementTextareaOfferSideOfferSDP.select();
          } else if ('answer' === rtcPeerConnection.localDescription.type) {
            // Answer側のAnswerSDP用のテキストエリアに貼付
            console.log('- Set AnswerSDP in textarea');
            this.textarea_answerside_answersdp =
              rtcPeerConnection.localDescription.sdp;
            // g_elementTextareaAnswerSideAnswerSDP.focus();
            // g_elementTextareaAnswerSideAnswerSDP.select();
          } else {
            console.error(
              'Unexpected : Unknown localDescription.type. type = ',
              rtcPeerConnection.localDescription.type
            );
          }
        }
      };

      rtcPeerConnection.oniceconnectionstatechange = () => {
        console.log('Event : ICE connection state change');
        console.log(
          '- ICE connection state : ',
          rtcPeerConnection.iceConnectionState
        );
      };

      rtcPeerConnection.onsignalingstatechange = () => {
        console.log('Event : Signaling state change');
        console.log('- Signaling state : ', rtcPeerConnection.signalingState);
      };

      rtcPeerConnection.onconnectionstatechange = () => {
        console.log('Event : Connection state change');
        console.log('- Connection state : ', rtcPeerConnection.connectionState);
      };

      // - このイベントは、新しい着信MediaStreamTrackが作成され、
      //   コネクション上のレシーバーセットに追加されたRTCRtpReceiverオブジェクトに関連付けられたときに送信される。
      // 接続相手がRTCPeerConnectionのトラックにストリームを追加すると発行されるイベント
      // 引数のイベントには通信相手のストリームが入っている
      rtcPeerConnection.ontrack = (event: any) => {
        console.log('Event : Track');
        console.log('- stream', event.streams[0]);
        console.log('- track', event.track);

        // HTML要素へのリモートメディアストリームの設定
        const stream = event.streams[0];
        const track = event.track;
        if ('video' === track.kind) {
          console.log('Call : setStreamToElement( Video_Remote, stream )');
          this.remoteStreamForVideo = stream;
        } else if ('audio' === track.kind) {
          console.log('Call : setStreamToElement( Audio_Remote, stream )');
          this.remoteStreamForAudio = stream;
        } else {
          console.error('Unexpected : Unknown track kind : ', track.kind);
        }
      };
    },
    createOfferSDP(rtcPeerConnection: any) {
      // OfferSDPの作成
      console.log('Call : rtcPeerConnection.createOffer()');
      rtcPeerConnection
        .createOffer()
        .then((sessionDescription: any) => {
          // 作成されたOfferSDPををLocalDescriptionに設定
          console.log('Call : rtcPeerConnection.setLocalDescription()');
          return rtcPeerConnection.setLocalDescription(sessionDescription);
        })
        .then(() => {
          // Vanilla ICEの場合は、まだSDPを相手に送らない
          // Trickle ICEの場合は、初期SDPを相手に送る
        })
        .catch((error: Error) => {
          console.error('Error : ', error);
        });
    },
    onclickButton_SetOfferSDPandCreateAnswerSDP() {
      console.log(
        "UI Event : 'Set OfferSDP and Create AnswerSDP.' button clicked."
      );

      if (this.rtcPeerConnection) {
        // 既にコネクションオブジェクトあり
        alert('Connection object already exists.');
        return;
      }

      if (!this.textarea_answerside_offsersdp) {
        // OfferSDPが空
        alert('OfferSDP is empty. Please enter the OfferSDP.');
        return;
      }

      // RTCPeerConnectionオブジェクトの作成
      console.log('Call : createPeerConnection()');
      const rtcPeerConnection = this.createPeerConnection();
      this.rtcPeerConnection = rtcPeerConnection; // グローバル変数に設定

      // OfferSDPの設定とAnswerSDPの作成
      // OfferSDPのテキストからOfferSDPのDescriptionを作成
      const sessionDescription = new RTCSessionDescription({
        type: 'offer',
        sdp: this.textarea_answerside_offsersdp,
      });
      console.log('Call : setOfferSDP_and_createAnswerSDP()');
      this.setOfferSDP_and_createAnswerSDP(
        rtcPeerConnection,
        sessionDescription
      );
    },
    setOfferSDP_and_createAnswerSDP(
      rtcPeerConnection: any,
      sessionDescription: any
    ) {
      console.log('Call : rtcPeerConnection.setRemoteDescription()');
      rtcPeerConnection
        .setRemoteDescription(sessionDescription)
        .then(() => {
          // AnswerSDPの作成
          console.log('Call : rtcPeerConnection.createAnswer()');
          // このタイミングでICE candidateの収集が始まる
          return rtcPeerConnection.createAnswer();
        })
        .then((sessionDescription: any) => {
          // 作成されたAnswerSDPををLocalDescriptionに設定
          console.log('Call : rtcPeerConnection.setLocalDescription()');
          return rtcPeerConnection.setLocalDescription(sessionDescription);
        })
        .then(() => {
          // Vanilla ICEの場合は、まだSDPを相手に送らない
          // Trickle ICEの場合は、初期SDPを相手に送る
        })
        .catch((error: Error) => {
          console.error('Error : ', error);
        });
    },
    onclickButton_SetAnswerSDPthenChatStarts() {
      console.log(
        "UI Event : 'Set AnswerSDP. Then the chat starts.' button clicked."
      );

      if (!this.rtcPeerConnection) {
        // コネクションオブジェクトがない
        alert('Connection object does not exist.');
        return;
      }

      // AnswerSDPを、テキストエリアから取得
      const strAnswerSDP = this.textarea_offerside_answersdp;
      if (!strAnswerSDP) {
        // AnswerSDPが空
        alert('AnswerSDP is empty. Please enter the AnswerSDP.');
        return;
      }

      // AnswerSDPの設定
      const sessionDescription = new RTCSessionDescription({
        type: 'answer',
        sdp: strAnswerSDP,
      });
      console.log('Call : setAnswerSDP()');
      this.setAnswerSDP(sessionDescription);
    },
    setAnswerSDP(sessionDescription: any) {
      console.log('Call : rtcPeerConnection.setRemoteDescription()');

      if (!this.rtcPeerConnection) {
        // コネクションオブジェクトがない
        alert('Connection object does not exist.');
        return;
      }

      // offerした側でanswerSDPをリモートにセットする
      if (this.rtcPeerConnection) {
        this.rtcPeerConnection
          .setRemoteDescription(sessionDescription)
          .catch((error: Error) => {
            console.error('Error : ', error);
          });
      }
    },
  },
});
</script>

<style scoped>
input:read-only,
textarea:read-only {
  background-color: #ccc;
}
</style>
