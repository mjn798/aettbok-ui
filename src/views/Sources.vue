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
        <v-data-table :headers="tableHeaders" :items="getFilteredItems">
          <template v-slot:[`item.actions`]="{item}"><tooltip-button @click="upsertItem(item.id)" buttontype="edit" small /></template>
          <template v-slot:[`item.numberOfDocuments`]="{item}"><document-viewer :listofids="item.documents" v-if="item.documents.length" /></template>
          <template v-slot:[`item.storedinString`]="{item}"><location-chip :id="item.storedin" v-if="item.storedin" /></template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-col></v-row></v-container>
</template>

<script>
import { mapGetters } from 'vuex'

import CardTitle from '../components/common/CardTitle.vue'
import DocumentViewer from '../components/documents/DocumentViewer.vue'
import LocationChip from '../components/locations/LocationChip.vue'
import SourceEditor from '../components/sources/SourceEditor.vue'
import TooltipButton from '../components/common/TooltipButton.vue'

export default {

  name: 'Sources',

  components: {
    'card-title': CardTitle,
    'document-viewer': DocumentViewer,
    'location-chip': LocationChip,
    'source-editor': SourceEditor,
    'tooltip-button': TooltipButton,
  },

  data: () => ({

    editingItemId: undefined,

    filterState: false,
    filterHasText: '',

    tableHeaders: [
      { value: 'numberOfDocuments', text: '', sortable: true, width: 50 },
      { value: 'source', text: 'Source', sortable: true },
      { value: 'containedin', text: 'Contained in', sortable: true },
      { value: 'storedinString', text: 'Stored in', sortable: true },
      { value: 'actions', text: 'Actions', sortable: false, align: 'center', width: 50 },
    ]

  }),

  computed: {

    ...mapGetters({
      getLocation: 'getLocation',
      getSources: 'getSources',
    }),

    getFilteredItems() { return this.getSources.filter(e => !this.filterHasText || (e.source || '').toLowerCase().includes(this.filterHasText.toLowerCase())) || (e.storedinString || '').toLowerCase().includes(this.filterHasText.toLowerCase()) },

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