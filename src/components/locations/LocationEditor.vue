<template>
    <v-dialog max-width="830" persistent v-model="showDialog">
        <locationtype-editor :showDialog="showLocationTypeEditor" @close="closeLocationTypeEditor" />
        <v-card>
            <v-card-title>{{ getDialogTitle }}</v-card-title>
            <v-card-text>
                <v-container>
                    <v-row no-gutters>
                        <v-col cols="12" md="7"><v-text-field class="ma-2" dense hide-details label="Location" outlined v-model="item.location" /></v-col>
                        <v-col cols="12" md="5">
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
                                <template v-slot:append-outer><div class="mt-n4"><tooltip-button @click="showLocationTypeEditor = true" icon="mdi-home-edit" tooltip="Edit Location Types" /></div></template>
                            </v-autocomplete>
                        </v-col>
                        <v-col cols="12"><location-picker :exclude="item.id" :selected="item.partof" @selectedItem="selectedLocation" label="Part of" /></v-col>
                        <v-col cols="12" md="6"><v-text-field class="ma-2" dense hide-details label="Latitude" outlined v-model="item.latitude" /></v-col>
                        <v-col cols="12" md="6"><v-text-field class="ma-2" dense hide-details label="Longitude" outlined v-model="item.longitude" /></v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <card-actions :allowRemove="isEditDialog" :isSaveDisabled="isSaveDisabled" @close="close" @remove="remove" @save="save" />
        </v-card>
    </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import * as aettbok from '../../scripts/aettbok'

import CardActions from '../common/CardActions.vue'
import LocationPicker from './LocationPicker.vue'
import LocationTypeEditor from './LocationTypeEditor.vue'
import TooltipButton from '../common/TooltipButton.vue'

export default {

    name: 'LocationEditor',

    components: {
        'card-actions': CardActions,
        'location-picker': LocationPicker,
        'locationtype-editor': LocationTypeEditor,
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

        getDialogTitle() { return (this.isEditDialog ? 'Edit ' : 'New ') + 'Location' },

        isEditDialog() { return !([null, undefined].includes(this.id)) },
        isSaveDisabled() { return false },

        showDialog() { return this.id !== undefined },

    },

  methods: {

    close() { return this.$emit('close') },

    closeLocationTypeEditor() { return this.showLocationTypeEditor = false },

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

  },

  watch: {

    id: function(id) {

        if (id === undefined || id === null) { return this.item = {
            id: null,
            documentedby: [],
            latitude: null,
            location: null,
            locationtype: null,
            longitude: null,
            partof: null,
            tags: [],
        }}

        return this.item = { ...this.getLocation(id) }

    }

  },


}
</script>