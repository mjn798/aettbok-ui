<template>
    <v-chip-group column>
        <document-editor
            :id="viewingDocument"
            @close="viewDocument(undefined)"
        />
        <v-chip
            :close-icon="closeicon"
            :close="closeicon !== null"
            :key="document.id"
            @click="viewDocument(document.id)"
            @click:close="closed(document.id)"
            class="ma-1"
            label
            v-for="document in getDocuments"
        >
            <small class="mr-2">{{ document.sourcedbytext }}</small>
            {{ document.index }}
        </v-chip>
    </v-chip-group>
</template>

<script>
import { mapGetters } from 'vuex'

import DocumentEditor from '../documents/DocumentEditor.vue'

export default {
    
    name: 'DocumentViewerList',

    components: {
        'document-editor': DocumentEditor,
    },

    props: {
        closeicon: { type: String, default: null },
        id: { type: String, default: null },
        label: { type: String, default: null },
        listofids: { type: Array, default: () => [] },
    },

    data: () => ({
        viewingDocument: undefined
    }),

    computed: {

        ...mapGetters({
            getDocument: 'getDocument',
            getEvent: 'getEvent',
            getPerson: 'getPerson',
        }),

        getPersonDocuments() { return [] },

        getDocumentIds() {

            if (this.listofids.length) { return this.listofids }

            if (!(this.label && this.id)) { return [] }

            switch(this.label) {
                case 'Event': return this.getEvent(this.id).documentedby || []
                case 'Person': return this.getPerson(this.id).documentedby || []
                default: return []
            }

        },

        getDocuments() {

            let documents = this.getDocumentIds.map(e => this.getDocument(e))

            return documents.sort((a, b) => (a.date || '').localeCompare(b.date || ''))

        },

    },

    methods: {

        close() { return this.$emit('close') },
        closed(id) { return this.$emit('closed', id) },
        viewDocument(id) { return this.viewingDocument = id },

    }

}
</script>