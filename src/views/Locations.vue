<template>
  <div v-if="showDetails">
    <v-row>
      <v-col cols="12"><location-details /></v-col>
      <v-col cols="12"><location-sources-documents /></v-col>
      <v-col cols="12"><events :locationFilter="getLocationPartIds" /></v-col>
    </v-row>
  </div>
  <div v-else>
    <location-list />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import Events from '../views/Events.vue'
import LocationDetails from '../components/locations/LocationDetails.vue'
import LocationList from '../components/locations/LocationList.vue'
import LocationSourcesDocuments from '../components/locations/LocationSourcesDocuments.vue'

export default {

  name: 'Locations',

  components: {
    'events': Events,
    'location-details': LocationDetails,
    'location-list': LocationList,
    'location-sources-documents': LocationSourcesDocuments,
  },

  computed: {

    ...mapGetters({
      getLocation: 'getLocation',
    }),

    showDetails() { return this.$route.params.id ?this.$route.params.id.match(/^\w{22}$/) : false },

    selectedItem() { return this.getLocation(this.$route.params.id) },

    getLocationPartIds() { return [this.selectedItem.id, ...((this.selectedItem.parts || []).map(e => e.id))] },

  }

}
</script>