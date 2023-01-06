<template>
    <div>
        <tag-chip
            :active="selected.includes(item.id)"
            :allowEdit="allowEdit && allowToggle"
            :data="item"
            :disabled="!allowToggle"
            :key="item.id"
            @click="click"
            @close="close"
            v-for="item in getFilteredItems"
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

      getFilteredItems() { return this.showSelectedOnly ? this.getTags.filter(e => this.selected.includes(e.id)) : this.getTags },

  },

  methods: {

    click(id) { return this.$emit('click', id) },
    close(id) { return this.$emit('close', id) },

  },

}
</script>