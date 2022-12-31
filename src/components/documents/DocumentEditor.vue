<template>
    <v-dialog max-width="830" persistent v-model="showDialog">
        <v-card>
            <v-card-title>{{ getDialogTitle }}</v-card-title>
            <v-card-text>
                <source-picker :selected="item.sourcedby" @selectedItem="selectedSource" class="ma-2" label="Source" />
                <v-text-field class="ma-2" dense hide-details label="Document Index" outlined v-model="item.index" />
                <v-text-field class="ma-2" dense hide-details label="Date" outlined v-model="item.date" />
                <v-textarea class="ma-2" dense height="500" hide-details label="Content" outlined v-model="item.content" />
                <person-linker :persons="item.persons" @linkedPerson="linkedPerson" @unlinkedPerson="unlinkedPerson" class="ma-2" />
            </v-card-text>
            <card-actions :allowRemove="!isNewDialog" :isSaveDisabled="isSaveDisabled" @close="close" @remove="remove" @save="save" />
        </v-card>
    </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import * as aettbok from '../../scripts/aettbok'

import CardActions from '../common/CardActions.vue'
import PersonLinker from '../persons/PersonLinker.vue'
import SourcePicker from '../sources/SourcePicker.vue'

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

        showDialog() { return this.id !== undefined },

        getDialogTitle() { return (this.isNewDialog ? 'New ' : 'Edit ') + 'Document' },

        isNewDialog() { return !this.id },
        isSaveDisabled() { return false },

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

        return aettbok.upsertNode(this.item, 'Document')
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

        if (id) { return this.item = JSON.parse(JSON.stringify(this.getDocument(id))) }

        return this.item = {
            content: null,
            date: null,
            id: null,
            index: null,
            persons: [],
            sourcedby: null,
            tags: [],
        }

    }

  },

}
</script>