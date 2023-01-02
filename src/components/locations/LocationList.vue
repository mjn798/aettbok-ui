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
                        <tooltip-button :buttontype="filterPartof ? 'locations-radius' : 'locations-exact'" @click="filterPartof = !filterPartof" />
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

import CardTitle from '../common/CardTitle.vue'
import DataTable from '../common/DataTable.vue'
import LocationEditor from './LocationEditor.vue'
import TooltipButton from '../common/TooltipButton.vue'

export default {

    name: 'LocationList',

    components: {
        'card-title': CardTitle,
        'data-table': DataTable,
        'location-editor': LocationEditor,
        'tooltip-button': TooltipButton,
    },

    data: () => ({

        editingItemId: undefined,

        filterState: false,
        filterHasName: '',
        filterPartof: false,
        filterType: null,

        tableHeaders: ['locationtypetext', 'location', 'partofresolved', 'actions'],

    }),

    computed: {

        ...mapGetters({
            getLocations: 'getLocations',
            getLocationTypes: 'getLocationTypes',
        }),

        getFilteredItems() {

            if (!this.filterState) { return this.getLocations }

            return this.getLocations
                .filter(e => !(this.filterType && this.filterType !== e.locationtype))
                .filter(e => {
                    if (!this.filterHasName) { return true }
                    if (this.filterPartof) { return ((e.location || '').toLowerCase().includes(this.filterHasName.toLowerCase())) || ((e.partofresolved || '').toLowerCase().includes(this.filterHasName.toLowerCase())) }
                    return ((e.location || '').toLowerCase().includes(this.filterHasName.toLowerCase()))
                })

        },

        filterSubtitleText() { return `showing ${this.getFilteredItems.length} out of ${this.getLocations.length} entries` }

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