<template>
  <v-app v-if="isUserLoggedIn">

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
import Login from './components/common/Login.vue'
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
      isDataProcessed: 'isDataProcessed',
      isUserLoggedIn: 'isUserLoggedIn',
    })

  },

}
</script>