<template>
  <v-app>
    <v-app-bar app>
      <main-menu />
    </v-app-bar>
    <v-main>
      <dataloader />
      <v-container><v-row><v-col>
        <router-view />
      </v-col></v-row></v-container>
    </v-main>
  </v-app>
</template>

<script>
import Dataloader from './views/Dataloader.vue'
import MainMenu from './components/common/MainMenu.vue'

export default {

  name: 'Aettbok',

  components: {
    'dataloader': Dataloader,
    'main-menu': MainMenu,
  },

}
</script>