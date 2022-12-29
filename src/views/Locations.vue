<template>
  <v-container>
    <v-row v-if="showDetails">
      <v-col cols="12"><location-details /></v-col>
      <v-col cols="12"><location-sources-documents /></v-col>
      <v-col cols="12"><event-list :locationFilter="getLocationId" /></v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12"><location-list /></v-col>
    </v-row>
  </v-container>
</template>

<script>
import EventList from '../components/events/EventList.vue'
import LocationDetails from '../components/locations/LocationDetails.vue'
import LocationList from '../components/locations/LocationList.vue'
import LocationSourcesDocuments from '../components/locations/LocationSourcesDocuments.vue'

export default {

  name: 'Locations',

  components: {
    'event-list': EventList,
    'location-details': LocationDetails,
    'location-list': LocationList,
    'location-sources-documents': LocationSourcesDocuments,
  },

  computed: {

    showDetails() { return this.$route.params.id ?this.$route.params.id.match(/^\w{22}$/) : false },

    getLocationId() { return this.$route.params.id },

  }

}
</script>