<template>
    <v-container class="ma-0 pa-0">
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
                    <v-card-text v-if="selectedPerson.documentedby.length">
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
import { getFormattedDate } from '../../scripts/aettbok'

import DocumentEditor from '../documents/DocumentEditor.vue'
import PersonEvents from './PersonEvents.vue'
import PersonFamily from './PersonFamily.vue'
import PersonIcon from './PersonIcon.vue'
import TooltipButton from '../common/TooltipButton.vue'

export default {

  name: 'PersonDetails',

  components: {
    'document-editor': DocumentEditor,
    'person-events': PersonEvents,
    'person-family': PersonFamily,
    'person-icon': PersonIcon,
    'tooltip-button': TooltipButton,
  },

  data: () => ({

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

        let details = ''

        if (this.selectedPerson.birth) { details += getFormattedDate(this.selectedPerson.birthDay, this.selectedPerson.birthMonth, this.selectedPerson.birthYear, 'long') }

        if (this.selectedPerson.birthLocationId) {

            let location = this.getLocation(this.selectedPerson.birthLocationId)

            details += ' in ' + location.location

            if (location.partofResolved) { details += ', ' + location.partofResolved }

        }

        return details.length ? '* ' + details.trim() : ''

    },

    getDeathDetails() {

        let details = ''

        if (this.selectedPerson.death) { details += getFormattedDate(this.selectedPerson.deathDay, this.selectedPerson.deathMonth, this.selectedPerson.deathYear, 'long') }

        if (this.selectedPerson.deathLocationId) {

            let location = this.getLocation(this.selectedPerson.deathLocationId)

            details += ' in ' + location.location

            if (location.partofResolved) { details += ', ' + location.partofResolved }

        }

        return details.length ? '+ ' + details.trim() : ''

    },

  },

  methods: {

    upsertItem(id) { return null },
    viewDocument(id) { return this.viewingDocument = id },

    getDocumentLabel(id) {
        let document = this.getDocument(id)
        return document.tagLabel ? document.tagLabel : null
    },

  },

}
</script>