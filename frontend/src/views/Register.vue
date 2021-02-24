<template>
  <div class="root">
    <div class="register-container">
      <h4>アカウント作成</h4>
      <div class="text-area">
        <p>ユーザー名</p>
        <v-text-field
          label="Solo"
          solo
          flat
          height="40px"
          dense
          v-model="name"
        ></v-text-field>
      </div>
      <div class="text-area">
        <p>メールアドレス</p>
        <v-text-field
          type="email"
          label="Solo"
          solo
          flat
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
          flat
          height="40px"
          dense
          v-model="password"
        ></v-text-field>
      </div>
      <div class="input-area">
        <v-file-input
          label="File input"
          filled
          prepend-icon="mdi-camera"
          v-model="img"
          light
          @change="onImageChange"
        ></v-file-input>
      </div>
      <div class="preview-img" v-if="url">
        <v-img
          lazy-src="https://picsum.photos/id/11/10/6"
          max-height="150"
          max-width="250"
          :src="url"
        ></v-img>
      </div>
      <div class="error" v-if="errorMessage.length !== 0">
        <p>{{ errorMessage }}</p>
      </div>
      <div class="submit-button">
        <v-btn depressed color="primary" block height="44" @click="register">
          はい
        </v-btn>
      </div>
      <div class="login">
        <router-link to="/login">すでにアカウントをお持ちですか？</router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import api from '@/api/index';

type DataType = {
  name: string;
  email: string;
  password: string;
  errorMessage: string;
  img: File | null;
  url: string;
  error: Error | null;
};

export default Vue.extend({
  name: 'Register',
  data(): DataType {
    return {
      name: '',
      email: '',
      password: '',
      errorMessage: '',
      img: null,
      url: '',
      error: null,
    };
  },
  methods: {
    getBase64(file: File) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    },
    onImageChange() {
      if (this.img) {
        this.getBase64(this.img)
          .then((image) => (this.url = image as string))
          .catch((error: Error) => (this.error = error));
      } else this.url = '';
    },
    register() {
      api()
        .post('/api/register', {
          name: this.name,
          email: this.email,
          password: this.password,
          imageConvertedToBase64: this.url,
        })
        .then((result) => {
          if (result.data.status === 1) {
            // 成功
            localStorage.tokenAndHash = result.data.tokenAndHash;
            // アカウント作成直後はトークン認証する必要がないので、
            // そのままstoreに入れる
            this.$store.commit('updateUser', {
              _id: result.data.newUser._id,
              name: result.data.newUser.name,
              email: result.data.newUser.email,
              isAnonymous: result.data.newUser.isAnonymous,
            });
            this.$router.push({ name: 'Discord' });
          } else {
            this.errorMessage = result.data.message;
          }
        });
    },
  },
});
</script>

<style scoped>
.root {
  height: 100%;
  width: 100%;
  background-image: url('../assets/register.jpg');
}

.register-container {
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  max-width: 480px;
  width: 100%;
  padding: 32px;
  background: #36393f;
  box-sizing: border-box;
  text-align: center;
  display: flex;
  flex-direction: column;
}

.register-container h4 {
  font-weight: 600;
  color: #fff;
  font-size: 24px;
  line-height: 30px;
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
  margin-bottom: 10px;
}

.login {
  text-align: left;
}

.preview-img {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}
</style>
