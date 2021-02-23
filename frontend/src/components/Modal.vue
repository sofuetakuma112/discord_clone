<template>
  <div class="text-center">
    <v-dialog :value="isOpen" width="440" :overlay-opacity="0.9" persistent>
      <v-card style="background: #36393F">
        <v-card-title class="pt-5">
          <h3 class="modal-title">
            <slot name="title"></slot>
          </h3>
          <p class="modal-text"><slot name="title-text"></slot></p>
        </v-card-title>

        <div class="px-4">
          <span class="text-field-name"
            ><slot name="text-field-name"></slot
          ></span>
          <v-text-field label="Solo" solo v-model="input"></v-text-field>
        </div>

        <v-divider></v-divider>

        <v-card-actions style="background: #2F3136">
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="isOpen = false">
            キャンセル
          </v-btn>
          <v-btn color="primary" text @click="createChannelOrCategory">
            <slot name="create-button-text"></slot>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      input: '',
    };
  },
  props: {
    value: Boolean,
    greyBackGround: Object,
  },
  computed: {
    isOpen: {
      get(): boolean {
        return this.value;
      },
      set(bool: boolean): void {
        this.$emit('input', bool);
      },
    },
  },
  methods: {
    createChannelOrCategory() {
      this.$emit('createChannelOrCategory', this.input)
      this.input = '';
      this.isOpen = false;
    },
  },
});
</script>

<style scoped>
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
</style>
