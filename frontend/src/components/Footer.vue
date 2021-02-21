<template>
  <v-footer app color="transparent" height="72" inset>
    <v-text-field
      v-model="input"
      :disabled="!isShowAnyChannel"
      @keypress.enter="send"
      background-color="grey darken-2"
      dense
      flat
      hide-details
      solo
    ></v-text-field>
  </v-footer>
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
    isShowAnyChannel: Boolean
  },
  methods: {
    send() {
      if (this.input.length !== 0) {
        this.$emit('send', this.input);
        this.input = '';
      }
    },
  },
});
</script>
