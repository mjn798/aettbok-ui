<template>
  <v-card-title>
    <tooltip-button
      :buttontype="getFilterButton"
      @click="clickedFilter"
      v-if="filterIconState !== null"
    />
    {{ getTitletype }}
    <v-spacer />
    <tooltip-button
      :buttontype="`${titletype}-new`"
      @click="clickedAction"
      v-if="getTitletype"
    />
  </v-card-title>
</template>

<script>
import TooltipButton from './TooltipButton.vue'

const titletypes = new Map()

titletypes.set('default', 'n/a')

titletypes.set('document', 'Documents')
titletypes.set('event', 'Events')
titletypes.set('location', 'Locations')
titletypes.set('locationtype', 'Location Types')
titletypes.set('person', 'Persons')
titletypes.set('source', 'Sources')
titletypes.set('tag', 'Tags')

export default {

  name: 'CardTitle',

  components: {
    'tooltip-button': TooltipButton,
  },

  props: {
      filterIconState: { type: Boolean, default: null },
      titletype: { type: String, default: 'default' },
  },

  computed: {

    getFilterButton() { return this.filterIconState ? 'filter-remove' : 'filter-normal' },
    getTitletype() { return titletypes.get(this.titletype) || titletypes.get('default') },

  },

  methods: {

    clickedAction() { return this.$emit('click') },
    clickedFilter() { return this.$emit('filter') },

  }

}
</script>