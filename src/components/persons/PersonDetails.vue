<template>
    <v-card>
        <person-editor :id="editingItemId" @close="upsertItem(undefined)" />
        <v-card-title>
            <icon :icontype="getPersonIcon" />
            <div class="ml-2">{{ selectedItem.firstname }}<span class="ml-2" style="font-weight: bold; text-transform: uppercase;">{{ selectedItem.lastname }}</span></div>
            <v-spacer/>
            <tooltip-button @click="upsertItem(selectedItem.id)" buttontype="person-edit" />
        </v-card-title>
        <v-card-text v-if="selectedItem.birthFull || selectedItem.birthLocation || selectedItem.deathFull || selectedItem.deathLocation">
            <div class="mb-2" v-if="selectedItem.birthFull || selectedItem.birthLocation">
              <icon class="mx-1" color="grey lighten-1" icontype="event-birth" small /> {{ getDateLocationText('birth') }} <location-chip :id="selectedItem.birthLocation" v-if="selectedItem.birthLocation" />
            </div>
            <div class="mb-2" v-if="selectedItem.deathFull || selectedItem.deathLocation">
              <icon class="mx-1" color="grey lighten-1" icontype="event-death" small /> {{ getDateLocationText('death') }} <location-chip :id="selectedItem.deathLocation" v-if="selectedItem.deathLocation" />
            </div>
        </v-card-text>
        <v-card-text v-if="selectedItem.tags.length"><tag-chips :selected="selectedItem.tags" /></v-card-text>
        <v-card-text v-if="selectedItem.documentedby.length"><document-viewer-list :listofids="selectedItem.documentedby" /></v-card-text>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

import DocumentViewerList from '../documents/DocumentViewerList.vue'
import Icon from '../common/Icon.vue'
import LocationChip from '../locations/LocationChip.vue'
import PersonEditor from './PersonEditor.vue'
import TagChips from '../tags/TagChips.vue'
import TooltipButton from '../common/TooltipButton.vue'

export default {

  name: 'PersonDetails',

  components: {
    'document-viewer-list': DocumentViewerList,
    'icon': Icon,
    'location-chip': LocationChip,
    'person-editor': PersonEditor,
    'tag-chips': TagChips,
    'tooltip-button': TooltipButton,
  },

  data: () => ({

    editingItemId: undefined,

  }),

  computed: {

    ...mapGetters({
        getPerson: 'getPerson',
    }),

    selectedItem() { return this.getPerson(this.$route.params.id) },

    getPersonIcon() { return `person-${this.selectedItem.gender || 'u'}${this.selectedItem.alive ? 'a' : 'd'}` },

  },

  methods: {

    upsertItem(id) { return this.editingItemId = id },

    getDateLocationText(type) { return ((this.selectedItem[`${type}Full`] || '') + (this.selectedItem[`${type}Location`] ? ' in ' : '')).trim() },

  },

}
</script>