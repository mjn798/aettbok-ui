<template>
    <div>
        <v-autocomplete
            :filter="filterPersons"
            :items="getPersons"
            :label="label"
            class="mx-2 mt-2 mb-n1"
            dense
            hide-details
            item-value="id"
            outlined
            v-model="selectedPerson"
        >
            <template v-slot:[`item`]="{item}">{{ getLabel(item) }}<small class="ml-2">{{ getDates(item) }}</small></template>
            <template v-slot:[`selection`]="{item}">{{ getLabel(item) }}<small class="ml-2">{{ getDates(item) }}</small></template>
            <template v-slot:append-outer>
                <div class="mt-n2">
                    <tooltip-button
                        :disabled="selectedPerson === null"
                        @click="linkPerson"
                        icon="mdi-link"
                        tooltip="Link Person"
                    />
                </div>
            </template>
        </v-autocomplete>
        <v-chip-group class="mx-1 mb-3" column v-if="persons.length">
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
        persons: { type: Array, default: () => [] },
        label: { type: String, default: 'Related Persons' },
    },

    data: () => ({

        selectedPerson: null,

    }),

    computed: {

        ...mapGetters({
            getPerson: 'getPerson',
            getPersons: 'getPersons',
        })

    },

    methods: {

        filterPersons(item, queryText, itemText) { return (item.firstname || '').toLocaleLowerCase().includes(queryText.toLocaleLowerCase()) || (item.lastname || '').toLocaleLowerCase().includes(queryText.toLocaleLowerCase()) },

        getDates(item) { return `(${item.birthYear || ''} - ${item.deathYear || ''})`.trim() },
        getLabel(item) { return `${item.lastname || ''} ${item.firstname || ''}`.trim() },

        getColor(item) { return item.iconColor },

        linkPerson() {
            this.$emit('linkedPerson', this.selectedPerson)
            return this.selectedPerson = null
        },

        unlinkPerson(id) {
            this.$emit('unlinkedPerson', id)
            return this.selectedPerson = null
        },

    },

}
</script>