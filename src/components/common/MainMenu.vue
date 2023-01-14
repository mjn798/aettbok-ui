<template>
  <v-tabs>
    <v-tab
      :disabled="!getMenuItemVisibility"
      :key="item.text"
      :to="item.route"
      v-for="item in getMenuItems"
    >
      {{ item.text }}
    </v-tab>
    <v-spacer />
    <v-tab v-if="getAccessToken === null">
      <tooltip-button class="ma-2" buttontype="login" to="/login" />
    </v-tab>
    <div class="d-flex align-center" v-else>
      <tooltip-button @click="toggleEditor" class="ma-2" :buttontype="getEditMode" v-if="isShowingEditButton" />
      <tooltip-button @click="logout" class="ma-2" buttontype="logout" />
    </div>
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

    menuItems: [
      { requiresLogin: false, text: 'Ættbok',    route: '/' },
      { requiresLogin: false, text: 'Charts',    route: '/charts' },
      { requiresLogin: true,  text: 'Documents', route: '/documents' },
      { requiresLogin: true,  text: 'Events',    route: '/events' },
      { requiresLogin: true,  text: 'Locations', route: '/locations' },
      { requiresLogin: true,  text: 'Persons',   route: '/persons' },
      { requiresLogin: true,  text: 'Sources',   route: '/sources' },
      { requiresLogin: true,  text: 'Tags',      route: '/tags' },
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

    getMenuItems() { return this.menuItems.filter(e => this.getMenuItemVisibility(e))},

    isShowingEditButton() {

      if (this.$route.path === '/') { return false }

      let item = this.menuItems.find(e => this.$route.path.startsWith(e.route) && e.route !== '/')

      return item ? item.requiresLogin : false

    }

  },

  methods: {

    ...mapActions({
      setAccessToken: 'setAccessToken',
      toggleRoleIsEditor: 'toggleRoleIsEditor',
    }),

    getMenuItemVisibility(item) { return !item.requiresLogin || (this.getAccessToken !== null) },

    toggleEditor() { return this.toggleRoleIsEditor() },

    logout() {

      return authentication.logout()
      .finally(() => {
        if (this.$route.path !== '/') { return this.$router.push('/') }
      })

    },

  },

}
</script>