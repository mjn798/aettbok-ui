<template>
  <v-card flat>
    <v-card-text>
      <v-progress-linear
        :buffer-value="getLoadedPercentage"
        :value="getProcessedPercentage"
        stream
      />
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { loadResource, processResource } from '../scripts/aettbok'

export default {

  name: 'Dataloader',

  computed: {

    ...mapGetters({
      getAuthenticationToken: 'getAuthenticationToken',
      getLoadingStatus: 'getLoadingStatus',
      getProcessingStatus: 'getProcessingStatus',
    }),

    getLoadedPercentage() { return Math.round(this.getLoadingStatus.loaded / this.getLoadingStatus.total * 100) },
    getProcessedPercentage() { return Math.round(this.getProcessingStatus.loaded / this.getProcessingStatus.total * 100) },

  },

  mounted() {

    console.debug('Dataloader:start loading')

    loadResource('Document',     this.getAuthenticationToken)
    loadResource('Event',        this.getAuthenticationToken)
    loadResource('Location',     this.getAuthenticationToken)
    loadResource('LocationType', this.getAuthenticationToken)
    loadResource('Person',       this.getAuthenticationToken)
    loadResource('Source',       this.getAuthenticationToken)
    loadResource('Tag',          this.getAuthenticationToken)

  },

  watch: {

    getLoadedPercentage: {
      handler(value) {
        
        // monitor when all data sources are loaded, then start processing

        if (value === 100) {

          console.debug('Dataloader:start processing')

          processResource('Document')
          processResource('Event')
          processResource('Location')
          processResource('LocationType')
          processResource('Person')
          processResource('Source')
          processResource('Tag')

        }

      },
      immediate: true,
    },

  },

}
</script>