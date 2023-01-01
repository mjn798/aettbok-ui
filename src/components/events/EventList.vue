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
            <data-table
                :headers="tableHeaders"
                :items="getFilteredItems"
                @edit="upsertItem"
            />
        </v-card-text>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { toggleArrayValue } from '../../scripts/aettbok'

import CardTitle from '../common/CardTitle.vue'
import DataTable from '../common/DataTable.vue'
import EventEditor from './EventEditor.vue'
import TooltipButton from '../common/TooltipButton.vue'

export default {
    
    name: 'EventList',

    components: {
        'card-title': CardTitle,
        'data-table': DataTable,
        'event-editor': EventEditor,
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

        eventTypes: ['BAPTISM', 'BIRTH', 'DEATH', 'DIVORCE', 'MARRIAGE', 'MILITARY', 'OCCUPATION', 'RESIDENCE'],

        tableHeaders: ['documentscount', 'typetext', 'attendedtext', 'date', 'wasintext', 'actions'],

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
                .filter(e => !this.filterHasName || ((e.wasintext || '').toLowerCase().includes(this.filterHasName.toLowerCase())) || ((e.attendedtext || '').toLowerCase().includes(this.filterHasName.toLowerCase())))

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