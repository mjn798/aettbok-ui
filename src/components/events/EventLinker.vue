<template>
    <div>
        <linker-autocomplete
            :items="getItems"
            :label="label"
            @link="link"
        />
        <v-chip-group column v-if="linkeditems.length">
            <event-chip
                :id="item"
                :key="item"
                @close="unlink"
                closeicon="mdi-link-off"
                v-for="item in linkeditems"
            />
        </v-chip-group>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

import EventChip from './EventChip.vue'
import LinkerAutocomplete from '../common/LinkerAutocomplete.vue'

export default {

    name: 'EventLinker',

    components: {
        'event-chip': EventChip,
        'linker-autocomplete': LinkerAutocomplete,
    },

    props: {
        exclude: { type: String, default: null },
        label: { type: String, default: 'Related Events' },
        linkeditems: { type: Array, default: () => [] },
    },

    computed: {

        ...mapGetters({
            getEvents: 'getEvents',
        }),

        getItems() { return this.getEvents.filter(e => e.id !== this.exclude)
            .map(e => { return {
                detail: e.dateshort || '',
                pretail: e.typetext || '',
                text: e.attendedtext || '',
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