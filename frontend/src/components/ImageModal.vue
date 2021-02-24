<template>
  <div class="text-center">
    <v-dialog
      :value="isOpen"
      width="500"
      @click:outside="isOpen = false"
      :overlay-opacity="0.9"
    >
      <v-card>
        <v-img :src="image"></v-img>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    image: String,
    value: Boolean,
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
});
</script>
