<template>
    <v-dialog max-width="830" persistent v-model="showDialog">
        <v-card>
            <v-card-title>{{ getDialogTitle }}</v-card-title>
            <v-card-text>
                <v-container>
                    <v-row no-gutters>
                        <v-col cols="12"><v-text-field class="ma-2" dense hide-details label="Source" outlined v-model="item.source" /></v-col>
                        <v-col cols="12"><source-picker :exclude="item.id" :selected="item.containedin" @selectedItem="selectedContainedIn" label="Contained in" /></v-col>
                        <v-col cols="12"><location-picker :selected="item.storedin" @selectedItem="selectedLocation" label="Stored in" /></v-col>
                        <v-col cols="12"><v-text-field class="ma-2" dense hide-details label="Author" outlined v-model="item.author" /></v-col>
                        <v-col cols="12"><v-text-field class="ma-2" dense hide-details label="Link" outlined v-model="item.link" /></v-col>
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
import LocationPicker from '../locations/LocationPicker.vue'
import SourcePicker from './SourcePicker.vue'

export default {

    name: 'SourceEditor',

    components: {
        'card-actions': CardActions,
        'location-picker': LocationPicker,
        'source-picker': SourcePicker,
    },

    props: {
        id: { type: String, default: undefined },
    },

    data: () => ({

        item: { },

    }),

    computed: {

        ...mapGetters({
            getSource: 'getSource',
        }),

        getDialogTitle() { return (this.isEditDialog ? 'Edit ' : 'New ') + 'Source' },

        isEditDialog() { return !([null, undefined].includes(this.id)) },
        isSaveDisabled() { return false },

        showDialog() { return this.id !== undefined },

    },

  methods: {

    close()  { return this.$emit('close') },

    remove() {

        // call REST API

        return aettbok.deleteNodeWithLabelAndId('Source', this.item.id)
        .catch(error => console.error(error))
        .finally(() => this.close())

    },

    save()   {

        // convert empty strings to null values

        if (!this.item.author) { this.item.author = null }
        if (!this.item.containedin) { this.item.containedin = null }
        if (!this.item.link) { this.item.link = null }
        if (!this.item.source) { this.item.source = null }
        if (!this.item.storedin) { this.item.storedin = null }

        // call REST API

        return aettbok.upsertNode(this.item, 'Source')
        .catch(error => console.error(error))
        .finally(() => this.close())

    },

    selectedLocation(id) { return this.item.storedin = id },
    selectedContainedIn(id) { return this.item.containedin = id },

  },

  watch: {

    id: function(id) {

        if (id === undefined || id === null) { return this.item = {
            author: null,
            containedin: null,
            id: null,
            link: null,
            source: null,
            storedin: null,
            tags: [],
        }}

        return this.item = { ...this.getSource(id) }

    }

  },


}
</script>