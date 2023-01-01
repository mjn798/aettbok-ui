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
          @clickEdit="upsertItem"
          @toggle="toggleTag"
        />
      </v-card-text>
      <v-card-text>
        <v-data-table :headers="tableHeaders" :items="getFilteredItems">
          <template v-slot:[`item.type`]="{item}"><icon :icontype="item.icon" /></template>
          <template v-slot:[`item.label`]="{item}">
            <location-chip :id="item.id" v-if="item.id && item.type === 'location'" />
            <person-chip :id="item.id" islink v-if="item.id && item.type === 'person'" />
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-col></v-row></v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { compareStrings, toggleArrayValue } from '../scripts/aettbok'

import CardTitle from '../components/common/CardTitle.vue'
import Icon from '../components/common/Icon.vue'
import LocationChip from '../components/locations/LocationChip.vue'
import PersonChip from '../components/persons/PersonChip.vue'
import TagChips from '../components/tags/TagChips.vue'
import TagEditor from '../components/tags/TagEditor.vue'
import TooltipButton from '../components/common/TooltipButton.vue'

export default {

  name: 'Tags',

  components: {
    'card-title': CardTitle,
    'icon': Icon,
    'location-chip': LocationChip,
    'person-chip': PersonChip,
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

    tableHeaders: [
      { value: 'type', text: '', sortable: true, align: 'center', width: 50 },
      { value: 'label', text: 'Label', sortable: true },
      { value: 'details', text: 'Details', sortable: false },
    ],

  }),

  computed: {

    ...mapGetters({
      getLocations: 'getLocations',
      getPersons: 'getPersons',
    }),

    getTaggedLocations() {

      if (!this.filterTypes.includes('locations')) { return [] }

      return this.getLocations.filter(e => e.tags.some(tag => this.selectedTags.includes(tag))).map(e => { return {
        details: (e.partofresolved || ''),
        icon: 'location',
        id: e.id,
        label: (e.location || ''),
        type: 'location',
      }})

    },

    getTaggedPersons() {

      if (!this.filterTypes.includes('persons')) { return [] }

      return this.getPersons.filter(e => e.tags.some(tag => this.selectedTags.includes(tag))).map(e => { return {
        details: `${(e.datebirthlong || '')} • ${(e.datedeathlong || '')}`.trim(),
        icon: `person-${e.gender || 'u'}${e.alive ? 'a' : 'd'}`,
        id: e.id,
        label: `${e.firstname || ''} ${e.lastname || ''}`.trim(),
        type: 'person',
      }})

    },

    getTaggedNodes() {

      return []
        .concat(this.getTaggedLocations)
        .concat(this.getTaggedPersons)
        .sort((a, b) => compareStrings(a.label, b.label))

    },

    getFilteredItems() { return this.getTaggedNodes.filter(e => !this.filterHasName || ((e.label || '').toLowerCase().includes(this.filterHasName.toLowerCase())) || ((e.details || '').toLowerCase().includes(this.filterHasName.toLowerCase()))) },

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