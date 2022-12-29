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
                :color="isTypeSelected(type.type) ? 'grey lighten-1' : 'grey lighten-2'"
                :icon="type.icon"
                :key="type.type"
                :tooltip="`${isTypeSelected(type.type) ? 'Showing' : 'Hiding'} ${type.type}`"
                @click="toggleFilterType(type.type)"
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
        <v-data-table
          :headers="tableHeaders"
          :items="getFilteredNodes"
        >
          <template v-slot:[`item.actions`]="{item}">
            <tooltip-button :to="item.link" icon="mdi-view-dashboard" small :tooltip="`View ${item.type}`" />
          </template>
          <template v-slot:[`item.icon`]="{item}">
            <person-icon :alive="item.icon.alive" :color="item.icon.iconColor" :icon="item.icon.icon" class="mr-2" v-if="item.type === 'Person'" />
            <v-icon v-else>{{ item.icon }}</v-icon>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-col></v-row></v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { toggleArrayValue } from '../scripts/aettbok'

import CardTitle from '../components/common/CardTitle.vue'
import PersonIcon from '../components/persons/PersonIcon.vue'
import TagChips from '../components/tags/TagChips.vue'
import TagEditor from '../components/tags/TagEditor.vue'
import TooltipButton from '../components/common/TooltipButton.vue'

export default {

  name: 'Tags',

  components: {
    'card-title': CardTitle,
    'person-icon': PersonIcon,
    'tag-chips': TagChips,
    'tag-editor': TagEditor,
    'tooltip-button': TooltipButton,
  },

  data: () => ({

    editingItemId: undefined,
    selectedTags: new Array(),

    filterState: false,
    filterHasName: '',
    filterTypes: ['Documents', 'Events', 'Locations', 'Persons', 'Sources'], 

    filterTypesAllowed: [
      { type: 'Documents', icon: 'mdi-note' },
      { type: 'Events', icon: 'mdi-calendar' },
      { type: 'Locations', icon: 'mdi-map-marker' },
      { type: 'Persons', icon: 'mdi-account' },
      { type: 'Sources', icon: 'mdi-book-multiple' },
    ],

    tableHeaders: [
      { value: 'icon', text: '', sortable: false, align: 'center' },
      { value: 'label', text: 'Label', sortable: true },
      { value: 'details', text: 'Details', sortable: false },
      { value: 'actions', text: 'Actions', sortable: false, align: 'center', width: 55 },
    ],

  }),

  computed: {

    ...mapGetters({
      getLocations: 'getLocations',
      getPersons: 'getPersons',
    }),

    getTaggedLocations() {

      if (!this.filterTypes.includes('Locations')) { return [] }

      return this.getLocations.filter(e => e.tags.some(tag => this.selectedTags.includes(tag))).map(e => { return {
        details: (e.partofResolved || ''),
        icon: 'mdi-map-marker',
        label: (e.location || ''),
        link: `/locations/${e.id}`,
        type: 'Location',
      }})

    },

    getTaggedPersons() {

      if (!this.filterTypes.includes('Persons')) { return [] }

      return this.getPersons.filter(e => e.tags.some(tag => this.selectedTags.includes(tag))).map(e => { return {
        details: `${(e.birthFull || '')} - ${(e.deathFull || '')}`.trim(),
        icon: { alive: e.alive, icon: e.icon, iconColor: e.iconColor },
        label: `${(e.lastname || '')} ${(e.firstname || '')}`.trim(),
        link: `/persons/${e.id}`,
        type: 'Person',
      }})

    },

    getTaggedNodes() {

      return this.getTaggedLocations
        .concat(this.getTaggedPersons)
        .sort((a, b) => (a.label || '').toUpperCase().localeCompare((b.label || '').toUpperCase()))

    },

    getFilteredNodes() {

      return this.getTaggedNodes.filter(e => !this.filterHasName || ((e.label || '').toLowerCase().includes(this.filterHasName.toLowerCase())) || ((e.details || '').toLowerCase().includes(this.filterHasName.toLowerCase())))

    },

    filterSubtitleText()   { return `showing ${this.getFilteredNodes.length} out of ${this.getTaggedNodes.length} entries` }

  },

  methods: {

    upsertItem(id) { return this.editingItemId = id },

    isTypeSelected(type) { return this.filterTypes.includes(type) },

    toggleTag(id) { return toggleArrayValue(id, this.selectedTags) },
    toggleFilterType(type) { return toggleArrayValue(type, this.filterTypes) },

    toggleFilter() {

      this.filterHasName = ''
      this.filterTypes = this.filterTypesAllowed.map(e => e.type)

      return this.filterState = !this.filterState

    },

  }

}
</script>