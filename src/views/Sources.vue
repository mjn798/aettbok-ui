<template>
  <v-container><v-row><v-col>
    <source-editor :id="editingItemId" @close="upsertItem(undefined)" />
    <v-card>
      <card-title
        :filterIconState="filterState"
        @click="upsertItem(null)"
        @filter="toggleFilter"
        titletype="source"
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
  </v-col></v-row></v-container>
</template>

<script>
import { mapGetters } from 'vuex'

import CardTitle from '../components/common/CardTitle.vue'
import DataTable from '../components/common/DataTable.vue'
import SourceEditor from '../components/sources/SourceEditor.vue'

export default {

  name: 'Sources',

  components: {
    'card-title': CardTitle,
    'data-table': DataTable,
    'source-editor': SourceEditor,
  },

  data: () => ({

    editingItemId: undefined,

    filterState: false,
    filterHasText: '',

    tableHeaders: ['documentscount', 'source', 'containedintext', 'storedintext', 'actions'],

  }),

  computed: {

    ...mapGetters({
      getSources: 'getSources',
    }),

    getFilteredItems() { return this.getSources.filter(e => !this.filterHasText || (e.source || '').toLowerCase().includes(this.filterHasText.toLowerCase())) || (e.containedintext || '').toLowerCase().includes(this.filterHasText.toLowerCase()) || (e.storedintext || '').toLowerCase().includes(this.filterHasText.toLowerCase()) },

    filterSubtitleText() { return `showing ${this.getFilteredItems.length} out of ${this.getSources.length} entries` }

  },

  methods: {

    upsertItem(id) { return this.editingItemId = id },

    toggleFilter() {

      this.filterHasText = ''

      return this.filterState = !this.filterState

    },

  },

}
</script>