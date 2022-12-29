<template>
    <div>
        <v-autocomplete
            :filter="filterDocuments"
            :items="getDocuments"
            class="mx-2 mt-2 mb-n1"
            dense
            hide-details
            item-value="id"
            label="Related Documents"
            outlined
            v-model="selectedDocument"
        >
            <template v-slot:[`item`]="{item}"><small class="mr-2">{{ item.sourcedbyString }}</small>{{ item.index }}</template>
            <template v-slot:[`selection`]="{item}"><small class="mr-2">{{ item.sourcedbyString }}</small>{{ item.index }}</template>
            <template v-slot:append-outer>
                <div class="mt-n2">
                    <tooltip-button
                    :disabled="selectedDocument === null"
                    @click="linkDocument"
                    icon="mdi-link"
                    tooltip="Link Document"
                    />
                </div>
            </template>
        </v-autocomplete>
        <div class="mx-1 mb-3">
            <document-viewer-list
                :listofids="documents"
                @closed="unlinkDocument"
                closeicon="mdi-link-off"
                v-if="documents.length"
            />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

import DocumentViewerList from '../documents/DocumentViewerList.vue'
import TooltipButton from '../common/TooltipButton.vue'

export default {

    name: 'DocumentEditor',

    components: {
        'document-viewer-list': DocumentViewerList,
        'tooltip-button': TooltipButton,
    },

    props: {
        documents: { type: Array, default: () => [] },
    },

    data: () => ({

        selectedDocument: null,

    }),

    computed: {

        ...mapGetters({
            getDocument: 'getDocument',
            getDocuments: 'getDocuments',
        }),

    },

  methods: {

    filterDocuments(item, queryText, itemText) { return (item.sourcedbyString || '').toLocaleLowerCase().includes(queryText.toLocaleLowerCase()) || (item.index || '').toLocaleLowerCase().includes(queryText.toLocaleLowerCase()) },

    linkDocument() {
        this.$emit('linkedDocument', this.selectedDocument)
        return this.selectedDocument = null
    },

    unlinkDocument(id) {
        this.$emit('unlinkedDocument', id)
        return this.selectedDocument = null
    },

  },

}
</script>