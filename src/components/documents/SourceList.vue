<template>
    <v-card>
        <source-editor :id="editingItemId" @close="upsertItem(undefined)" />
        <card-title
            @click="upsertItem(null)"
            titletype="source"
        />
        <v-card-text>
            <v-data-table
                :headers="getTableHeaders"
                :items="getFilteredDocuments"
                disable-pagination
                hide-default-footer
            >
                <template v-slot:[`item.actions`]="{item}">
                    <tooltip-button @click="upsertItem(item.id)" icon="mdi-pencil" small tooltip="Edit Source" />
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

import CardTitle from '../common/CardTitle.vue'
import SourceEditor from './SourceEditor.vue'
import TooltipButton from '../common/TooltipButton.vue'

export default {
    
  name: 'SourceList',

  components: {
    'card-title': CardTitle,
    'source-editor': SourceEditor,
    'tooltip-button': TooltipButton,
  },

  data: () => ({

    editingItemId: undefined,

  }),

    computed: {

        ...mapGetters({
            getSources: 'getSources'
        }),

        getTableHeaders() { return [
            { value: 'storedinString', text: 'Stored in', sortable: true },
            { value: 'source', text: 'Source', sortable: true },
            { value: 'actions', text: 'Actions', sortable: false, width: 110 },
        ]},

        getFilteredDocuments() { return this.getSources },

    },

  methods: {

    upsertItem(id) { return this.editingItemId = id },

  },

}
</script>