<template>
    <v-card>
        <document-editor :id="editingItemId" @close="upsertItem(undefined)" />
        <card-title
            @click="upsertItem(null)"
            titletype="document"
        />
        <v-card-text>
            <v-data-table
                :headers="getTableHeaders"
                :items="getFilteredDocuments"
                disable-pagination
                hide-default-footer
            >
                <template v-slot:[`item.actions`]="{item}">
                    <tooltip-button @click="upsertItem(item.id)" icon="mdi-pencil" small tooltip="Edit Document" />
                </template>
                <template v-slot:[`item.date`]="{item}">{{ item.dateLong }}</template>
            </v-data-table>
        </v-card-text>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

import CardTitle from '../common/CardTitle.vue'
import DocumentEditor from './DocumentEditor.vue'
import TooltipButton from '../common/TooltipButton.vue'

export default {
    
    name: 'DocumentList',

    components: {
        'card-title': CardTitle,
        'document-editor': DocumentEditor,
        'tooltip-button': TooltipButton,
    },

    data: () => ({

        editingItemId: undefined,

    }),

    computed: {

        ...mapGetters({
            getDocuments: 'getDocuments'
        }),

        getTableHeaders() { return [
            { value: 'sourcedbyString', text: 'Source', sortable: true },
            { value: 'index', text: 'Document Index', sortable: true },
            { value: 'date', text: 'Date', sortable: true },
            { value: 'actions', text: 'Actions', sortable: false, width: 110 },
        ]},

        getFilteredDocuments() { return this.getDocuments }

    },

    methods: {

        upsertItem(id) { return this.editingItemId = id },

    },

}
</script>