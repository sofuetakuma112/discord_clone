<template>
  <div class="text-center">
    <v-dialog :value="isOpen" :width="width" :overlay-opacity="0.9" persistent>
      <v-card style="background: #36393F" class="v-card">
        <slot name="content"></slot>
        <slot name="title"></slot>
        <slot name="img"></slot>
        <slot name="img-name"></slot>
        <slot name="text-field-name"></slot>
        <v-divider></v-divider>
        <v-card-actions style="background: #2F3136; height: 70px">
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="isOpen = false">
            キャンセル
          </v-btn>
          <v-btn
            color="#fff"
            text
            @click="clickedModalOKButton"
            class="button"
            :class="{ danger: danger }"
          >
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
    width: { type: Number, default: 440 },
    danger: { type: Boolean, default: false },
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
    clickedModalOKButton() {
      this.$emit('clickedModalOKButton', this.input);
      this.input = '';
      this.isOpen = false;
    },
  },
});
</script>

<style scoped>
.button {
  background-color: #7289da;
}

.danger {
  background-color: #d84040;
}
</style>

<style>
.v-dialog.v-dialog--active.v-dialog--persistent {
  overflow-y: visible !important;
}
</style>
