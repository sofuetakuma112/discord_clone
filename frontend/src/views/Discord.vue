<template>
  <div class="root">
    <Header :greyBackGround="greyBackGround" :channel="channel" />
    <LeftSidebar
      :darkBackGround="darkBackGround"
      :categories="categories"
      @showChat="showChat"
      @openAddChannelModal="openAddChannelModal"
      @openCreateCategoryModal="createCategoryModal = true"
    />
    <RightSidebar :darkBackGround="darkBackGround" />
    <Chat :greyBackGround="greyBackGround" :chats="chats" ref="chatInstance" />
    <Footer @send="send" :isShowAnyChannel="channel.id.length !== 0" />
    <Modal
      v-model="createChannelModal"
      :greyBackGround="greyBackGround"
      @createChannelOrCategory="createChannel"
    >
      <template v-slot:title>テキストチャンネルを作成</template>
      <template v-slot:title-text>テキストチャンネル内</template>
      <template v-slot:text-field-name>チャンネル名</template>
      <template v-slot:create-button-text>チャンネルを作成</template>
    </Modal>
    <Modal
      v-model="createCategoryModal"
      :greyBackGround="greyBackGround"
      :categoryId="selectedCategoryId"
      @createChannelOrCategory="createCategory"
    >
      <template v-slot:title>カテゴリーを作成</template>
      <template v-slot:text-field-name>カテゴリー名</template>
      <template v-slot:create-button-text>カテゴリーを作成</template>
    </Modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Header from '@/components/Header.vue';
import RightSidebar from '@/components/RightSideBar.vue';
import LeftSidebar from '@/components/LeftSideBar.vue';
import Chat from '@/components/Chat.vue';
import Footer from '@/components/Footer.vue';
import Modal from '@/components/Modal.vue';
import * as queries from '@/query/index';
import { io, Socket } from 'socket.io-client';
import * as types from '@/types/index';

type DataType = {
  darkBackGround: types.BackgroundStyle;
  greyBackGround: types.BackgroundStyle;
  channel: types.Channel;
  chats: types.Chat[];
  categories: types.Category[];
  createChannelModal: boolean;
  createCategoryModal: boolean;
  selectedCategoryId: string;
  selectedChannelId: string;
  // socket: Socket | null;
};

export default Vue.extend({
  components: {
    Header,
    RightSidebar,
    LeftSidebar,
    Chat,
    Footer,
    Modal,
  },
  data(): DataType {
    return {
      darkBackGround: {
        background: '#2F3136',
      },
      greyBackGround: {
        background: '#36393f',
      },
      channel: {
        name: '',
        id: '',
        categoryId: '',
      },
      chats: [],
      createChannelModal: false,
      createCategoryModal: false,
      selectedCategoryId: '',
      selectedChannelId: '',
      // socket: null,
      categories: [],
    };
  },
  props: {
    socket: Object,
  },
  computed: {
    refs(): any {
      return this.$refs;
    },
    user(): types.User {
      return this.$store.getters.getUser;
    },
  },
  async created() {
    if (!Object.keys(this.user).length) this.$router.push({ name: 'Login' });
    this.socket.on('latestCategories', (response: any) => {
      const parsedData = JSON.parse(response);
      this.categories = [];
      this.categories = parsedData.data.categories;
    });
    this.socket.on('latestData', (response: any) => {
      const parsedData = JSON.parse(response);
      for (const category of parsedData.data.categories) {
        const selectedChannelNewData = category.channels.find(
          (channel: any) => channel._id === this.selectedChannelId
        );
        if (selectedChannelNewData !== undefined) {
          this.chats = [];
          this.chats = selectedChannelNewData.chats.map((chat: types.Chat) => ({
            ...chat,
            created: this.formDate(new Date(Number(chat.created))),
          }));
          break;
        }
      }
    });

    try {
      const response = await this.$apollo.query(queries.categoriesQuery);
      this.categories = response.data.categories;
    } catch (error) {
      console.log(error.message);
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === 'Discord' && !this.$store.getters.getUser) {
        this.$router.push({ name: 'Login' });
      }
    },
  },
  methods: {
    async showChat(channelId: string) {
      const response = await this.$apollo.query({
        query: queries.channelQuery,
        variables: {
          id: channelId,
        },
      });
      console.log(response);
      const channel = response.data.channel;

      this.selectedChannelId = channel._id;
      this.channel = {
        name: channel.name,
        id: channel._id,
        categoryId: channel.category_id,
      };

      this.chats = channel.chats.map((chat: types.Chat) => ({
        ...chat,
        created: this.formDate(new Date(Number(chat.created))),
      }));
      this.refs.chatInstance.scrollBottom();
    },
    async send(message: string) {
      await this.$apollo.mutate({
        mutation: queries.sendMessageMutation,
        variables: {
          name: this.user.name,
          message,
          channelId: this.channel.id,
          userId: this.user._id,
        },
      });
      this.refs.chatInstance.scrollBottom();
    },
    async createChannel(channelName: string) {
      await this.$apollo.mutate({
        mutation: queries.createNewChannel,
        variables: {
          name: channelName,
          categoryId: this.selectedCategoryId,
        },
      });
    },
    async createCategory(categoryName: string) {
      await this.$apollo.mutate({
        mutation: queries.createNewCategory,
        variables: {
          name: categoryName,
        },
      });
    },
    openAddChannelModal(categoryId: string) {
      this.createChannelModal = true;
      this.selectedCategoryId = categoryId;
    },
    formDate(date: Date) {
      let format = 'YYYY-MM-DD hh:mm';
      format = format.replace(/YYYY/g, String(date.getFullYear()));
      format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
      format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
      format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
      format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
      return format;
    },
  },
});
</script>

<style scoped>
.root {
  height: 100%;
}

.chat {
  overflow-y: scroll;
  max-height: 90vh;
  background: #36393f;
}

::-webkit-scrollbar {
  width: 6px;
}

/*スクロールバーの軌道*/
::-webkit-scrollbar-track {
  border-radius: 10px;
  box-shadow: inset 0 0 6px #202225;
}

/*スクロールバーの動く部分*/
::-webkit-scrollbar-thumb {
  background-color: #202225;
  border-radius: 10px;
}
</style>
