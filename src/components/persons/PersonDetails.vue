<template>
    <v-container class="ma-0 pa-0">
        <person-editor :id="editingItemId" @close="upsertItem(undefined)" />
        <document-editor :id="viewingDocument" @close="viewDocument(undefined)" />
        <v-row no-gutters>
            <v-col cols="12">
                <v-card flat>
                    <v-card-title>
                        <person-icon :alive="selectedPerson.alive" :color="selectedPerson.iconColor" :icon="selectedPerson.icon" class="mr-2" />
                        <div class="text-h4">{{ selectedPerson.firstname }} <span style="font-weight: bold; text-transform: uppercase;">{{ selectedPerson.lastname }}</span></div>
                        <v-spacer/>
                        <tooltip-button
                            @click="upsertItem($route.params.id)"
                            icon="mdi-account-edit"
                            tooltip="Edit Person"
                        />
                    </v-card-title>
                    <v-card-text>
                        <div>{{ getBirthDetails }}</div>
                        <div>{{ getDeathDetails }}</div>
                    </v-card-text>
                    <v-card-text>
                        <tag-chips :selected="selectedPerson.tags" />
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row v-if="selectedPerson.documentedby.length">
            <v-col cols="12">
                <v-card>
                    <v-card-title>Related Documents</v-card-title>
                    <v-card-text>
                        <v-chip-group column class="ma-2">
                            <v-chip
                                :key="id"
                                @click="viewDocument(id)"
                                label
                                outlined
                                v-for="id in selectedPerson.documentedby"
                            >
                                {{ getDocumentLabel(id) }}
                            </v-chip>
                        </v-chip-group>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" lg="6"><person-events /></v-col>
            <v-col cols="12" lg="6"><person-family /></v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

import DocumentEditor from '../documents/DocumentEditor.vue'
import PersonEditor from './PersonEditor.vue'
import PersonEvents from './PersonEvents.vue'
import PersonFamily from './PersonFamily.vue'
import PersonIcon from './PersonIcon.vue'
import TagChips from '../tags/TagChips.vue'
import TooltipButton from '../common/TooltipButton.vue'

export default {

  name: 'PersonDetails',

  components: {
    'document-editor': DocumentEditor,
    'person-editor': PersonEditor,
    'person-events': PersonEvents,
    'person-family': PersonFamily,
    'person-icon': PersonIcon,
    'tag-chips': TagChips,
    'tooltip-button': TooltipButton,
  },

  data: () => ({

    editingItemId: undefined,
    viewingDocument: undefined,

  }),

  computed: {

    ...mapGetters({
        getDocument: 'getDocument',
        getLocation: 'getLocation',
        getPerson: 'getPerson',
    }),

    selectedPerson() { return this.getPerson(this.$route.params.id) },

    getBirthDetails() {

        let details = (this.selectedPerson.birthFull || '')

        if (this.selectedPerson.birthLocation) {

            let location = this.getLocation(this.selectedPerson.birthLocation)

            details += ` in ${this.selectedPerson.birthLocationString}${location.partofResolved ? ', ' + location.partofResolved : ''}`

        }

        return details.length ? '* ' + details.trim() : ''

    },

    getDeathDetails() {

        let details = (this.selectedPerson.deathFull || '')

        if (this.selectedPerson.deathLocation) {

            let location = this.getLocation(this.selectedPerson.deathLocation)

            details += ` in ${this.selectedPerson.deathLocationString}${location.partofResolved ? ', ' + location.partofResolved : ''}`

        }

        return details.length ? '+ ' + details.trim() : ''

    },

  },

  methods: {

    upsertItem(id) { return this.editingItemId = id },
    viewDocument(id) { return this.viewingDocument = id },

    getDocumentLabel(id) {
        let document = this.getDocument(id)
        return document.tagLabel ? document.tagLabel : null
    },

  },

}
</script>