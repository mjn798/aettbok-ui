<template>
    <v-dialog max-width="830" persistent v-model="showDialog">
        <v-card>
            <v-card-title>{{ getDialogTitle }}</v-card-title>
            <v-card-text>
                <v-container>
                    <v-row no-gutters>
                        <v-col cols="12"><v-autocomplete :items="getEventTypes" class="ma-2" dense hide-details label="Event Type" outlined v-model="item.type" /></v-col>
                        <v-col cols="12" sm="4"><v-text-field class="ma-2" clearable dense hide-details hide-spin-buttons label="Day" outlined type="number" v-model="item.day" /></v-col>
                        <v-col cols="12" sm="4"><v-text-field class="ma-2" clearable dense hide-details hide-spin-buttons label="Month" outlined type="number" v-model="item.month" /></v-col>
                        <v-col cols="12" sm="4"><v-text-field class="ma-2" clearable dense hide-details hide-spin-buttons label="Year" outlined type="number" v-model="item.year" /></v-col>
                        <v-col cols="12"><location-picker :selected="item.wasin" @selectedItem="selectedLocation" label="Location" /></v-col>
                        <v-col cols="12"><person-linker :persons="item.attended" @linkedPerson="linkedPerson" @unlinkedPerson="unlinkedPerson" /></v-col>
                        <v-col cols="12"><document-linker :documents="item.documentedby" @linkedDocument="linkedDocument" @unlinkedDocument="unlinkedDocument" /></v-col>
                        <v-col cols="12"><v-textarea class="ma-2" dense height="100" hide-details label="Comment" outlined v-model="item.comment" /></v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <card-actions :allowRemove="!isNewDialog" :isSaveDisabled="isSaveDisabled" @close="close" @remove="remove" @save="save" />
        </v-card>
    </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import * as aettbok from '../../scripts/aettbok'

import CardActions from '../common/CardActions.vue'
import DocumentLinker from '../documents/DocumentLinker.vue'
import LocationPicker from '../locations/LocationPicker.vue'
import PersonLinker from '../persons/PersonLinker.vue'

export default {

    name: 'EventEditor',

    components: {
        'card-actions': CardActions,
        'document-linker': DocumentLinker,
        'location-picker': LocationPicker,
        'person-linker': PersonLinker,
    },

    props: {
        id: { type: String, default: undefined },
    },

    data: () => ({

        item: { },

        pickedDate: '',

    }),

    computed: {

        ...mapGetters({
            getEvent: 'getEvent',
        }),

        getEventTypes() { return [
            { value: 'BAPTISM', text: 'Baptism' },
            { value: 'BIRTH', text: 'Birth' },
            { value: 'DEATH', text: 'Death' },
            { value: 'DIVORCE', text: 'Divorce' },
            { value: 'MARRIAGE', text: 'Marriage' },
            { value: 'MILITARY', text: 'Military' },
            { value: 'OCCUPATION', text: 'Occupation' },
            { value: 'RESIDENCE', text: 'Residence' },
        ].sort((a, b) => a.text.localeCompare(b.text))},

        showDialog() { return this.id !== undefined },

        getDialogTitle() { return (this.isNewDialog ? 'New ' : 'Edit ') + 'Event' },

        isNewDialog() { return !this.id },
        isSaveDisabled() { return !(this.item && this.item.type) },

    },

  methods: {

    close()  { return this.$emit('close') },

    remove() {

        // call REST API

        return aettbok.deleteNodeWithLabelAndId('Event', this.item.id)
        .catch(error => console.error(error))
        .finally(() => this.close())

    },

    save() {

        // convert empty strings to null values

        this.item.day   = this.item.day ? Number(this.item.day) : null
        this.item.month = this.item.month ? Number(this.item.month) : null
        this.item.year  = this.item.year ? Number(this.item.year) : null

        if (!this.item.comment) { this.item.comment = null }
        if (!this.item.type)    { this.item.type = null }
        if (!this.item.wasin)   { this.item.wasin = null }

        // call REST API

        return aettbok.upsertNode(this.item, 'Event')
        .catch(error => console.error(error))
        .finally(() => this.close())

    },

    selectedLocation(id) { return this.item.wasin = id },

    linkedDocument(id) {
        if (this.item.documentedby.includes(id)) { return }
        return this.item.documentedby.push(id)
    },

    linkedPerson(id) {
        if (this.item.attended.includes(id)) { return }
        return this.item.attended.push(id)
    },

    unlinkedDocument(id) {
        let index = this.item.documentedby.findIndex(e => e === id)
        return index === -1 ? null : this.item.documentedby.splice(index, 1)
    },

    unlinkedPerson(id) {
        let index = this.item.attended.findIndex(e => e === id)
        return index === -1 ? null : this.item.attended.splice(index, 1)
    },

  },

  watch: {

    id: function(id) {

        if (id) { return this.item = JSON.parse(JSON.stringify(this.getEvent(id))) }

        let attended = this.$route.name === 'Persons' ? [this.$route.params.id] : []
        
        return this.item = {
            attended: attended,
            comment: null,
            documentedby: [],
            tags: [],
            day: null,
            id: null,
            month: null,
            type: null,
            wasin: null,
            year: null,
        }

    }

  },

}
</script>