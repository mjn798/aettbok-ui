<template>
    <v-card>
        <event-editor :id="editingItemId" @close="upsertItem(undefined)" />
        <card-title
            :filterIconState="filterState"
            @click="upsertItem(null)"
            @filter="toggleFilter"
            actionIcon="mdi-calendar-plus"
            actionTooltip="New Event"
            title="Events"
        />
        <v-card-text>
            <v-expand-transition>
                <v-card v-if="filterState">
                    <v-container fluid>
                        <v-row align="center" no-gutters>
                            <v-col>
                                <v-autocomplete
                                    :items="getEventTypes"
                                    class="ma-2"
                                    clearable
                                    dense
                                    hide-details
                                    label="Type"
                                    outlined
                                    v-model="filterType"
                                />
                            </v-col>
                            <v-col>
                                <v-text-field
                                    class="ma-2"
                                    clearable
                                    dense
                                    hide-details
                                    outlined
                                    prepend-inner-icon="mdi-magnify"
                                    v-model="filterHasName"
                                />
                            </v-col>
                        </v-row>
                    </v-container>
                    <v-card-subtitle>{{ filterSubtitleText }}</v-card-subtitle>
                </v-card>
            </v-expand-transition>
        </v-card-text>
        <v-card-text>
            <v-data-table
                :headers="getTableHeaders"
                :items="getFilteredEvents"
                disable-pagination
                hide-default-footer
            >
                <template v-slot:[`item.actions`]="{item}">
                    <tooltip-button @click="upsertItem(item.id)" icon="mdi-pencil" small tooltip="Edit Event" />
                </template>
                <template v-slot:[`item.numberOfDocuments`]="{item}">
                    <tooltip-button :icon="item.numberOfDocumentsIcon" :tooltip="`${item.numberOfDocuments} Documents`" small />
                </template>
                <template v-slot:[`item.date`]="{item}">{{ item.dateLong }}</template>
            </v-data-table>
        </v-card-text>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

import CardTitle from '../common/CardTitle.vue'
import EventEditor from './EventEditor.vue'
import TooltipButton from '../common/TooltipButton.vue'

export default {
    
    name: 'EventList',

    components: {
        'card-title': CardTitle,
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
        filterType: null,

    }),

    computed: {

        ...mapGetters({
           getEvents: 'getEvents',
        }),

        getTableHeaders() { return [
            { value: 'numberOfDocuments', text: '', sortable: true, width: 45 },
            { value: 'typeString', text: 'Type', sortable: true },
            { value: 'attendedString', text: 'Attendees', sortable: false },
            { value: 'date', text: 'Date', sortable: true },
            { value: 'wasinString', text: 'Location', sortable: true },
            { value: 'actions', text: 'Actions', sortable: false, width: 55 },
        ]},

        getEventTypes() { return ['Birth', 'Death', 'Marriage', 'Military', 'Residence', 'Work']},

        getFilteredEvents() {

            if (!(this.filterState || this.locationFilter)) { return this.getEvents }

            return this.getEvents
                .filter(e => {
                    if (!(this.locationFilter && e.wasinString)) { return false }
                    return (e.wasinString || '').includes(this.locationFilter)
                })
                .filter(e => !(this.filterType && this.filterType !== e.typeString))
                .filter(e => {
                    if (!this.filterHasName) { return true }
                    return (e.wasin && (e.wasin.toLowerCase().includes(this.filterHasName.toLowerCase()) || e.attendedString.toLowerCase().includes(this.filterHasName.toLowerCase())))
                })

        },

        filterSubtitleText() { return `showing ${this.getFilteredEvents.length} out of ${this.getEvents.length} entries` }

    },

    methods: {

        upsertItem(id) { return this.editingItemId = id },

        toggleFilter() {

            this.filterHasName = ''
            this.filterType = null

            return this.filterState = !this.filterState

        }

    },

}
</script>