<template>
    <div>
        <linker-autocomplete
            :items="getItems"
            :label="label"
            @link="link"
        />
        <document-viewer-list
            :listofids="linkeditems"
            @closed="unlink"
            closeicon="mdi-link-off"
            v-if="linkeditems.length"
        />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

import DocumentViewerList from '../documents/DocumentViewerList.vue'
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