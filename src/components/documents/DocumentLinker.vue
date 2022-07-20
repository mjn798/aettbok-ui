<template>
    <div>
        <v-autocomplete
            :filter="filterDocuments"
            :items="getDocuments"
            class="ma-2"
            dense
            hide-details
            item-value="id"
            label="Related Documents"
            outlined
            v-model="selectedDocument"
        >
            <template v-slot:[`item`]="{item}">{{ getLabel(item) }}</template>
            <template v-slot:[`selection`]="{item}">{{ getLabel(item) }}</template>
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
        <v-chip-group column class="ma-2" v-if="documents.length">
            <v-chip
                :key="id"
                @click:close="unlinkDocument(id)"
                close
                close-icon="mdi-link-off"
                label
                outlined
                v-for="id in documents"
            >
                {{ getTagLabel(id) }}
            </v-chip>
        </v-chip-group>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

import TooltipButton from '../common/TooltipButton.vue'

export default {

    name: 'DocumentEditor',

    components: {
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

    filterDocuments(item, queryText, itemText) { return true },

    getLabel(item) { return item.tagLabel || '' },

    getTagLabel(id) { return this.getDocument(id).tagLabel },

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