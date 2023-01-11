<template>
  <v-app>
    <v-app-bar app>
      <main-menu />
    </v-app-bar>
    <v-main>
      <dataloader />
      <v-container><v-row><v-col>
        <router-view v-if="isDataProcessed" />
      </v-col></v-row></v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'

import Dataloader from './views/Dataloader.vue'
import MainMenu from './components/common/MainMenu.vue'

export default {

  name: 'Aettbok',

  components: {
    'dataloader': Dataloader,
    'main-menu': MainMenu,
  },

  computed: {

    ...mapGetters({
      isDataProcessed: 'isDataProcessed',
    })

  },

}
</script>