<template>
  <v-container>
    <v-row>
      <v-col cols="12"><tag-list /></v-col>
    </v-row>
  </v-container>
</template>

<script>
import TagList from '../components/tags/TagList.vue'

export default {

  name: 'Tags',

  components: {
    'tag-list': TagList,
  },

}
</script>