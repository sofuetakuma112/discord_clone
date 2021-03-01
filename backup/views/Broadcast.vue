<template>
  <div>
    <section class="select">
      <label for="audioSource">Audio source: </label>
      <select id="audioSource" v-model="audioSelect" @change="getStream">
        <template v-for="deviceInfo in deviceInfos">
          <option
            v-if="deviceInfo.kind === 'audioinput'"
            :value="deviceInfo.deviceId"
            :key="deviceInfo.deviceId"
          >
            {{
              deviceInfo.label || `Microphone ${this.audioSelect.length + 1}`
            }}
          </option>
        </template>
      </select>
    </section>

    <section class="select">
      <label for="videoSource">Video source: </label>
      <select id="videoSource" v-model="videoSelect" @change="getStream">
        <template v-for="deviceInfo in deviceInfos">
          <option
            v-if="deviceInfo.kind !== 'audioinput'"
            :value="deviceInfo.deviceId"
            :key="deviceInfo.deviceId"
            >{{
              deviceInfo.label || `Camera ${this.videoSelect.length + 1}`
            }}</option
          >
        </template>
      </select>
    </section>

    <video :srcObject.prop="stream" playsinline autoplay muted></video>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      stream: null,
      audioSelect: null,
      videoSelect: null,
      peerConnections: {},
      deviceInfos: null,
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
    };
  },
  props: {
    socket: Object,
  },
  created() {
    this.$socket.on('answer', async (id: string, description: any) => {
      await this.peerConnections[id].setRemoteDescription(description);
    });

    // id : /watcherにいるクライアントのsocket id
    this.$socket.on('watcher', (id: string) => {
      const peerConnection = new RTCPeerConnection(this.config);
      this.peerConnections[id] = peerConnection;

      this.stream
        .getTracks()
        .forEach((track: any) => peerConnection.addTrack(track, this.stream));

      peerConnection.onicecandidate = (event: any) => {
        if (event.candidate) {
          this.$socket.emit('candidate', id, event.candidate);
        }
      };

      peerConnection
        .createOffer()
        .then((sdp) => peerConnection.setLocalDescription(sdp))
        .then(() =>
          this.$socket.emit('offer', id, peerConnection.localDescription)
        );
    });

    this.$socket.on('candidate', (id: string, candidate: any) => {
      this.peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
    });

    this.$socket.on('disconnectPeer', (id: string) => {
      console.log('delete Peer Socket id : ', id);
      console.log(this.peerConnections[id]);
      this.peerConnections[id].close();
      delete this.peerConnections[id];
    });

    // window.onunload = window.onbeforeunload = () => {
    //   this.$socket.close();
    // };

    this.broadcast();
  },
  methods: {
    broadcast() {
      this.getStream()
        .then(this.getDevices)
        .then((gotDevices: any) => (this.deviceInfos = gotDevices));
    },
    getDevices() {
      return navigator.mediaDevices.enumerateDevices();
    },
    gotDevices(deviceInfos) {
      // 取得したデバイス一覧からDOM生成
      this.deviceInfos = deviceInfos;
    },
    getStream() {
      if (this.stream) {
        this.stream.getTracks().forEach((track: any) => {
          track.stop();
        });
      }
      const audioSource = this.audioSelect;
      const videoSource = this.videoSelect;
      const constraints = {
        audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
        video: { deviceId: videoSource ? { exact: videoSource } : undefined },
      };
      return navigator.mediaDevices
        .getUserMedia(constraints)
        .then(this.gotStream)
        .catch(this.handleError);
    },
    gotStream(stream: any) {
      this.stream = stream;
      // this.audioSelect.selectedIndex = [...this.audioSelect.options].findIndex(
      //   (option) => option.text === stream.getAudioTracks()[0].label
      // );
      // this.videoSelect.selectedIndex = [...this.videoSelect.options].findIndex(
      //   (option) => option.text === stream.getVideoTracks()[0].label
      // );
      this.$socket.emit('broadcaster');
    },
    handleError(error: Error) {
      console.error('Error: ', error);
    },
  },
});
</script>
