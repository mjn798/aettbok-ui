<template>
  <v-card-title>
    <tooltip-button
      :icon="getFilterIcon"
      :tooltip="getFilterTooltip"
      @click="clickedFilter"
      v-if="filterIconState !== null"
    />
    {{ getTitletype.title }}
    <v-spacer />
    <tooltip-button
      :icon="getTitletype.icon"
      :tooltip="getTitletype.tooltip"
      @click="clickedAction"
      v-if="getTitletype"
    />
  </v-card-title>
</template>

<script>
import TooltipButton from './TooltipButton.vue'

const titletypes = new Map()
titletypes.set('document', { title: 'Documents', icon: 'mdi-note-plus', tooltip: 'New Document' })
titletypes.set('event', { title: 'Events', icon: 'mdi-calendar-plus', tooltip: 'New Event' })
titletypes.set('location', { title: 'Locations', icon: 'mdi-map-marker-plus', tooltip: 'New Location' })
titletypes.set('locationtype', { title: 'Location Types', icon: 'mdi-home-plus', tooltip: 'New Location Type' })
titletypes.set('person', { title: 'Persons', icon: 'mdi-account-plus', tooltip: 'New Person' })
titletypes.set('source', { title: 'Sources', icon: 'mdi-book-plus-multiple', tooltip: 'New Source' })
titletypes.set('tag', { title: 'Tags', icon: 'mdi-tag-plus', tooltip: 'New Tag' })

export default {

  name: 'CardTitle',

  components: {
    'tooltip-button': TooltipButton,
  },

  props: {
      filterIconState: { type: Boolean, default: null },
      titletype: { type: String, default: null },
  },

  computed: {

    getTitletype() { return titletypes.get(this.titletype) || { title: 'n/a' } },

    getFilterIcon() { return this.filterIconState ? 'mdi-filter-variant-remove' : 'mdi-filter-variant' },
    getFilterTooltip() { return this.filterIconState ? 'Remove Filter' : 'Apply Filter' }

  },

  methods: {

    clickedAction() { return this.$emit('click') },
    clickedFilter() { return this.$emit('filter') },

  }

}
</script>