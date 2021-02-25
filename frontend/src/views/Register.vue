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
      <v-dialog v-model="dialog" width="500">
        <v-card>
          <v-card-text>
            <VueCropper
              v-show="fullImageData"
              ref="cropper"
              :src="fullImageData"
              alt="Source Image"
            ></VueCropper>
          </v-card-text>
          <v-card-actions>
            <v-btn
              class="primary"
              @click="
                (cropedImageData = refs.cropper.getCroppedCanvas().toDataURL()),
                  (dialog = false)
              "
              >Crop</v-btn
            >
            <v-btn color="primary" text @click="dialog = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <div class="preview-img" v-if="cropedImageData">
        <v-img
          lazy-src="https://picsum.photos/id/11/10/6"
          max-width="350"
          :src="cropedImageData"
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
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';
import * as mutations from '@/graphql/mutation';

type DataType = {
  name: string;
  email: string;
  password: string;
  errorMessage: string;
  img: File | null;
  fullImageData: string;
  error: Error | null;
  cropedImageData: string;
  dialog: boolean;
};

export default Vue.extend({
  name: 'Register',
  components: {
    VueCropper,
  },
  data(): DataType {
    return {
      name: '',
      email: '',
      password: '',
      errorMessage: '',
      img: null,
      fullImageData: '',
      cropedImageData: '',
      error: null,
      dialog: false,
    };
  },
  computed: {
    refs(): any {
      return this.$refs;
    },
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
          .then((image) => {
            this.dialog = true;
            this.fullImageData = image as string;
            this.refs.cropper.replace(this.fullImageData);
          })
          .catch((error: Error) => (this.error = error));
      } else this.cropedImageData = '';
    },
    async register() {
      const response = await this.$apollo.mutate({
        mutation: mutations.createNewUser,
        variables: {
          name: this.name,
          email: this.email,
          password: this.password,
          imageConvertedToBase64: this.cropedImageData,
          isAnonymous: false,
          socketId: '',
        },
      });

      if (response.data.createUser.status === 1) {
        localStorage.tokenAndHash = response.data.createUser.tokenAndHash;
        this.$store.commit('updateUser', {
          _id: response.data.createUser._id,
          name: response.data.createUser.name,
          email: response.data.createUser.email,
          isAnonymous: response.data.createUser.is_anonymous,
          imageConvertedToBase64:
            response.data.createUser.imageConvertedToBase64,
          socketId: response.data.createUser.socket_id,
        });
        this.$router.push({ name: 'Discord' });
      } else {
        this.errorMessage = response.data.createUser.errorMessage;
      }
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
