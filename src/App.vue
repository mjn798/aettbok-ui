<template>
  <v-app>
    <v-app-bar app>
      <main-menu />
    </v-app-bar>
    <v-main>
      <dataloader />
      <charts-menu v-if="showChartsMenu" />
      <v-container><v-row><v-col>
        <router-view v-if="isDataProcessed || getAccessToken === null" />
      </v-col></v-row></v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'

import ChartsMenu from './components/charts/ChartsMenu.vue'
import Dataloader from './views/Dataloader.vue'
import MainMenu from './components/common/MainMenu.vue'

export default {

  name: 'Aettbok',

  components: {
    'charts-menu': ChartsMenu,
    'dataloader': Dataloader,
    'main-menu': MainMenu,
  },

  computed: {

    ...mapGetters({
      getAccessToken: 'getAccessToken',
      isDataProcessed: 'isDataProcessed',
    }),

    showChartsMenu() { return this.$route.path.startsWith('/charts') }

  },

}
</script>