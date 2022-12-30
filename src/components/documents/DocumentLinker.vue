<template>
    <div>
        <v-autocomplete
            :filter="filterItems"
            :items="getItems"
            dense
            hide-details
            label="Related Documents"
            outlined
            v-model="selectedItem"
        >
            <template v-slot:[`item`]="{item}"><small class="mr-2">{{ item.source }}</small>{{ item.text }}</template>
            <template v-slot:[`selection`]="{item}"><small class="mr-2">{{ item.source }}</small>{{ item.text }}</template>
            <template v-slot:append-outer>
                <div class="mt-n3">
                    <tooltip-button :disabled="selectedItem === null" @click="linkDocument" buttontype="link" />
                </div>
            </template>
        </v-autocomplete>
        <document-viewer-list
            :listofids="documents"
            @closed="unlinkDocument"
            closeicon="mdi-link-off"
            v-if="documents.length"
        />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

import DocumentViewerList from '../documents/DocumentViewerList.vue'
import TooltipButton from '../common/TooltipButton.vue'

export default {

    name: 'DocumentLinker',

    components: {
        'document-viewer-list': DocumentViewerList,
        'tooltip-button': TooltipButton,
    },

    props: {
        documents: { type: Array, default: () => [] },
    },

    data: () => ({
        selectedItem: null,
    }),

    computed: {

        ...mapGetters({
            getDocuments: 'getDocuments',
        }),

        getItems() { return this.getDocuments.map(e => { return { source: e.sourcedbyString, text: e.index, value: e.id }}) },

    },

  methods: {

    filterItems(item, queryText, itemText) { return (item.source || '').toLocaleLowerCase().includes(queryText.toLocaleLowerCase()) || (itemText || '').toLocaleLowerCase().includes(queryText.toLocaleLowerCase()) },

    linkDocument() {
        this.$emit('linkedDocument', this.selectedItem)
        return this.selectedItem = null
    },

    unlinkDocument(id) {
        this.$emit('unlinkedDocument', id)
        return this.selectedItem = null
    },

  },

}
</script>