<template>
    <v-card>
        <v-card-title>Documents</v-card-title>
        <v-card-text
            :key="source.id"
            v-for="source in getSourcesForLocation"
        >
            {{ source.source }}
            <document-viewer-list :listofids="source.documentedby" />
        </v-card-text>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

import DocumentViewerList from '../documents/DocumentViewerList.vue'

export default {

    name: 'LocationSourcesDocuments',

    components: {
        'document-viewer-list': DocumentViewerList,
    },

    data: () => ({

    }),

    computed: {

        ...mapGetters({
            getLocation: 'getLocation',
            getSources: 'getSources',
        }),

        selectedItem() { return this.getLocation(this.$route.params.id) },

        getSourcesForLocation() { return this.getSources.filter(e => e.storedin === this.selectedItem.id) },

    },

    methods: {

    },

}
</script>