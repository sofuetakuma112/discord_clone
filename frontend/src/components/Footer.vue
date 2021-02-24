<template>
  <div class="root">
    <v-footer app color="transparent" height="72" inset class="v-footer">
      <div class="input-area">
        <v-file-input
          multiple
          label="File input"
          hide-input
          class="file pa-0 ma-0"
          background-color="#40444C"
          v-model="img"
          @change="onImageChange"
        ></v-file-input>
        <input
          v-model="input"
          :disabled="!isShowAnyChannel"
          @keypress.enter="send"
          class="text"
          background-color="#40444C"
        />
      </div>
    </v-footer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

type DataType = {
  img: File[] | null;
};

export default Vue.extend({
  data(): DataType {
    return {
      img: null,
    };
  },
  props: {
    isShowAnyChannel: Boolean,
    value: {
      type: String,
    },
  },
  computed: {
    input: {
      get(): string {
        return this.value;
      },
      set(value: string): void {
        this.$emit('input', value);
      },
    },
  },
  methods: {
    send() {
      this.$emit('send');
    },
    getBase64(file: File, index: number) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve({
          index,
          imageData: reader.result,
          imageTitle: file.name,
        });
        reader.onerror = (error) => reject(error);
      });
    },
    async onImageChange(): Promise<void> {
      const promises = [];
      if (this.img) {
        for (const [index, file] of this.img.entries()) {
          promises.push(this.getBase64(file, index));
        }
        const files = await Promise.all(promises);
        this.$emit('imageFileSelectedInChatForm', files)
      }
    },
  },
});
</script>

<style scoped>
.root {
  background: #36393f;
}

.input-area {
  display: flex;
  width: 100%;
  position: relative;
  background-color: #40444c;
  height: 38px;
}

.file {
  position: absolute;
  z-index: 2;
  top: 2px;
  left: 5px;
}

.text {
  width: 100%;
  height: 100%;
  display: block;
  padding-left: 40px;
  color: white;
}
</style>
