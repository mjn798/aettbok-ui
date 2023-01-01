<template>
    <div>
        <v-autocomplete
            :filter="filterItems"
            :items="getItems"
            :label="label"
            dense
            hide-details
            outlined
            v-model="selectedItem"
        >
            <template v-slot:[`item`]="{item}">{{ item.text }}<small class="ml-2">{{ item.dates }}</small></template>
            <template v-slot:[`selection`]="{item}">{{ item.text }}<small class="ml-2">{{ item.dates }}</small></template>
            <template v-slot:append-outer>
                <div class="mt-n3">
                    <tooltip-button :disabled="selectedItem === null" @click="linkPerson" buttontype="link" />
                </div>
            </template>
        </v-autocomplete>
        <v-chip-group column v-if="persons.length">
            <person-chip
                :key="person"
                :id="person"
                @closed="unlinkPerson"
                closeicon="mdi-link-off"
                v-for="person in persons"
            />
        </v-chip-group>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

import PersonChip from './PersonChip.vue'
import TooltipButton from '../common/TooltipButton.vue'

export default {

    name: 'PersonLinker',

    components: {
        'person-chip': PersonChip,
        'tooltip-button': TooltipButton,
    },

    props: {
        exclude: { type: String, default: null },
        label: { type: String, default: 'Related Persons' },
        persons: { type: Array, default: () => [] },
    },

    data: () => ({
        selectedItem: null,
    }),

    computed: {

        ...mapGetters({
            getPersons: 'getPersons',
        }),

        getItems() { return this.getPersons.filter(e => e.id !== this.exclude).map(e => { return { dates: `(${e.datebirthyear || ''} • ${e.datedeathyear || ''})`.trim(), text: `${e.lastname || ''} ${e.firstname || ''}`.trim(), value: e.id }}) },

    },

    methods: {

        filterItems(item, queryText, itemText) { return (itemText || '').toLocaleLowerCase().includes(queryText.toLocaleLowerCase()) },

        linkPerson() {
            this.$emit('linkedPerson', this.selectedItem)
            return this.selectedItem = null
        },

        unlinkPerson(id) {
            this.$emit('unlinkedPerson', id)
            return this.selectedItem = null
        },

    },

}
</script>