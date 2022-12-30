<template>
    <v-dialog max-width="830" persistent v-model="showDialog">
        <v-card>
            <v-card-title>{{ getDialogTitle }}</v-card-title>
            <v-card-text>
                <v-text-field class="ma-2" dense hide-details label="First Name" outlined v-model="item.firstname" />
                <v-text-field class="ma-2" dense hide-details label="Last Name" outlined v-model="item.lastname" />
                <v-radio-group class="mx-4 mt-4" mandatory row v-model="item.gender">
                    <v-radio color="blue darken-2" label="Male" value="m" />
                    <v-radio color="pink darken-2" label="Female" value="f" />
                    <v-radio color="grey" label="Unknown" value="u" />
                </v-radio-group>
                <v-radio-group class="mx-4 mt-n2" mandatory row v-model="item.alive">
                    <v-radio color="grey darken-2" label="Living" :value="true" />
                    <v-radio color="grey lighten-1" label="Deceased" :value="false" />
                </v-radio-group>
                <v-textarea class="ma-2" dense height="100" hide-details label="Notes" outlined v-model="item.notes" />
                <person-linker :exclude="item.id" :persons="item.hasparents" @linkedPerson="linkedParent" @unlinkedPerson="unlinkedParent" class="ma-2" label="Parents" />
                <document-linker :documents="item.documentedby" @linkedDocument="linkedDocument" @unlinkedDocument="unlinkedDocument" class="ma-2" />
                <tag-chips :selected="item.tags" :showSelectedOnly="false" @toggle="toggleTag" allowToggle class="ma-2 mt-8" />
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
import PersonLinker from './PersonLinker.vue'
import TagChips from '../tags/TagChips.vue'

export default {

    name: 'PersonEditor',

    components: {
        'card-actions': CardActions,
        'document-linker': DocumentLinker,
        'person-linker': PersonLinker,
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
            getPerson: 'getPerson',
        }),

        showDialog() { return this.id !== undefined },

        getDialogTitle() { return (this.isNewDialog ? 'New ' : 'Edit ') + 'Person' },

        isNewDialog() { return !this.id },
        isSaveDisabled() { return !(this.item && this.item.firstname && this.item.firstname.length) &&
                                  !(this.item && this.item.lastname && this.item.lastname.length) },

    },

  methods: {

    close()  { return this.$emit('close') },

    remove() {

        // call REST API

        return aettbok.deleteNodeWithLabelAndId('Person', this.item.id)
        .catch(error => console.error(error))
        .finally(() => this.close())

    },

    save() {

        // convert empty strings to null values

        if (!this.item.firstname) { this.item.firstname = null }
        if (!this.item.lastname)  { this.item.lastname = null }
        if (!this.item.notes)     { this.item.notes = null }

        // call REST API

        return aettbok.upsertNode(this.item, 'Person')
        .catch(error => console.error(error))
        .finally(() => this.close())

    },

    linkedDocument(id) {
        if (this.item.documentedby.includes(id)) { return }
        return this.item.documentedby.push(id)
    },

    linkedParent(id) {
        if (this.item.hasparents.includes(id)) { return }
        return this.item.hasparents.push(id)
    },

    unlinkedDocument(id) {
        let index = this.item.documentedby.findIndex(e => e === id)
        return index === -1 ? null : this.item.documentedby.splice(index, 1)
    },

    unlinkedParent(id) {
        let index = this.item.hasparents.findIndex(e => e === id)
        return index === -1 ? null : this.item.hasparents.splice(index, 1)
    },

    toggleTag(id) { return aettbok.toggleArrayValue(id, this.item.tags) }

  },

  watch: {

    id: function(id) {

        if (id) { return this.item = JSON.parse(JSON.stringify(this.getPerson(id))) }

        return this.item = {
            id: null,
            alive: false,
            documentedby: [],
            firstname: null,
            gender: 'u',
            hasparents: [],
            lastname: null,
            notes: null,
            tags: [],
        }

    }

  },

}
</script>