<template>
    <v-card>
        <location-editor :id="editingItemId" @close="upsertItem(undefined)" />
        <card-title
            :filterIconState="filterState"
            @click="upsertItem(null)"
            @filter="toggleFilter"
            titletype="location"
        />
        <v-card-text>
            <v-expand-transition>
                <v-card v-if="filterState">
                    <v-card-title>
                        <v-autocomplete
                            :items="getLocationTypes"
                            class="ma-2"
                            clearable
                            dense
                            hide-details
                            item-text="type"
                            item-value="id"
                            label="Type"
                            outlined
                            v-model="filterType"
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
                        <tooltip-button
                            :icon="filterPartof ? 'mdi-map-marker-radius' : 'mdi-map-marker'"
                            :tooltip="filterPartof ? 'Showing Locations and Parts' : 'Showing Locations only'"
                            @click="filterPartof = !filterPartof"
                        />
                    </v-card-title>
                    <v-card-subtitle>{{ filterSubtitleText }}</v-card-subtitle>
                </v-card>
            </v-expand-transition>
        </v-card-text>
        <v-card-text>
            <v-data-table
                :headers="tableHeaders"
                :items="getFilteredLocations"
            >
                <template v-slot:[`item.actions`]="{item}">
                    <tooltip-button @click="upsertItem(item.id)" icon="mdi-pencil" small tooltip="Edit Location" />
                    <tooltip-button :to="`/locations/${item.id}`" icon="mdi-view-dashboard" small tooltip="View Location" />
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

import CardTitle from '../common/CardTitle.vue'
import LocationEditor from './LocationEditor.vue'
import TooltipButton from '../common/TooltipButton.vue'

export default {

    name: 'LocationList',

    components: {
        'card-title': CardTitle,
        'location-editor': LocationEditor,
        'tooltip-button': TooltipButton,
    },

    data: () => ({

        editingItemId: undefined,

        filterState: false,
        filterHasName: '',
        filterPartof: false,
        filterType: null,

        tableHeaders: [
            { value: 'locationtypeString', text: 'Type', sortable: true, align: 'end' },
            { value: 'location', text: 'Location', sortable: true },
            { value: 'partofResolved', text: 'Part of', sortable: true },
            { value: 'actions', text: 'Actions', sortable: false, align: 'center', width: 110 },
        ],

    }),

    computed: {

        ...mapGetters({
            getLocations: 'getLocations',
            getLocationTypes: 'getLocationTypes',
        }),

        getFilteredLocations() {

            if (!this.filterState) { return this.getLocations }

            return this.getLocations
                .filter(e => !(this.filterType && this.filterType !== e.locationtype))
                .filter(e => {
                    if (!this.filterHasName) { return true }
                    if (this.filterPartof) { return ((e.location || '').toLowerCase().includes(this.filterHasName.toLowerCase())) || ((e.partofResolved || '').toLowerCase().includes(this.filterHasName.toLowerCase())) }
                    return ((e.location || '').toLowerCase().includes(this.filterHasName.toLowerCase()))
                })

        },

        filterSubtitleText() { return `showing ${this.getFilteredLocations.length} out of ${this.getLocations.length} entries` }

    },

    methods: {

        upsertItem(id) { return this.editingItemId = id },

        toggleFilter() {

            // filterPartof is NOT reset
            this.filterHasName = ''
            this.filterType = null

            return this.filterState = !this.filterState

        },

    },

}
</script>