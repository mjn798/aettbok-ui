<template>
  <v-container>
    <v-row>
      <v-col cols="12" v-if="showDetails"><person-details /></v-col>
      <v-col cols="12" v-else><person-list /></v-col>
    </v-row>
  </v-container>
</template>

<script>
import PersonDetails from '../components/persons/PersonDetails.vue'
import PersonList from '../components/persons/PersonList.vue'

export default {

  name: 'Persons',

  components: {
    'person-details': PersonDetails,
    'person-list': PersonList,
  },

  computed: {

    showDetails() { return this.$route.params.id ? this.$route.params.id.match(/^\w{22}$/) : false }

  },

}
</script>