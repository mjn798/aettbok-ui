<template>
  <v-container>
    <v-row>
      <v-col cols="12"><tag-list @selectionChanged="selectionChanged" /></v-col>
    </v-row>
    <v-row>
      <v-col cols="12"><tag-details :selected="selected" /></v-col>
    </v-row>
  </v-container>
</template>

<script>
import TagDetails from '../components/tags/TagDetails.vue'
import TagList from '../components/tags/TagList.vue'

export default {

  name: 'Tags',

  components: {
    'tag-details': TagDetails,
    'tag-list': TagList,
  },

  data: () => ({
    selected: []
  }),

  methods: {

    selectionChanged(selected) { return this.selected = selected }

  }

}
</script>