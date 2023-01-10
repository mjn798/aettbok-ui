<template>
  <v-app v-if="getAccessToken !== null">

    <v-app-bar app>
      <main-menu />
    </v-app-bar>
    <v-main>
      <router-view v-if="isDataProcessed"/>
      <dataloader v-else/>
    </v-main>

  </v-app>

  <v-app v-else>
    <login />
  </v-app>

</template>

<script>
import { mapGetters } from 'vuex'

import Dataloader from './views/Dataloader.vue'
import Login from './views/Login.vue'
import MainMenu from './components/common/MainMenu.vue'

export default {

  name: 'Aettbok',

  components: {
    'dataloader': Dataloader,
    'login': Login,
    'main-menu': MainMenu,
  },

  computed: {

    ...mapGetters({
      getAccessToken: 'getAccessToken',
      isDataProcessed: 'isDataProcessed',
    }),

  },

}
</script>