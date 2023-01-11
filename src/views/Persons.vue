<template>
  <div v-if="showDetails">
    <v-row>
      <v-col cols="12"><person-details /></v-col>
      <v-col cols="12" md="6"><person-events /></v-col>
      <v-col cols="12" md="6"><person-family /></v-col>
    </v-row>
  </div>
  <div v-else>
    <person-list/>
  </div>
</template>

<script>
import PersonDetails from '../components/persons/PersonDetails.vue'
import PersonEvents from '../components/persons/PersonEvents.vue'
import PersonFamily from '../components/persons/PersonFamily.vue'
import PersonList from '../components/persons/PersonList.vue'

export default {

  name: 'Persons',

  components: {
    'person-details': PersonDetails,
    'person-events': PersonEvents,
    'person-family': PersonFamily,
    'person-list': PersonList,
  },

  computed: {

    showDetails() { return this.$route.params.id ? this.$route.params.id.match(/^\w{22}$/) : false }

  },

}
</script>