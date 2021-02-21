<template>
  <v-app-bar
    app
    clipped-right
    flat
    height="50"
    :style="greyBackGround"
    :elevation="5"
  >
    <h2 class="white--text">{{ channel.name }}</h2>
    <v-spacer></v-spacer>

    <v-responsive max-width="156">
      <v-text-field
        dense
        flat
        hide-details
        rounded
        solo-inverted
      ></v-text-field>
    </v-responsive>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    greyBackGround: Object,
    channel: Object,
  },
});
</script>
