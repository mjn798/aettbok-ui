<template>
    <v-dialog max-width="830" persistent v-model="showDialog">
        <v-card>
            <v-card-title>{{ getDialogTitle }}</v-card-title>
            <v-card-text>
                <v-container>
                    <v-row no-gutters>
                        <v-col cols="12"><source-picker :selected="item.sourcedby" @selectedItem="selectedSource" label="Source" /></v-col>
                        <v-col cols="12"><v-text-field class="ma-2" dense hide-details label="Document Index" outlined v-model="item.index" /></v-col>
                        <v-col cols="12"><v-text-field class="ma-2" dense hide-details label="Date" outlined v-model="item.date" /></v-col>
                        <v-col cols="12"><v-textarea class="ma-2" dense height="500" hide-details label="Content" outlined v-model="item.content" /></v-col>
                        <v-col cols="12"><person-linker :persons="item.persons" @linkedPerson="linkedPerson" @unlinkedPerson="unlinkedPerson" /></v-col>
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
import PersonLinker from '../persons/PersonLinker.vue'
import SourcePicker from './SourcePicker.vue'

export default {

    name: 'DocumentEditor',

    components: {
        'card-actions': CardActions,
        'person-linker': PersonLinker,
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
            getDocument: 'getDocument',
            getSources: 'getSources',
        }),

        getDialogTitle() { return (this.isEditDialog ? 'Edit ' : 'New ') + 'Document' },

        isEditDialog() { return !([null, undefined].includes(this.id)) },
        isSaveDisabled() { return false },

        showDialog() { return this.id !== undefined }

    },

  methods: {

    close() { return this.$emit('close') },

    remove() {

        // call REST API

        return aettbok.deleteNodeWithLabelAndId('Document', this.item.id)
        .catch(error => console.error(error))
        .finally(() => this.close())

    },

    save() {

        // convert empty strings to null values

        if (!this.item.content)   { this.item.content = null }
        if (!this.item.date)      { this.item.date = null }
        if (!this.item.index)     { this.item.index = null }
        if (!this.item.persons)   { this.item.persons = null }
        if (!this.item.sourcedby) { this.item.sourcedby = null }

        // call REST API

        return aettbok.upsertDocument(this.item)
        .catch(error => console.error(error))
        .finally(() => this.close())

    },

    selectedSource(id) { return this.item.sourcedby = id },

    linkedPerson(id) {
        let index = this.item.persons.findIndex(e => e === id)
        return index === -1 ? this.item.persons.push(id) : null
    },

    unlinkedPerson(id) {
        let index = this.item.persons.findIndex(e => e === id)
        return index === -1 ? null : this.item.persons.splice(index, 1)
    },

  },

  watch: {

    id: function(id) {

        if (id === undefined || id === null) { return this.item = {
            content: null,
            date: null,
            id: null,
            index: null,
            persons: [],
            sourcedby: null,
            tags: [],
        }}

        return this.item = { ...this.getDocument(id) }

    }

  },

}
</script>