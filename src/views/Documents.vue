<template>
  <v-container><v-row><v-col>
    <document-editor :id="editingItemId" @close="upsertItem(undefined)" />
    <v-card>
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
        <v-data-table
          :headers="tableHeaders"
          :items="getFilteredItems"
        >
          <template v-slot:[`item.actions`]="{item}"><tooltip-button @click="upsertItem(item.id)" buttontype="edit" small /></template>
          <template v-slot:[`item.date`]="{item}">{{ item.datelong }}</template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-col></v-row></v-container>
</template>

<script>
import { mapGetters } from 'vuex'

import CardTitle from '../components/common/CardTitle.vue'
import DocumentEditor from '../components/documents/DocumentEditor.vue'
import TooltipButton from '../components/common/TooltipButton.vue'

export default {

  name: 'Documents',

  components: {
    'card-title': CardTitle,
    'document-editor': DocumentEditor,
    'tooltip-button': TooltipButton,
  },

  data: () => ({

    editingItemId: undefined,

    filterState: false,
    filterHasText: '',

    tableHeaders: [
      { value: 'sourcedbytext', text: 'Source', sortable: true },
      { value: 'index', text: 'Document Index', sortable: true },
      { value: 'date', text: 'Date', sortable: true },
      { value: 'actions', text: 'Actions', sortable: false, align: 'center', width: 50 },
    ],

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