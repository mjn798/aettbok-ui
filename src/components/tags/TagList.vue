<template>
    <v-card>
        <tag-editor :id="editingItemId" @close="upsertItem(undefined)" />
        <card-title
            @click="upsertItem(null)"
            actionIcon="mdi-tag-plus"
            actionTooltip="New Tag"
            title="Tags"
        />
        <v-card-text>
            <tag-chips
                :allowEdit="true"
                :allowToggle="true"
                :selected="selected"
                :showSelectedOnly="false"
                @clickEdit="upsertItem"
                @toggle="toggle"
            />
        </v-card-text>
    </v-card>
</template>

<script>
import CardTitle from '../common/CardTitle.vue'
import TagChips from './TagChips.vue'
import TagEditor from './TagEditor.vue'

export default {

  name: 'TagList',

  components: {
      'card-title': CardTitle,
      'tag-chips': TagChips,
      'tag-editor': TagEditor,
  },

  data: () => ({

    editingItemId: undefined,
    selected: new Array(),

  }),

  methods: {

      upsertItem(id) { return this.editingItemId = id },

      toggle(id) { return this.selected.includes(id) ? this.selected.splice(this.selected.findIndex(e => e === id), 1) : this.selected.push(id) },

  }

}
</script>