<template>
  <v-app id="inspire">
    <Header :greyBackGround="greyBackGround" :channel="channel" />
    <LeftSidebar :darkBackGround="darkBackGround" @showChat="showChat" />
    <RightSidebar :darkBackGround="darkBackGround" />
    <v-main :style="greyBackGround">
      <Chat :greyBackGround="greyBackGround" :chats="chats" />
    </v-main>
    <Footer @send="send" :isShowAnyChannel="channel.id.length !== 0" />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Header from '@/components/Header.vue';
import RightSidebar from '@/components/RightSideBar.vue';
import LeftSidebar from '@/components/LeftSideBar.vue';
import Chat from '@/components/Chat.vue';
import Footer from '@/components/Footer.vue';
import { gql } from 'apollo-boost';

const channelQuery = gql`
  query getChannel($id: ID!) {
    channel(id: $id) {
      _id
      name
      category_id
      chats {
        _id
        name
        message
        created
        channel_id
      }
    }
  }
`;

const sendMessageMutation = gql`
  mutation addChat($name: String!, $message: String!, $channelId: ID!) {
    addChat(name: $name, message: $message, channel_id: $channelId) {
      _id
      name
      message
      created
      channel_id
    }
  }
`;

export default Vue.extend({
  components: {
    Header,
    RightSidebar,
    LeftSidebar,
    Chat,
    Footer,
  },
  data() {
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
    };
  },
  methods: {
    async showChat(channelId: string) {
      const response = await this.$apollo.query({
        query: channelQuery,
        variables: {
          id: channelId,
        },
      });
      const channel = response.data.channel;

      this.channel = {
        name: channel.name,
        id: channel._id,
        categoryId: channel.category_id,
      };

      this.chats = channel.chats.map((chat) => ({
        ...chat,
        created: new Date(chat.created / 1000),
      }));
    },
    async send(message: string) {
      console.log('send!');
      const addedChat = await this.$apollo.mutate({
        mutation: sendMessageMutation,
        variables: {
          name: 'Sofue',
          message,
          channelId: this.channel.id,
        },
      });
      this.chats.push(addedChat.data.addChat);
    },
  },
});
</script>

<style scoped>
.chat {
  overflow-y: scroll;
  max-height: 90vh;
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
