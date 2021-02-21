<template>
  <v-app id="inspire">
    <Header :greyBackGround="greyBackGround" />
    <LeftSidebar :darkBackGround="darkBackGround" />
    <RightSidebar :darkBackGround="darkBackGround" />
    <v-main :style="greyBackGround">
      <Chat :greyBackGround="greyBackGround" />
    </v-main>
    <Footer />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import Header from '@/components/Header.vue'
import RightSidebar from '@/components/RightSideBar.vue'
import LeftSidebar from '@/components/LeftSideBar.vue'
import Chat from '@/components/Chat.vue'
import Footer from '@/components/Footer.vue'

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
    };
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
