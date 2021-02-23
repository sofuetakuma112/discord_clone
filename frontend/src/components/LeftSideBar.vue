<template>
  <v-navigation-drawer v-model="drawer" app width="300" :style="darkBackGround">
    <v-sheet
      color="grey lighten-5 mb-5"
      height="50"
      width="100%"
      :elevation="5"
    >
      <v-row class="server-title-row" no-gutters justify="space-between">
        <h3 class="server-title white--text pl-4">テストサーバー</h3>
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              :elevation="0"
              color="#2f3136"
              height="50"
            >
              <v-icon color="white" medium>mdi-plus</v-icon>
            </v-btn>
          </template>
          <v-list class="pa-0">
            <v-list-item @click="createNewCategory">
              <v-list-item-title
                >カテゴリーを新規作成</v-list-item-title
              >
            </v-list-item>
          </v-list>
        </v-menu>
      </v-row>
    </v-sheet>
    <v-row dense justify="center" :style="darkBackGround">
      <v-expansion-panels focusable flat accordion>
        <v-expansion-panel v-for="category in categories" :key="category._id">
          <v-expansion-panel-header
            class="px-4 grey--text"
            :style="darkBackGround"
            hide-actions
          >
            <span class="category-title">{{ category.name }}</span>
            <v-icon
              color="grey"
              medium
              @click.stop="openAddChannelModal(category._id)"
              >mdi-plus</v-icon
            >
          </v-expansion-panel-header>
          <v-expansion-panel-content :style="darkBackGround">
            <v-list-item
              v-for="channel in category.channels"
              :key="channel._id"
              link
              @click="showChat(channel._id)"
            >
              <v-list-item-content>
                <v-list-item-title class="grey--text">{{
                  channel.name
                }}</v-list-item-title>
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
    };
  },
  props: {
    darkBackGround: Object,
    categories: Array,
  },
  methods: {
    showChat(channelId: string) {
      this.$emit('showChat', channelId);
    },
    openAddChannelModal(categoryId: string) {
      this.$emit('openAddChannelModal', categoryId);
    },
    createNewCategory() {
      this.$emit('openCreateCategoryModal');
    },
  },
});
</script>

<style scoped>
.category-title {
  width: 100%;
}

.server-title {
  height: 100%;
  line-height: 50px;
}

.server-title-row {
  background: #2f3136;
}
</style>
