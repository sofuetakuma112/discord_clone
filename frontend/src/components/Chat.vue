<template>
  <div class="chat">
    <v-list two-line :style="greyBackGround">
      <template v-for="n in 15">
        <v-list-item :key="n">
          <v-list-item-avatar color="grey darken-1">
            <img src="https://randomuser.me/api/portraits/women/81.jpg" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title class="white--text"
              >Message {{ n }}</v-list-item-title
            >

            <v-list-item-subtitle class="white--text">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil
              repellendus distinctio similique
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider v-if="n !== 6" :key="`divider-${n}`" inset></v-divider>
      </template>
    </v-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    greyBackGround: Object
  },
});
</script>

<style scoped>
.root {
  background-color: #36393f;
}

.chat {
  overflow-y: scroll;
  max-height: 90%;
}
</style>
