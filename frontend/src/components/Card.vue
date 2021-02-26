<template>
  <v-card class="mx-auto root" width="232">
    <div class="avator">
      <v-avatar width="80px" height="80px" rounded="50%" class="mb-2">
        <template
          v-if="
            !toBoolean(user.is_anonymous) &&
              user.imageConvertedToBase64.length !== 0
          "
        >
          <img :src="user.imageConvertedToBase64" alt="" class="avatar-img" />
        </template>
        <template v-else>
          <img src="../assets/anonymous.png" class="avatar-img" />
        </template>
      </v-avatar>
      <p class="name">{{ user.name }}</p>
      <p class="id">{{ user._id }}</p>
    </div>
    <div class="options">
      <p class="memo-title">メモ</p>

      <div class="memo-area">
        <textarea>クリックしてメモを追加</textarea>
      </div>

      <div class="send-dm" v-if="storeUser._id !== user._id">
        <input
          v-model="input"
          @keydown.enter="submitDM"
          type="text"
          :placeholder="`@${user.name}へメッセージを送信`"
        />
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data: () => ({
    show: false,
    input: '',
  }),
  computed: {
    storeUser(): any {
      return this.$store.getters.getUser;
    },
  },
  props: {
    user: Object,
  },
  methods: {
    toBoolean(booleanStr: string): boolean {
      return booleanStr.toLowerCase() === 'true';
    },
    submitDM() {
      this.$emit('submitDM', {
        message: this.input,
        to: this.user,
        from: this.storeUser,
      });
    },
  },
});
</script>

<style scoped>
.avator {
  background: #202225;
  height: 162px;
  padding: 12px;
  text-align: center;
}

.avator .name {
  color: #fff;
  font-weight: 600;
  margin: 2px 0 0;
  word-break: break-word;
}

.avator .id {
  color: #b9bbbe;
  line-height: 18px;
  font-weight: 500;
  font-size: 12px;
  margin: 0;
  padding: 0;
}

.options {
  background: #2f3136;
  padding: 16px;
}

.send-dm {
  height: 40px;
  color: #dcddde;
  background-color: rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.3);
}

.send-dm input {
  font-size: 14px;
  display: block;
  width: 100%;
  height: 100%;
  color: #fff;
  padding: 10px;
}

.memo-title {
  padding: 0;
  border: 0;
  font-size: 12px;
  margin-bottom: 8px;
  color: #b9bbbe;
  font-weight: 700;
  text-transform: uppercase;
}

.memo-area {
  margin-left: -4px;
  margin-right: -4px;
  margin: 0;
  padding: 0;
  border: 0;
  font-weight: inherit;
  font-style: inherit;
  font-family: inherit;
  font-size: 100%;
  vertical-align: baseline;
  font-size: 12px;
  margin-bottom: 15px;
}

.memo-area textarea {
  width: 100%;
  color: hsla(0, 0%, 100%, 0.8);
}
</style>
