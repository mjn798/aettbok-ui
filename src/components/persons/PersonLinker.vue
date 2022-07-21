<template>
    <div>
        <v-autocomplete
            :filter="filterPersons"
            :items="getPersons"
            :label="label"
            class="ma-2"
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
        <v-chip-group column class="ma-2" v-if="persons.length">
            <v-chip
                :color="getColor(getPerson(id))"
                :key="id"
                @click:close="unlinkPerson(id)"
                close
                close-icon="mdi-link-off"
                label
                outlined
                v-for="id in persons"
            >
                {{ getLabel(getPerson(id)) }}
                <small class="ml-2">{{ getDates(getPerson(id)) }}</small>
            </v-chip>
        </v-chip-group>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

import TooltipButton from '../common/TooltipButton.vue'

export default {

    name: 'PersonLinker',

    components: {
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