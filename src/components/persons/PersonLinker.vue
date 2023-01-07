<template>
    <div>
        <linker-autocomplete
            :items="getItems"
            :label="label"
            @link="link"
            v-if="getRoleIsEditor"
        />
        <div v-if="!getRoleIsEditor">{{ label }}</div>
        <v-chip-group column v-if="linkeditems.length">
            <person-chip
                :closeicon="getRoleIsEditor ? 'mdi-link-off' : null"
                :id="item"
                :key="item"
                @close="unlink"
                v-for="item in linkeditems"
            />
        </v-chip-group>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

import LinkerAutocomplete from '../common/LinkerAutocomplete.vue'
import PersonChip from './PersonChip.vue'

export default {

    name: 'PersonLinker',

    components: {
        'linker-autocomplete': LinkerAutocomplete,
        'person-chip': PersonChip,
    },

    props: {
        exclude: { type: String, default: null },
        label: { type: String, default: 'Related Persons' },
        linkeditems: { type: Array, default: () => [] },
    },

    computed: {

        ...mapGetters({
            getPersons: 'getPersons',
            getRoleIsEditor: 'getRoleIsEditor',
        }),

        getItems() { return this.getPersons.filter(e => e.id !== this.exclude)
            .map(e => { return {
                detail: `(${e.datebirthyear || ''} • ${e.datedeathyear || ''})`,
                text: `${e.lastname || ''} ${e.firstname || ''}`.trim(),
                value: e.id,
            }})
        },

    },

    methods: {

        link(id) { return this.$emit('link', id) },
        unlink(id) { return this.$emit('unlink', id) },

    },

}
</script>