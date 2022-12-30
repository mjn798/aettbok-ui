<template>
    <v-card>
        <event-editor :id="editingItemId" @close="upsertItem(undefined)" />
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
                            :buttontype="`${isTypeSelected(type) ? 'showing' : 'hiding'}-${(type || '').toLowerCase()}`"
                            :key="type"
                            @click="toggleFilterType(type)"
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
                :items="getFilteredItems"
            >
                <template v-slot:[`item.actions`]="{item}"><tooltip-button @click="upsertItem(item.id)" buttontype="edit" small /></template>
                <template v-slot:[`item.numberOfDocuments`]="{item}"><document-viewer :listofids="item.documentedby" /></template>
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
import DocumentViewer from '../documents/DocumentViewer.vue'
import EventEditor from './EventEditor.vue'
import LocationChip from '../locations/LocationChip.vue'
import PersonChip from '../persons/PersonChip.vue'
import TooltipButton from '../common/TooltipButton.vue'

export default {
    
    name: 'EventList',

    components: {
        'card-title': CardTitle,
        'document-viewer': DocumentViewer,
        'event-editor': EventEditor,
        'location-chip': LocationChip,
        'person-chip': PersonChip,
        'tooltip-button': TooltipButton,
    },

    props: {
        locationFilter: { type: String, default: null },
    },

    data: () => ({

        editingItemId: undefined,

        filterState: false,
        filterHasName: '',
        filterTypes: ['BAPTISM', 'BIRTH', 'DEATH', 'DIVORCE', 'MARRIAGE', 'MILITARY', 'OCCUPATION', 'RESIDENCE'],

        tableHeaders: [
            { value: 'numberOfDocuments', text: '', sortable: true, width: 50 },
            { value: 'typeString', text: 'Type', sortable: true },
            { value: 'attendedString', text: 'Attendees', sortable: false },
            { value: 'date', text: 'Date', sortable: true },
            { value: 'wasinString', text: 'Location', sortable: true },
            { value: 'actions', text: 'Actions', sortable: false, align: 'center', width: 50 },
        ],

        eventTypes: ['BAPTISM', 'BIRTH', 'DEATH', 'DIVORCE', 'MARRIAGE', 'MILITARY', 'OCCUPATION', 'RESIDENCE'],

    }),

    computed: {

        ...mapGetters({
           getEvents: 'getEvents',
        }),

        getFilteredItems() {

            if (!(this.filterState || this.locationFilter)) { return this.getEvents }

            return this.getEvents
                .filter(e => this.locationFilter ? (e.wasin || []).includes(this.locationFilter) : true)
                .filter(e => this.filterTypes ? this.filterTypes.includes(e.type) : true)
                .filter(e => !this.filterHasName || ((e.wasin || '').toLowerCase().includes(this.filterHasName.toLowerCase())) || ((e.attendedString || '').toLowerCase().includes(this.filterHasName.toLowerCase())))

        },

        filterSubtitleText() { return `showing ${this.getFilteredItems.length} out of ${this.getEvents.length} entries` }

    },

    methods: {

        upsertItem(id) { return this.editingItemId = id },

        isTypeSelected(type) { return this.filterTypes.includes(type) },

        toggleFilterType(type) { return toggleArrayValue(type, this.filterTypes) },

        toggleFilter() {

            this.filterHasName = ''
            this.filterTypes = this.eventTypes.map(e => e)

            return this.filterState = !this.filterState

        },

    },

}
</script>