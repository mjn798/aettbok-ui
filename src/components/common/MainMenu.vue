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
        <tooltip-button @click="toggleEditor" class="ma-2" :buttontype="getEditMode" />
        <tooltip-button @click="logout" class="ma-2" buttontype="logout" />
    </v-tabs>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import * as authentication from '../../scripts/authentication'

import TooltipButton from './TooltipButton.vue'

export default {

  name: 'MainMenu',

  components: {
    'tooltip-button': TooltipButton,
  },

  data: () => ({

    menuitems: [
      { text: 'Ættbok',    route: '/' },
      { text: 'Charts',    route: '/charts' },
      { text: 'Documents', route: '/documents' },
      { text: 'Events',    route: '/events' },
      { text: 'Locations', route: '/locations' },
      { text: 'Persons',   route: '/persons' },
      { text: 'Sources',   route: '/sources' },
      { text: 'Tags',      route: '/tags' },
    ],

  }),

  computed: {

    ...mapGetters({
      getRoleIsAdministrator: 'getRoleIsAdministrator',
      getRoleIsEditor: 'getRoleIsEditor',
      isDataLoaded: 'isDataLoaded',
      getAccessToken: 'getAccessToken',
    }),

    getEditMode() { return this.getRoleIsEditor ? 'edit-mode-on' : 'edit-mode-off' },

  },

  methods: {

    ...mapActions({
      setAccessToken: 'setAccessToken',
      toggleRoleIsEditor: 'toggleRoleIsEditor',
    }),

    toggleEditor() {
      console.log(this.getAccessToken)
      return this.toggleRoleIsEditor()
    },

    logout() {

      return authentication.logout()
      .then(() => this.setAccessToken(null))
      .catch(() => console.error('authentication:logout:error', error))

    },

  },

}
</script>