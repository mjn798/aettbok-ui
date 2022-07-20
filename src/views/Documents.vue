<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6"><source-list /></v-col>
      <v-col cols="12" md="6"><document-list /></v-col>
    </v-row>
  </v-container>
</template>

<script>
import DocumentList from '../components/documents/DocumentList.vue'
import SourceList from '../components/documents/SourceList.vue'

export default {

  name: 'Documents',

  components: {
    'document-list': DocumentList,
    'source-list': SourceList,
  },

}
</script>