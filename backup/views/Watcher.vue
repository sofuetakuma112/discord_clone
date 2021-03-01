<template>
  <div>
    <video playsinline autoplay :muted="muted" :srcObject.prop="stream"></video>
    <button @click="enableAudio">Enable audio</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      peerConnection: null,
      stream: null,
      config: {
        iceServers: [
          {
            urls: 'stun:stun.l.google.com:19302',
          },
          // {
          //   "urls": "turn:TURN_IP?transport=tcp",
          //   "username": "TURN_USERNAME",
          //   "credential": "TURN_CREDENTIALS"
          // }
        ],
      },
      muted: false,
    };
  },
  props: {
    socket: Object,
  },
  created() {
    this.$socket.on('offer', (id: string, description: any) => {
      this.peerConnection = new RTCPeerConnection(this.config);
      // 受け取ったsdpをリモートにセット、アンサーsdp作成してローカルにセットして送信
      this.peerConnection
        .setRemoteDescription(description)
        .then(() => this.peerConnection.createAnswer())
        .then((sdp) => {
          console.log(sdp);
          return this.peerConnection.setLocalDescription(sdp);
        })
        .then(() =>
          this.$socket.emit('answer', id, this.peerConnection.localDescription)
        );
      // 相手がaddTrackしてストリームをRTCPeerConnectionにセットする度に実行される
      this.peerConnection.ontrack = (event: any) => {
        this.stream = event.streams[0];
      };
      this.peerConnection.onicecandidate = (event: any) => {
        if (event.candidate) {
          this.$socket.emit('candidate', id, event.candidate);
        }
      };
    });

    this.$socket.on('candidate', (id: string, candidate: any) => {
      this.peerConnection
        .addIceCandidate(new RTCIceCandidate(candidate))
        .catch((e: Error) => console.error(e));
    });

    this.$socket.on('connect', () => {
      this.$socket.emit('watcher');
    });

    this.$socket.on('broadcaster', () => {
      this.$socket.emit('watcher');
    });

    // window.onunload = window.onbeforeunload = () => {
    //   this.$socket.close();
    //   this.peerConnection.close();
    // };
  },
  methods: {
    enableAudio() {
      console.log('Enabling audio');
      this.muted = false;
    },
  },
});
</script>
