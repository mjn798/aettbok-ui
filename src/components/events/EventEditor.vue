<template>
    <v-dialog max-width="830" persistent v-model="showDialog">
        <v-card>
            <v-card-title>{{ getDialogTitle }}</v-card-title>
            <v-card-text>

                <v-autocomplete :items="eventTypes" class="ma-2" dense hide-details label="Event Type" outlined v-model="item.type" v-if="getRoleIsEditor" />
                <div class="ma-2" v-else-if="item.type">{{ item.typetext }}</div>

                <date-picker :day="item.day" :month="item.month" :year="item.year" @changeDay="changeDay" @changeMonth="changeMonth" @changeYear="changeYear" />
                <location-picker :selected="item.wasin" @selectedItem="selectedLocation" class="ma-2" label="Location" />
                <person-linker :linkeditems="item.attended" @link="(id) => link(id, item.attended)" @unlink="(id) => unlink(id, item.attended)" class="ma-2" />
                <document-linker :linkeditems="item.documentedby" @link="(id) => link(id, item.documentedby)" @unlink="(id) => unlink(id, item.documentedby)" class="ma-2" />

                <v-textarea class="ma-2" dense height="100" hide-details label="Comment" outlined v-model="item.comment" v-if="getRoleIsEditor" />
                <div class="ma-2 my-8" style="white-space: pre-line" v-else-if="item.comment">{{ item.comment }}</div>

                <tag-chips :selected="item.tags" :showSelectedOnly="false" @click="toggleTag" allowToggle class="ma-2 mt-8" v-if="getRoleIsEditor" />
                <tag-chips :selected="item.tags" class="ma-2 mt-8" v-else-if="item.tags" />

            </v-card-text>
            <card-actions :allowRemove="!isNewDialog" :isSaveDisabled="isSaveDisabled" @close="close" @remove="remove" @save="save" />
        </v-card>
    </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import * as aettbok from '../../scripts/aettbok'

import CardActions from '../common/CardActions.vue'
import DatePicker from '../common/DatePicker.vue'
import DocumentLinker from '../documents/DocumentLinker.vue'
import LocationPicker from '../locations/LocationPicker.vue'
import PersonLinker from '../persons/PersonLinker.vue'
import TagChips from '../tags/TagChips.vue'

export default {

    name: 'EventEditor',

    components: {
        'card-actions': CardActions,
        'date-picker': DatePicker,
        'document-linker': DocumentLinker,
        'location-picker': LocationPicker,
        'person-linker': PersonLinker,
        'tag-chips': TagChips,
    },

    props: {
        id: { type: String, default: undefined },
    },

    data: () => ({

        item: { },

        eventTypes: [
            { value: 'BAPTISM', text: 'Baptism' },
            { value: 'BIRTH', text: 'Birth' },
            { value: 'DEATH', text: 'Death' },
            { value: 'DIVORCE', text: 'Divorce' },
            { value: 'MARRIAGE', text: 'Marriage' },
            { value: 'MILITARY', text: 'Military' },
            { value: 'OCCUPATION', text: 'Occupation' },
            { value: 'RESIDENCE', text: 'Residence' },
        ].sort((a, b) => a.text.localeCompare(b.text)),

    }),

    computed: {

        ...mapGetters({
            getEvent: 'getEvent',
            getRoleIsEditor: 'getRoleIsEditor',
        }),

        showDialog() { return this.id !== undefined },

        getDialogTitle() { return (!this.getRoleIsEditor ? 'View ' : this.isNewDialog ? 'New ' : 'Edit ') + 'Event' },

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

    changeDay(value) { return this.item.day = value },
    changeMonth(value) { return this.item.month = value },
    changeYear(value) { return this.item.year = value },

    link(id, array) { return array.findIndex(e => e === id) === -1 ? array.push(id) : null },

    unlink(id, array) {
        let index = array.findIndex(e => e === id)
        return index === -1 ? null : array.splice(index, 1)
    },

    toggleTag(id) { return aettbok.toggleArrayValue(id, this.item.tags) },

  },

  watch: {

    id: function(id) {

        if (id) { return this.item = JSON.parse(JSON.stringify(this.getEvent(id))) }

        let attended = this.$route.name === 'Persons' ? [this.$route.params.id] : []
        let wasin = this.$route.name === 'Locations' ? this.$route.params.id : null
        
        return this.item = {
            attended: attended,
            comment: null,
            day: null,
            documentedby: [],
            id: null,
            month: null,
            tags: [],
            type: null,
            wasin: wasin,
            year: null,
        }

    }

  },

}
</script>