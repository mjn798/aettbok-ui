<template>
  <v-container>
    <v-row>
      <v-col cols="12"><event-list /></v-col>
    </v-row>
  </v-container>
</template>

<script>
import EventList from '../components/events/EventList.vue'

export default {

  name: 'Events',

  components: {
    'event-list': EventList,
  }

}
</script>