<template>
  <v-navigation-drawer v-model="drawer" app width="300" :style="darkBackGround">
    <v-sheet
      color="grey lighten-5 mb-5"
      height="50"
      width="100%"
      :elevation="5"
    >
      <h3 class="server-title white--text pl-4">テストサーバー</h3>
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
              @click="showAddChannelModal(category._id)"
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
// import api from '@/api/index';
import { gql } from 'apollo-boost';

const categoriesQuery = {
  query: gql`
    {
      categories {
        _id
        name
        channels {
          _id
          name
        }
      }
    }
  `,
};

export default Vue.extend({
  data() {
    return {
      drawer: null,
      categories: [],
    };
  },
  props: {
    darkBackGround: Object,
  },
  async created() {
    try {
      const response = await this.$apollo.query(categoriesQuery);
      this.categories = response.data.categories;
    } catch (error) {
      console.log(error.message);
    }
  },
  methods: {
    showChat(channelId: string) {
      this.$emit('showChat', channelId);
    },
    showAddChannelModal(categoryId: string) {
      console.log(categoryId);
    },
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
