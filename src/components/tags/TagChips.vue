<template>
    <div>
        <tag-chip
            :active="selected.includes(data.id)"
            :allowEdit="allowEdit && allowToggle"
            :data="data"
            :disabled="!allowToggle"
            :key="data.id"
            @clickEdit="clickEdit"
            @toggle="toggle"
            v-for="data in getFilteredTags"
        />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

import TagChip from './TagChip.vue'

export default {

  name: 'TagChips',

  components: {
      'tag-chip': TagChip,
  },

  props: {
      allowEdit: { type: Boolean, default: false },
      allowToggle: { type: Boolean, default: false },
      selected: { type: Array, default: () => [] },
      showSelectedOnly: { type: Boolean, default: true },
  },

  computed: {

      ...mapGetters({
          getTags: 'getTags',
      }),

      getFilteredTags() { return this.showSelectedOnly && !this.inEditMode ? this.getTags.filter(e => this.selected.includes(e.id)) : this.getTags },

  },

  methods: {

    clickEdit(id) { return this.$emit('clickEdit', id) },
    toggle(id) { return this.$emit('toggle', id) },

  },

}
</script>