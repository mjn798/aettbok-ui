<template>
    <v-card>
        <person-editor :id="editingItemId" @close="upsertItem(undefined)" />
        <v-card-title>
            <person-icon :alive="selectedPerson.alive" :color="selectedPerson.iconColor" :icon="selectedPerson.icon" class="mr-2" />
            <div>{{ selectedPerson.firstname }} <span class="ml-1" style="font-weight: bold; text-transform: uppercase;">{{ selectedPerson.lastname }}</span></div>
            <v-spacer/>
            <tooltip-button
                @click="upsertItem($route.params.id)"
                icon="mdi-account-edit"
                tooltip="Edit Person"
            />
        </v-card-title>
        <v-card-text>
            <div class="mb-2"><v-icon class="mr-2" color="grey lighten-1" small>mdi-asterisk</v-icon>{{ getDetails('birth') }}</div>
            <div><v-icon class="mr-2" color="grey lighten-1" small>mdi-cross</v-icon>{{ getDetails('death') }}</div>
        </v-card-text>
        <v-card-text v-if="selectedPerson.tags.length"><tag-chips :selected="selectedPerson.tags" /></v-card-text>
        <v-card-text v-if="selectedPerson.documentedby.length"><document-viewer-list :listofids="selectedPerson.documentedby" /></v-card-text>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

import DocumentViewerList from '../documents/DocumentViewerList.vue'
import PersonEditor from './PersonEditor.vue'
import PersonIcon from './PersonIcon.vue'
import TagChips from '../tags/TagChips.vue'
import TooltipButton from '../common/TooltipButton.vue'

export default {

  name: 'PersonDetails',

  components: {
    'document-viewer-list': DocumentViewerList,
    'person-editor': PersonEditor,
    'person-icon': PersonIcon,
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

    selectedPerson() { return this.getPerson(this.$route.params.id) },

  },

  methods: {

    upsertItem(id) { return this.editingItemId = id },

    getDetails(type) {

        let details = this.selectedPerson[`${type}Full`] || ''

        if (this.selectedPerson[`${type}LocationString`]) { details += ' in ' + this.selectedPerson[`${type}LocationString`]}

        return details.trim()

    },

  },

}
</script>