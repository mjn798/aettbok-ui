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
                    <v-container fluid>
                        <v-row align="center" no-gutters>
                            <v-col>
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
                            </v-col>
                            <v-col>
                                <v-text-field
                                    class="ma-2"
                                    clearable
                                    dense
                                    hide-details
                                    label="Search"
                                    outlined
                                    prepend-inner-icon="mdi-magnify"
                                    v-model="filterHasName"
                                >
                                    <template v-slot:append-outer><div class="mt-n4"><tooltip-button :icon="filterPartof ? 'mdi-map-marker-radius' : 'mdi-map-marker'" :tooltip="filterPartof ? 'Showing Locations and Parts' : 'Showing Locations only'" @click="filterPartof = !filterPartof" /></div></template>
                                </v-text-field>
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
                :items="getFilteredLocations"
                disable-pagination
                hide-default-footer
            >
                <template v-slot:[`item.actions`]="{item}">
                    <tooltip-button @click="upsertItem(item.id)" icon="mdi-pencil" small tooltip="Edit Location" />
                    <tooltip-button :to="`/locations/${item.id}`" icon="mdi-view-dashboard" small tooltip="View Location" />
                </template>
                <template v-slot:[`item.numberOfDocuments`]="{item}">
                    <tooltip-button :icon="item.numberOfDocumentsIcon" :tooltip="`${item.numberOfDocuments} Documents`" small />
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

    }),

    computed: {

        ...mapGetters({
           getLocations: 'getLocations',
           getLocationTypes: 'getLocationTypes',
        }),

        getTableHeaders() { return [
            { value: 'numberOfDocuments', text: '', sortable: true, width: 45 },
            { value: 'locationtypeString', text: 'Type', sortable: true, align: 'end' },
            { value: 'location', text: 'Location', sortable: true },
            { value: 'partofResolved', text: 'Part of', sortable: true },
            { value: 'actions', text: 'Actions', sortable: false, width: 110 },
        ]},

        getFilteredLocations() {

            if (!this.filterState) { return this.getLocations }

            return this.getLocations
                .filter(e => !(this.filterType && this.filterType !== e.locationtype))
                .filter(e => {
                    if (!this.filterHasName) { return true }
                    if (this.filterPartof) { return (e.location && e.location.toLowerCase().includes(this.filterHasName.toLowerCase())) || (e.partofResolved && e.partofResolved.toLowerCase().includes(this.filterHasName.toLowerCase())) }
                    return (e.location && e.location.toLowerCase().includes(this.filterHasName.toLowerCase()))
                })

        },

        filterSubtitleText() { return `showing ${this.getFilteredLocations.length} out of ${this.getLocations.length} entries` }

    },

    methods: {

        upsertItem(id) { return this.editingItemId = id },

        toggleFilter() {

            this.filterHasName = ''
            this.filterType = null

            return this.filterState = !this.filterState

        },

    },

}
</script>