<template>
    <v-tabs>
        <v-tab
          :disabled="!isDataLoaded"
          :key="item.text"
          :to="item.route"
          v-for="item in menuitems"
        >
          {{ item.text }}
        </v-tab>
        <v-spacer/>
        <v-menu bottom left v-if="isDataLoaded">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="ma-2"
              icon
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-btn @click="logout" depressed text>Logout</v-btn>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
    </v-tabs>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import * as authentication from '../../scripts/authentication'

export default {

  name: 'MainMenu',

  data: () => ({

    menuitems: [
      { text: 'Ættbok',    route: '/' },
      { text: 'Charts',    route: '/charts' },
      { text: 'Documents', route: '/documents' },
      { text: 'Events',    route: '/events' },
      { text: 'Locations', route: '/locations' },
      { text: 'Persons',   route: '/persons' },
      { text: 'Tags',      route: '/tags' },
    ],

  }),

  computed: {

    ...mapGetters({
      isDataLoaded: 'isDataLoaded'
    }),

  },

  methods: {

    ...mapActions({
      setAccessToken: 'setAccessToken',
    }),

    logout() {

      return authentication.logout()
      .then(() => this.setAccessToken(null))
      .catch(() => console.error('authentication:logout:error', error))

    },

  },

}
</script>