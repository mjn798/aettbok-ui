<template>
    <v-dialog max-width="750" persistent v-model="showDialog">
        <v-card>
            <v-card-title>Related Documents</v-card-title>
            <v-card-subtitle>for {{ getDisplayForLabel }}</v-card-subtitle>
            <v-card-text>
                <document-viewer-list :id="id" :label="label" />
            </v-card-text>
            <card-actions @close="close" hideSave />
        </v-card>
    </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

import CardActions from '../common/CardActions.vue'
import CardTitle from '../common/CardTitle.vue'
import DocumentViewerList from './DocumentViewerList.vue'

export default {
    
    name: 'DocumentViewerDialog',

    components: {
        'card-actions': CardActions,
        'card-title': CardTitle,
        'document-viewer-list': DocumentViewerList,
    },

    props: {
        id: { type: String, default: undefined },
        label: { type: String, default: undefined },
    },

    computed: {

        ...mapGetters({
            getEvent: 'getEvent',
            getPerson: 'getPerson',
        }),

        showDialog() { return !!this.id && !!this.label },

        getDisplayForLabel() {
            switch (this.label) {

                case 'Event':
                    let event = this.getEvent(this.id)
                    if (!event) { return null }
                    return `${event.typeString} • ${event.attendedString}`.trim()

                case 'Person':
                    let person = this.getPerson(this.id)
                    if (!person) { return null }
                    return `${person.firstname} ${person.lastname}`.trim()

                default: return null

            }
        },

    },

    methods: {

        close() { return this.$emit('close') },

    }

}
</script>