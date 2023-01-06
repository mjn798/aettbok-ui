<template>
  <v-container><v-row><v-col>
    <v-card>
      <tag-editor :id="editingItemId" @close="upsertItem(undefined)" />
      <card-title
        :filterIconState="filterState"
        @click="upsertItem(null)"
        @filter="toggleFilter"
        titletype="tag"
      />
      <v-card-text>
        <v-expand-transition>
          <v-card v-if="filterState">
            <v-card-title>
              <tooltip-button
                :buttontype="`${isTypeSelected(type) ? 'showing' : 'hiding'}-${type}`"
                :key="type"
                @click="toggleFilterType(type)"
                v-for="type in filterTypesAllowed"
              />
              <v-spacer/>
              <v-text-field
                  class="ma-2"
                  clearable
                  dense
                  hide-details
                  label="Search"
                  outlined
                  prepend-inner-icon="mdi-magnify"
                  v-model="filterHasName"
              />
            </v-card-title>
            <v-card-subtitle>{{ filterSubtitleText }}</v-card-subtitle>
          </v-card>
        </v-expand-transition>
      </v-card-text>
      <v-card-text>
        <tag-chips
          :allowEdit="true"
          :allowToggle="true"
          :selected="selectedTags"
          :showSelectedOnly="false"
          @close="upsertItem"
          @click="toggleTag"
        />
      </v-card-text>
      <v-card-text>
        <data-table
          :headers="tableHeaders"
          :items="getFilteredItems"
        />
      </v-card-text>
    </v-card>
  </v-col></v-row></v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { compareStrings, toggleArrayValue } from '../scripts/aettbok'

import CardTitle from '../components/common/CardTitle.vue'
import DataTable from '../components/common/DataTable.vue'
import TagChips from '../components/tags/TagChips.vue'
import TagEditor from '../components/tags/TagEditor.vue'
import TooltipButton from '../components/common/TooltipButton.vue'

export default {

  name: 'Tags',

  components: {
    'card-title': CardTitle,
    'data-table': DataTable,
    'tag-chips': TagChips,
    'tag-editor': TagEditor,
    'tooltip-button': TooltipButton,
  },

  data: () => ({

    editingItemId: undefined,
    selectedTags: new Array(),

    filterState: false,
    filterHasName: '',
    filterTypes: ['documents', 'events', 'locations', 'persons', 'sources'], 

    filterTypesAllowed: ['documents', 'events', 'locations', 'persons', 'sources'],

    tableHeaders: ['tagtype', 'taglabel', 'tagdetails'],

  }),

  computed: {

    ...mapGetters({
      getDocuments: 'getDocuments',
      getEvents: 'getEvents',
      getLocations: 'getLocations',
      getPersons: 'getPersons',
      getSources: 'getSources',
    }),

    getTaggedDocuments() {

      if (!this.filterTypes.includes('documents')) { return [] }

      return this.getDocuments.filter(e => e.tags.some(tag => this.selectedTags.includes(tag))).map(e => { return {
        icon: 'document',
        id: e.id,
        tagdetails: (e.datelong || ''),
        taglabel: `${e.sourcedbytext} ${e.index}`.trim(),
        tagtype: 'document',
      }})

    },

    getTaggedEvents() {

      if (!this.filterTypes.includes('events')) { return [] }

      return this.getEvents.filter(e => e.tags.some(tag => this.selectedTags.includes(tag))).map(e => { return {
        icon: 'event',
        id: e.id,
        tagdetails: '',
        taglabel: `${e.typetext || ''} ${e.attendedtext || ''} ${e.datelong || ''}`.trim(),
        tagtype: 'event',
      }})

    },

    getTaggedLocations() {

      if (!this.filterTypes.includes('locations')) { return [] }

      return this.getLocations.filter(e => e.tags.some(tag => this.selectedTags.includes(tag))).map(e => { return {
        icon: 'location',
        id: e.id,
        tagdetails: (e.partofresolved || ''),
        taglabel: (e.location || ''),
        tagtype: 'location',
      }})

    },

    getTaggedPersons() {

      if (!this.filterTypes.includes('persons')) { return [] }

      return this.getPersons.filter(e => e.tags.some(tag => this.selectedTags.includes(tag))).map(e => { return {
        icon: `person-${e.gender || 'u'}${e.alive ? 'a' : 'd'}`,
        id: e.id,
        tagdetails: `${(e.datebirthlong || '')} • ${(e.datedeathlong || '')}`.trim(),
        taglabel: `${e.firstname || ''} ${e.lastname || ''}`.trim(),
        tagtype: 'person',
      }})

    },

    getTaggedSources() {

      if (!this.filterTypes.includes('sources')) { return [] }

      return this.getSources.filter(e => e.tags.some(tag => this.selectedTags.includes(tag))).map(e => { return {
        icon: 'source',
        id: e.id,
        tagdetails: `${e.containedintext || ''} - ${e.storedintext || ''}`.trim(),
        taglabel: (e.source || '').trim(),
        tagtype: 'source',
      }})

    },

    getTaggedNodes() {

      return []
        .concat(this.getTaggedDocuments)
        .concat(this.getTaggedEvents)
        .concat(this.getTaggedLocations)
        .concat(this.getTaggedPersons)
        .concat(this.getTaggedSources)
        .sort((a, b) => compareStrings(a.tagdetails, b.tagdetails))
        .sort((a, b) => compareStrings(a.taglabel, b.taglabel))

    },

    getFilteredItems() { return this.getTaggedNodes.filter(e => !this.filterHasName || ((e.taglabel || '').toLowerCase().includes(this.filterHasName.toLowerCase())) || ((e.tagdetails || '').toLowerCase().includes(this.filterHasName.toLowerCase()))) },

    filterSubtitleText()   { return `showing ${this.getFilteredItems.length} out of ${this.getTaggedNodes.length} entries` }

  },

  methods: {

    upsertItem(id) { return this.editingItemId = id },

    isTypeSelected(type) { return this.filterTypes.includes(type) },

    toggleTag(id) { return toggleArrayValue(id, this.selectedTags) },
    toggleFilterType(type) { return toggleArrayValue(type, this.filterTypes) },

    toggleFilter() {

      this.filterHasName = ''
      this.filterTypes = this.filterTypesAllowed.map(e => e)

      return this.filterState = !this.filterState

    },

  }

}
</script>