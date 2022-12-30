<template>
    <v-dialog max-width="750" persistent v-model="showDialog">
        <template v-slot:activator="{ }">
            <tooltip-button
                :buttontype="getButtontype"
                :disabled="!listofids.length"
                @click="showDialog = true"
                small
            />
        </template>
        <v-card>
            <v-card-title>Related Documents</v-card-title>
            <v-card-text>
                <document-viewer-list :listofids="listofids" />
            </v-card-text>
            <card-actions @close="showDialog = false" hideSave />
        </v-card>
    </v-dialog>
</template>

<script>
import CardActions from '../common/CardActions.vue'
import CardTitle from '../common/CardTitle.vue'
import DocumentViewerList from './DocumentViewerList.vue'
import TooltipButton from '../common/TooltipButton.vue'

export default {
    
    name: 'DocumentViewer',

    components: {
        'card-actions': CardActions,
        'card-title': CardTitle,
        'document-viewer-list': DocumentViewerList,
        'tooltip-button': TooltipButton,
    },

    props: {
        listofids: { type: Array, default: () => [] },
    },

    data: () => ({

        showDialog: false,

    }),

    computed: {

        getButtontype() { return `documents-${ Math.min(this.listofids.length || 0, 10) }` }

    },

}
</script>