<template>
  <div class="root">
    <div class="form-wrapper">
      <div class="form">
        <h4>おかえりなさい！</h4>
        <p>またお会いしましたね！</p>
        <v-toolbar>
          <v-tabs v-model="tab" align-with-title>
            <v-tabs-slider color="yellow"></v-tabs-slider>

            <v-tab v-for="item in items" :key="item">
              {{ item }}
            </v-tab>
          </v-tabs>
        </v-toolbar>
        <v-tabs-items v-model="tab" class="pa-4" light>
          <v-tab-item>
            <v-card flat>
              <div class="text-area">
                <p>メールアドレス</p>
                <v-text-field
                  type="email"
                  label="Solo"
                  solo
                  height="40px"
                  dense
                  v-model="email"
                ></v-text-field>
              </div>
              <div class="text-area">
                <p>パスワード</p>
                <v-text-field
                  type="password"
                  label="Solo"
                  solo
                  height="40px"
                  dense
                  v-model="password"
                ></v-text-field>
              </div>
              <div class="error">
                <p>{{ errorMessage }}</p>
              </div>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card flat>
              <div class="text-area">
                <p>ユーザー名</p>
                <v-text-field
                  label="Solo"
                  solo
                  height="40px"
                  dense
                  v-model="anonymousName"
                ></v-text-field>
              </div>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
        <div class="submit-button">
          <v-btn depressed color="primary" block height="44" @click="login">
            ログイン
          </v-btn>
        </div>
        <div class="register">
          <span>アカウントが必要ですか？</span>
          <router-link to="/register">登録</router-link>
        </div>
      </div>
      <div class="server-info-container">
        <img src="../assets/discord.jpg" alt="" />
        <div class="server-info">
          <h4>ユーザー名のみでログインできます</h4>
          <p>
            ああ
          </p>
          <router-link to="/discord">バックドア</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as mutations from '@/graphql/mutation';

export default Vue.extend({
  data() {
    return {
      email: '',
      password: '',
      tab: 0,
      items: ['ログイン', '匿名ログイン'],
      anonymousName: '',
      errorMessage: '',
    };
  },
  props: {
    socket: Object,
  },
  methods: {
    async login() {
      if (
        this.email.length !== 0 &&
        this.password.length !== 0 &&
        this.tab === 0
      ) {
        const response = await this.$apollo.mutate({
          mutation: mutations.authenticateUser,
          variables: {
            email: this.email,
            password: this.password,
          },
        });
        const data = response.data.authenticateUser;
        if (data.status === 2) {
          this.errorMessage = data.errorMessage;
        } else {
          localStorage.tokenAndHash = data.tokenAndHash;
          this.$store.commit('updateUser', {
            _id: data._id,
            socketId: data.socket_id,
            name: data.name,
            email: data.email,
            isAnonymous: data.is_anonymous,
            imageConvertedToBase64: data.imageConvertedToBase64,
          });
          this.$router.push({ name: 'Discord' });
        }
      } else if (this.anonymousName.length !== 0 && this.tab === 1) {
        const response = await this.$apollo.mutate({
          mutation: mutations.createNewUser,
          variables: {
            name: this.anonymousName,
            email: '',
            password: '',
            imageConvertedToBase64: '',
            isAnonymous: true,
            socketId: this.socket.id,
          },
        });
        this.$store.commit('updateUser', {
          _id: response.data.createUser._id,
          socketId: response.data.createUser.socket_id,
          name: response.data.createUser.name,
          isAnonymous: response.data.createUser.is_anonymous,
        });
        this.$router.push({ name: 'Discord' });
      }
    },
  },
});
</script>

<style scoped>
.root {
  height: 100%;
  width: 100%;
  background-image: url('../assets/lp.jpg');
}

.form-wrapper {
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  max-width: 785px;
  width: 100%;
  padding: 25px;
  background: #36393f;
  box-sizing: border-box;
  text-align: center;
  display: flex;
}

.form {
  max-width: 420px;
  width: 100%;
}

.form h4 {
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  margin: 0;
  padding: 0;
}

.form p {
  font-size: 16px;
  line-height: 20px;
  margin: 0;
  padding: 0;
  color: #b9bbbe;
  margin: 5px 0 20px 0;
}

.v-tabs-items {
  background: #36393f;
}

.text-area {
  color: #8e9297;
}

.text-area p {
  font-size: 12px;
  line-height: 16px;
  text-align: left;
  margin: 0;
}

.submit-button {
  margin-top: 20px;
  margin-bottom: 10px;
}

.server-info-container {
  max-width: 240px;
  margin-left: auto;
}

.server-info-container img {
  width: 180px;
  height: 180px;
  margin: 20px 0;
}

.server-info h4 {
  font-weight: 600;
  margin: 0;
  margin-bottom: 8px;
  font-size: 24px;
  color: #fff;
  line-height: 30px;
}

.server-info p {
  font-size: 16px;
  line-height: 20px;
  color: #b9bbbe;
}

.register {
  text-align: left;
}

.register span {
  font-size: 14px;
  line-height: 16px;
  color: #72767d;
  margin-right: 5px;
}
</style>
