<template>
  <v-navigation-drawer v-model="drawer" app width="300" :style="darkBackGround">
    <v-sheet
      color="grey lighten-5 mb-5"
      height="50"
      width="100%"
      :elevation="5"
    >
      <h3 class="server-title white--text pl-4">サーバー名</h3>
    </v-sheet>
    <v-row dense justify="center" :style="darkBackGround">
      <v-expansion-panels focusable flat accordion>
        <v-expansion-panel v-for="(item, i) in 1" :key="i">
          <v-expansion-panel-header
            class="px-4 grey--text"
            :style="darkBackGround"
            hide-actions
          >
            <span class="category-title">Item</span>
            <v-icon color="grey" medium>mdi-plus</v-icon>
          </v-expansion-panel-header>
          <v-expansion-panel-content :style="darkBackGround">
            <v-list-item v-for="n in 5" :key="n" link>
              <v-list-item-content>
                <v-list-item-title class="grey--text"
                  >Item {{ n }}</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
    <v-list shaped></v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  data() {
    return {
      drawer: null,
    }
  },
  props: {
    darkBackGround: Object,
  },
});
</script>

<style scoped>
.category-title {
  width: 100%;
}

.server-title {
  background: #2f3136;
  height: 100%;
  line-height: 50px;
}
</style>
