<template>
  <v-card-title>
    <tooltip-button
      :icon="getFilterIcon"
      :tooltip="getFilterTooltip"
      @click="clickedFilter"
      v-if="filterIconState !== null"
    />
    {{ title }}
    <v-spacer />
    <tooltip-button
      :icon="actionIcon"
      :tooltip="actionTooltip"
      @click="clickedAction"
      v-if="actionIcon"
    />
  </v-card-title>
</template>

<script>
import TooltipButton from './TooltipButton.vue'

export default {

  name: 'CardTitle',

  components: {
    'tooltip-button': TooltipButton,
  },

  props: {
      actionIcon: { type: String },
      actionTooltip: { type: String },
      filterIconState: { type: Boolean, default: null },
      title: { type: String, default: null },
  },

  computed: {

    getFilterIcon() { return this.filterIconState ? 'mdi-filter-variant-remove' : 'mdi-filter-variant' },
    getFilterTooltip() { return this.filterIconState ? 'Remove Filter' : 'Apply Filter' }

  },

  methods: {

    clickedAction() { return this.$emit('click') },
    clickedFilter() { return this.$emit('filter') },

  }

}
</script>