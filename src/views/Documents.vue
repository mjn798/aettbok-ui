<template>
  <v-card>
    <document-editor :id="editingItemId" @close="upsertItem(undefined)" />
    <card-title
      :filterIconState="filterState"
      @click="upsertItem(null)"
      @filter="toggleFilter"
      titletype="document"
    />
    <v-card-text>
      <v-expand-transition>
        <v-card v-if="filterState">
          <v-card-title>
            <v-text-field
              class="ma-2"
              clearable
              dense
              hide-details
              label="Search"
              outlined
              prepend-inner-icon="mdi-magnify"
              v-model="filterHasText"
            />
          </v-card-title>
          <v-card-subtitle>{{ filterSubtitleText }}</v-card-subtitle>
        </v-card>
      </v-expand-transition>
    </v-card-text>
    <v-card-text>
      <data-table
        :headers="tableHeaders"
        :items="getFilteredItems"
        @edit="upsertItem"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

import CardTitle from '../components/common/CardTitle.vue'
import DataTable from '../components/common/DataTable.vue'
import DocumentEditor from '../components/documents/DocumentEditor.vue'

export default {

  name: 'Documents',

  components: {
    'card-title': CardTitle,
    'data-table': DataTable,
    'document-editor': DocumentEditor,
  },

  data: () => ({

    editingItemId: undefined,

    filterState: false,
    filterHasText: '',

    tableHeaders: ['sourcedbytext', 'index', 'date', 'events', 'actions'],

  }),

  computed: {

    ...mapGetters({
      getDocuments: 'getDocuments',
    }),

    getFilteredItems() { return this.getDocuments.filter(e => !this.filterHasText || (e.index || '').toLowerCase().includes(this.filterHasText.toLowerCase())  || (e.sourcedbytext || '').toLowerCase().includes(this.filterHasText.toLowerCase())) },

    filterSubtitleText() { return `showing ${this.getFilteredItems.length} out of ${this.getDocuments.length} entries` }

  },

  methods: {

    upsertItem(id) { return this.editingItemId = id },

    toggleFilter() {

      this.filterHasText = ''

      return this.filterState = !this.filterState

    }

  },

}
</script>