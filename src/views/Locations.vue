<template>
  <v-container>
    <v-row>
      <v-col cols="12" v-if="showDetails"><location-details /></v-col>
      <v-col cols="12" v-else><location-list /></v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

import LocationDetails from '../components/locations/LocationDetails.vue'
import LocationList from '../components/locations/LocationList.vue'

export default {

  name: 'Locations',

  components: {
    'location-details': LocationDetails,
    'location-list': LocationList,
  },

  computed: {

    ...mapGetters({
      getLocation: 'getLocation',
    }),

    showDetails() { return this.$route.params.id ?this.$route.params.id.match(/^\w{22}$/) : false }

  }

}
</script>