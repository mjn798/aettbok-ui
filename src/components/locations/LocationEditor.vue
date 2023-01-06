<template>
    <v-dialog max-width="830" persistent v-model="showDialog">
        <locationtype-editor :showDialog="showLocationTypeEditor" @close="showLocationTypeEditor = false" />
        <v-card>
            <v-card-title>{{ getDialogTitle }}</v-card-title>
            <v-card-text>
                <v-text-field class="ma-2" dense hide-details label="Location" outlined v-model="item.location" />
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
                    v-model="item.locationtype"
                >
                    <template v-slot:append-outer>
                        <div class="mt-n3">
                            <tooltip-button @click="showLocationTypeEditor = true" buttontype="locationtypes-edit" />
                        </div>
                    </template>
                </v-autocomplete>
                <location-picker :exclude="item.id" :selected="item.partof" @selectedItem="selectedLocation" class="ma-2" label="Part of" />
                <v-row no-gutters>
                    <v-col cols="12" sm="6"><v-text-field class="ma-2" dense hide-details label="Latitude" outlined v-model="item.latitude" /></v-col>
                    <v-col cols="12" sm="6"><v-text-field class="ma-2" dense hide-details label="Longitude" outlined v-model="item.longitude" /></v-col>
                </v-row>
                <tag-chips :selected="item.tags" :showSelectedOnly="false" @click="toggleTag" allowToggle class="ma-2 mt-8" />
            </v-card-text>
            <card-actions :allowRemove="!isNewDialog" :isSaveDisabled="isSaveDisabled" @close="close" @remove="remove" @save="save" />
        </v-card>
    </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import * as aettbok from '../../scripts/aettbok'

import CardActions from '../common/CardActions.vue'
import LocationPicker from './LocationPicker.vue'
import LocationTypeEditor from './LocationTypeEditor.vue'
import TagChips from '../tags/TagChips.vue'
import TooltipButton from '../common/TooltipButton.vue'

export default {

    name: 'LocationEditor',

    components: {
        'card-actions': CardActions,
        'location-picker': LocationPicker,
        'locationtype-editor': LocationTypeEditor,
        'tag-chips': TagChips,
        'tooltip-button': TooltipButton,
    },

    props: {
        id: { type: String, default: undefined },
    },

    data: () => ({

        item: { },

        showLocationTypeEditor: false,

    }),

    computed: {

        ...mapGetters({
            getLocation: 'getLocation',
            getLocationTypes: 'getLocationTypes',
        }),

        showDialog() { return this.id !== undefined },

        getDialogTitle() { return (this.isNewDialog ? 'New ' : 'Edit ') + 'Location' },

        isNewDialog() { return !this.id },
        isSaveDisabled() { return !(this.item && this.item.location && this.item.location.length) },

    },

  methods: {

    close() { return this.$emit('close') },

    remove() {

        // call REST API

        return aettbok.deleteNodeWithLabelAndId('Location', this.item.id)
        .catch(error => console.error(error))
        .finally(() => this.close())

    },

    save() {

        // convert empty strings to null values

        if (!this.item.latitude)     { this.item.latitude = null }
        if (!this.item.location)     { this.item.location = null }
        if (!this.item.locationtype) { this.item.locationtype = null }
        if (!this.item.longitude)    { this.item.longitude = null }
        if (!this.item.partof)       { this.item.partof = null }

        // call REST API

        return aettbok.upsertNode(this.item, 'Location')
        .catch(error => console.error(error))
        .finally(() => this.close())

    },

    selectedLocation(id) { return this.item.partof = id },

    toggleTag(id) { return aettbok.toggleArrayValue(id, this.item.tags) }

  },

  watch: {

    id: function(id) {

        if (id) { return this.item = JSON.parse(JSON.stringify(this.getLocation(id))) }

        return this.item = {
            id: null,
            documentedby: [],
            latitude: null,
            location: null,
            locationtype: null,
            longitude: null,
            partof: null,
            tags: [],
        }

    }

  },

}
</script>