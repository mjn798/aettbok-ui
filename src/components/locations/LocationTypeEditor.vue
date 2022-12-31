<template>
    <v-dialog max-width="480" persistent v-model="showDialog">
        <locationtypedetail-editor :id="editingItemId" @close="upsertItem(undefined)" />
        <v-card>
            <card-title
                @click="upsertItem(null)"
                titletype="locationtype"
            />
            <v-card-text>
                <v-data-table :headers="tableHeaders" :items="getLocationTypes" dense>
                    <template v-slot:[`item.actions`]="{item}">
                        <tooltip-button @click="upsertItem(item.id)" buttontype="edit" small />
                    </template>
                    <template v-slot:[`item.hierarchy`]="{item}">
                        <v-icon color="grey">mdi-numeric-{{ item.hierarchy }}-box-outline</v-icon>
                    </template>
                </v-data-table>
            </v-card-text>
            <card-actions :allowRemove="false" :isSaveDisabled="false" @close="close" hideSave />
        </v-card>
    </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

import CardActions from '../common/CardActions.vue'
import CardTitle from '../common/CardTitle.vue'
import LocationTypeDetailEditor from './LocationTypeDetailEditor.vue'
import TooltipButton from '../common/TooltipButton.vue'

export default {

    name: 'LocationTypeEditor',

    components: {
        'card-actions': CardActions,
        'card-title': CardTitle,
        'locationtypedetail-editor': LocationTypeDetailEditor,
        'tooltip-button': TooltipButton,
    },

    props: {
        showDialog: { type: Boolean, default: false },
    },

    data: () => ({

        editingItemId: undefined,

        tableHeaders: [
            { value: 'hierarchy', text: 'Hierarchy', sortable: true, align: 'center' },
            { value: 'type', text: 'Type', sortable: true },
            { value: 'actions', text: 'Actions', sortable: false, width: 55, align: 'center' },
        ],

    }),

    computed: {

        ...mapGetters({
            getLocationTypes: 'getLocationTypes',
        }),

    },

  methods: {

    upsertItem(id) { return this.editingItemId = id },

    close() { return this.$emit('close') },

  },

}
</script>