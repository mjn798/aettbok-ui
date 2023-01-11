<template>
  <v-progress-linear
    :buffer-value="getLoadedPercentage"
    :value="getProcessedPercentage"
    class="mt-2"
    height="6"
    stream
    v-if="getAccessToken !== null && getProcessedPercentage !== 100"
  />
  <div class="mt-2" style="height:6px" v-else />
</template>

<script>
import { mapGetters } from 'vuex'
import { processResource } from '../scripts/aettbok'

export default {

  name: 'Dataloader',

  computed: {

    ...mapGetters({
      getAccessToken: 'getAccessToken',
      getLoadingStatus: 'getLoadingStatus',
      getProcessingStatus: 'getProcessingStatus',
    }),

    getLoadedPercentage() { return Math.round(this.getLoadingStatus.loaded / this.getLoadingStatus.total * 100) },
    getProcessedPercentage() { return Math.round(this.getProcessingStatus.loaded / this.getProcessingStatus.total * 100) },

  },

  watch: {

    getLoadedPercentage: {
      handler(value) {
        
        // monitor when all data sources are loaded, then start processing

        if (value === 100) {

          processResource('Document')
          processResource('Event')
          processResource('Location')
          processResource('LocationType')
          processResource('Person')
          processResource('Source')
          processResource('Tag')

        }

      },
      deep: true,
      immediate: true,
    },

  },

}
</script>