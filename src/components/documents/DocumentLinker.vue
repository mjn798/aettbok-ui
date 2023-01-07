<template>
    <div>
        <linker-autocomplete
            :items="getItems"
            :label="label"
            @link="link"
            v-if="getRoleIsEditor"
        />
        <div v-if="!getRoleIsEditor">{{ label }}</div>
        <document-viewer-list
            :closeicon="getRoleIsEditor ? 'mdi-link-off' : null"
            :listofids="linkeditems"
            @closed="unlink"
            v-if="linkeditems.length"
        />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

import LinkerAutocomplete from '../common/LinkerAutocomplete.vue'

export default {

    name: 'DocumentLinker',

    components: {
        'document-viewer-list': () => import('../documents/DocumentViewerList.vue'),
        'linker-autocomplete': LinkerAutocomplete,
    },

    props: {
        exclude: { type: String, default: null },
        label: { type: String, default: 'Related Documents' },
        linkeditems: { type: Array, default: () => [] },
    },

    computed: {

        ...mapGetters({
            getDocuments: 'getDocuments',
            getRoleIsEditor: 'getRoleIsEditor',
        }),

        getItems() { return this.getDocuments.filter(e => e.id !== this.exclude)
            .map(e => {
                return {
                    pretail: e.sourcedbytext || '',
                    text: e.index || '',
                    value: e.id,
                }
            })
        },

    },

    methods: {

        link(id) { return this.$emit('link', id) },
        unlink(id) { return this.$emit('unlink', id) },

    },

}
</script>