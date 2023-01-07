<template>
    <v-dialog max-width="830" persistent v-model="showDialog">
        <v-card>
            <v-card-title>{{ getDialogTitle }}</v-card-title>
            <v-card-text>

                <v-row no-gutters v-if="getRoleIsEditor">
                    <v-col cols="12" sm="6"><v-text-field class="ma-2" dense hide-details label="First Name" outlined v-model="item.firstname" /></v-col>
                    <v-col cols="12" sm="6"><v-text-field class="ma-2" dense hide-details label="Last Name" outlined v-model="item.lastname" /></v-col>
                </v-row>
                <div class="ma-2" v-else>
                    <icon :icontype="getPersonIcon" />
                    {{ item.firstname }}
                    <span style="font-weight: bold; text-transform: uppercase;">{{ item.lastname }}</span>
                </div>

                <v-row no-gutters v-if="getRoleIsEditor">
                    <v-col cols="12" sm="6">
                        <v-radio-group class="mx-4" mandatory row v-model="item.gender">
                            <v-radio color="blue darken-2" label="Male" value="m" />
                            <v-radio color="pink darken-2" label="Female" value="f" />
                            <v-radio color="grey" label="Unknown" value="u" />
                        </v-radio-group>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-radio-group class="mx-4" mandatory row v-model="item.alive">
                            <v-radio color="grey darken-2" label="Living" :value="true" />
                            <v-radio color="grey lighten-1" label="Deceased" :value="false" />
                        </v-radio-group>
                    </v-col>
                </v-row>

                <v-textarea class="ma-2" dense height="100" hide-details label="Notes" outlined v-model="item.notes" v-if="getRoleIsEditor" />
                <div class="ma-2 my-8" style="white-space: pre-line" v-else-if="item.notes">{{ item.notes }}</div>

                <person-linker :exclude="item.id" :linkeditems="item.hasparents" @link="(id) => link(id, item.hasparents)" @unlink="(id) => unlink(id, item.hasparents)" class="ma-2" label="Parents" />
                <person-linker :exclude="item.id" :linkeditems="item.haschildren" @link="(id) => link(id, item.haschildren)" @unlink="(id) => unlink(id, item.haschildren)" class="ma-2" label="Children" />
                <document-linker :linkeditems="item.documentedby" @link="(id) => link(id, item.documentedby)" @unlink="(id) => unlink(id, item.documentedby)" class="ma-2" />

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
import DocumentLinker from '../documents/DocumentLinker.vue'
import Icon from '../common/Icon.vue'
import PersonLinker from './PersonLinker.vue'
import TagChips from '../tags/TagChips.vue'

export default {

    name: 'PersonEditor',

    components: {
        'card-actions': CardActions,
        'document-linker': DocumentLinker,
        'icon': Icon,
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
            getRoleIsEditor: 'getRoleIsEditor',
        }),

        showDialog() { return this.id !== undefined },

        getDialogTitle() { return (!this.getRoleIsEditor ? 'View ' : this.isNewDialog ? 'New ' : 'Edit ') + 'Person' },

        isNewDialog() { return !this.id },
        isSaveDisabled() { return !(this.item && this.item.firstname && this.item.firstname.length) &&
                                  !(this.item && this.item.lastname && this.item.lastname.length) },

        getPersonIcon() { return `person-${this.item.gender || 'u'}${this.item.alive ? 'a' : 'd'}` },

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

        link(id, array) { return array.findIndex(e => e === id) === -1 ? array.push(id) : null },

        unlink(id, array) {
            let index = array.findIndex(e => e === id)
            return index === -1 ? null : array.splice(index, 1)
        },

        toggleTag(id) { return aettbok.toggleArrayValue(id, this.item.tags) },

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