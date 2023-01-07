<template>
    <v-dialog max-width="830" persistent v-model="showDialog">
        <v-card>
            <v-card-title>{{ getDialogTitle }}</v-card-title>
            <v-card-text>
                
                <source-picker :selected="item.sourcedby" @selectedItem="selectedSource" class="ma-2" label="Source" />

                <v-text-field class="ma-2" dense hide-details label="Document Index" outlined v-model="item.index" v-if="getRoleIsEditor" />
                <div class="ma-2" v-else-if="item.index">{{ item.index }}</div>
                
                <date-picker :day="item.day" :month="item.month" :year="item.year" @changeDay="changeDay" @changeMonth="changeMonth" @changeYear="changeYear" />
                
                <v-textarea class="ma-2" dense height="400" hide-details label="Content" outlined v-model="item.content" v-if="getRoleIsEditor" />
                <div class="ma-2 my-8" style="white-space: pre-line" v-else-if="item.content">{{ item.content }}</div>
                
                <person-linker :linkeditems="item.persons" @link="(id) => link(id, item.persons)" @unlink="(id) => unlink(id, item.persons)" class="ma-2" />
                <event-linker :linkeditems="item.events" @link="(id) => link(id, item.events)" @unlink="(id) => unlink(id, item.events)" class="ma-2" />
                
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
import EventLinker from '../events/EventLinker.vue'
import PersonLinker from '../persons/PersonLinker.vue'
import SourcePicker from '../sources/SourcePicker.vue'
import TagChips from '../tags/TagChips.vue'

export default {

    name: 'DocumentEditor',

    components: {
        'card-actions': CardActions,
        'date-picker': DatePicker,
        'event-linker': EventLinker,
        'person-linker': PersonLinker,
        'source-picker': SourcePicker,
        'tag-chips': TagChips,
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
            getRoleIsEditor: 'getRoleIsEditor',
            getSources: 'getSources',
        }),

        showDialog() { return this.id !== undefined },

        getDialogTitle() { return (!this.getRoleIsEditor ? 'View ' : this.isNewDialog ? 'New ' : 'Edit ') + 'Document' },

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
        if (!this.item.sourcedby) { this.item.sourcedby = null }
        if (!this.item.day)       { this.item.day = null }
        if (!this.item.month)     { this.item.month = null }
        if (!this.item.year)      { this.item.year = null }

        // call REST API

        return aettbok.upsertNode(this.item, 'Document')
        .catch(error => console.error(error))
        .finally(() => this.close())

    },

    selectedSource(id) { return this.item.sourcedby = id },

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

        if (id) { return this.item = JSON.parse(JSON.stringify(this.getDocument(id))) }

        return this.item = {
            content: null,
            day: null,
            events: [],
            id: null,
            index: null,
            month: null,
            persons: [],
            sourcedby: null,
            tags: [],
            year: null,
        }

    }

  },

}
</script>