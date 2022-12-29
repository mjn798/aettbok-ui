<template>
    <v-card>
        <event-editor :id="editingItemId" @close="upsertItem(undefined)" />
        <document-viewer-dialog :id="documentViewing" @close="viewDocument(undefined)" label="Event" />
        <card-title
            :filterIconState="filterState"
            @click="upsertItem(null)"
            @filter="toggleFilter"
            titletype="event"
        />
        <v-card-text>
            <v-expand-transition>
                <v-card v-if="filterState">
                    <v-card-title>
                        <tooltip-button
                            :color="isTypeSelected(type.value) ? 'grey lighten-1' : 'grey lighten-2'"
                            :icon="type.icon"
                            :key="type.type"
                            :tooltip="`${isTypeSelected(type.value) ? 'Showing' : 'Hiding'} ${type.text}`"
                            @click="toggleFilterType(type.value)"
                            v-for="type in eventTypes"
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
            <v-data-table
                :headers="tableHeaders"
                :items="getFilteredEvents"
            >
                <template v-slot:[`item.actions`]="{item}">
                    <tooltip-button @click="upsertItem(item.id)" icon="mdi-pencil" small tooltip="Edit Event" />
                </template>
                <template v-slot:[`item.numberOfDocuments`]="{item}">
                    <tooltip-button :disabled="!item.numberOfDocuments" :icon="item.numberOfDocumentsIcon" :tooltip="`${item.numberOfDocuments} Documents`" @click="viewDocument(item.id)" small />
                </template>
                <template v-slot:[`item.date`]="{item}">{{ item.dateFull }}</template>
                <template v-slot:[`item.attendedString`]="{item}">
                    <person-chip
                        :id="person"
                        :key="person"
                        islink
                        v-for="person in item.attended"
                    />
                </template>
                <template v-slot:[`item.wasinString`]="{item}"><location-chip :id="item.wasin" v-if="item.wasin" /></template>
            </v-data-table>
        </v-card-text>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { toggleArrayValue } from '../../scripts/aettbok'

import CardTitle from '../common/CardTitle.vue'
import DocumentViewerDialog from '../documents/DocumentViewerDialog.vue'
import EventEditor from './EventEditor.vue'
import LocationChip from '../locations/LocationChip.vue'
import PersonChip from '../persons/PersonChip.vue'
import TooltipButton from '../common/TooltipButton.vue'

export default {
    
    name: 'EventList',

    components: {
        'card-title': CardTitle,
        'document-viewer-dialog': DocumentViewerDialog,
        'event-editor': EventEditor,
        'location-chip': LocationChip,
        'person-chip': PersonChip,
        'tooltip-button': TooltipButton,
    },

    props: {
        locationFilter: { type: String, default: null },
    },

    data: () => ({

        documentViewing: undefined,
        editingItemId: undefined,

        filterState: false,
        filterHasName: '',
        filterTypes: ['BAPTISM', 'BIRTH', 'DEATH', 'DIVORCE', 'MARRIAGE', 'MILITARY', 'OCCUPATION', 'RESIDENCE'],

        tableHeaders: [
            { value: 'numberOfDocuments', text: '', sortable: true, width: 45 },
            { value: 'typeString', text: 'Type', sortable: true },
            { value: 'attendedString', text: 'Attendees', sortable: false },
            { value: 'date', text: 'Date', sortable: true },
            { value: 'wasinString', text: 'Location', sortable: true },
            { value: 'actions', text: 'Actions', sortable: false, align: 'center', width: 55 },
        ],

        eventTypes: [
            { value: 'BAPTISM', text: 'Baptism', icon: 'mdi-tilde' },
            { value: 'BIRTH', text: 'Birth', icon: 'mdi-asterisk' },
            { value: 'DEATH', text: 'Death', icon: 'mdi-cross' },
            { value: 'DIVORCE', text: 'Divorce',  icon: 'mdi-diameter-variant' },
            { value: 'MARRIAGE', text: 'Marriage', icon: 'mdi-set-none' },
            { value: 'MILITARY', text: 'Military', icon: 'mdi-sword-cross' },
            { value: 'OCCUPATION', text: 'Occupation', icon: 'mdi-hammer-wrench' },
            { value: 'RESIDENCE', text: 'Residence', icon: 'mdi-home' },
        ].sort((a, b) => a.text.localeCompare(b.text))

    }),

    computed: {

        ...mapGetters({
           getEvents: 'getEvents',
        }),

        getFilteredEvents() {

            if (!(this.filterState || this.locationFilter)) { return this.getEvents }

            return this.getEvents
                .filter(e => this.locationFilter ? (e.wasin || []).includes(this.locationFilter) : true)
                .filter(e => this.filterTypes ? this.filterTypes.includes(e.type) : true)
                .filter(e => !this.filterHasName || ((e.wasin || '').toLowerCase().includes(this.filterHasName.toLowerCase())) || ((e.attendedString || '').toLowerCase().includes(this.filterHasName.toLowerCase())))

        },

        filterSubtitleText() { return `showing ${this.getFilteredEvents.length} out of ${this.getEvents.length} entries` }

    },

    methods: {

        upsertItem(id) { return this.editingItemId = id },
        viewDocument(id) { return this.documentViewing = id },

        isTypeSelected(type) { return this.filterTypes.includes(type) },

        toggleFilterType(type) { return toggleArrayValue(type, this.filterTypes) },

        toggleFilter() {

            this.filterHasName = ''
            this.filterTypes = this.eventTypes.map(e => e.value)

            return this.filterState = !this.filterState

        }

    },

}
</script>