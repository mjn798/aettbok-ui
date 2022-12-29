<template>
    <v-card>
        <event-editor :id="editingItemId" @close="upsertItem(undefined)" />
        <card-title
            @click="upsertItem(null)"
            titletype="event"
        />
        <v-card-text
            :key="event.id"
            v-for="event in getEventsForPerson(selectedPerson.id)"
        >
            <v-card>
                <v-list-item>
                    <v-list-item-icon>
                        <tooltip-button
                            :icon="getIcon(event.type)"
                            :tooltip="getTooltip(event.type)"
                            disabled
                        />
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-subtitle class="ma-2">{{ event.dateFull || '' }} {{ event.wasinString ? `in ${event.wasinString}` : '' }}</v-list-item-subtitle>
                        <v-list-item-subtitle class="ma-2" v-if="event.comment">{{ event.comment }}</v-list-item-subtitle>
                        <v-list-item-subtitle v-if="getOtherAttendees(event).length">
                            <v-chip-group column>
                                <person-chip :id="attendee" :key="attendee" islink longdate v-for="attendee in getOtherAttendees(event)" />
                            </v-chip-group>
                        </v-list-item-subtitle>
                        <v-list-item-subtitle v-if="event.documentedby.length">
                            <document-viewer-list :listofids="event.documentedby" />
                        </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action class="text-right align-self-start"><tooltip-button @click="upsertItem(event.id)" icon="mdi-pencil" tooltip="Edit Event" small /></v-list-item-action>
                </v-list-item>
            </v-card>
        </v-card-text>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

import CardTitle from '../common/CardTitle.vue'
import DocumentViewerList from '../documents/DocumentViewerList.vue'
import EventEditor from '../events/EventEditor.vue'
import PersonChip from './PersonChip.vue'
import PersonQuickCard from './PersonQuickCard.vue'
import TooltipButton from '../common/TooltipButton.vue'

export default {

    name: 'PersonEvents',

    components: {
        'card-title': CardTitle,
        'document-viewer-list': DocumentViewerList,
        'event-editor': EventEditor,
        'person-chip': PersonChip,
        'person-quickcard': PersonQuickCard,
        'tooltip-button': TooltipButton,
    },

    data: () => ({

        editingItemId: undefined,
        viewingDocument: undefined,

        eventTypes: [
            { value: 'BAPTISM', text: 'Baptism', icon: 'mdi-tilde' },
            { value: 'BIRTH', text: 'Birth', icon: 'mdi-asterisk' },
            { value: 'DEATH', text: 'Death', icon: 'mdi-cross' },
            { value: 'DIVORCE', text: 'Divorce',  icon: 'mdi-diameter-variant' },
            { value: 'MARRIAGE', text: 'Marriage', icon: 'mdi-set-none' },
            { value: 'MILITARY', text: 'Military', icon: 'mdi-sword-cross' },
            { value: 'OCCUPATION', text: 'Occupation', icon: 'mdi-hammer-wrench' },
            { value: 'RESIDENCE', text: 'Residence', icon: 'mdi-home' },
        ].sort((a, b) => a.text.localeCompare(b.text))

    }),

    computed: {

        ...mapGetters({
            getDocument: 'getDocument',
            getEvent: 'getEvent',
            getEventsForPerson: 'getEventsForPerson',
            getPerson: 'getPerson',
        }),

        selectedPerson() { return this.getPerson(this.$route.params.id) },

    },

    methods: {

        upsertItem(id) { return this.editingItemId = id },
        viewDocument(id) { return this.viewingDocument = id },

        getOtherAttendees(event) { return (event.attended || null).filter(e => e !== this.selectedPerson.id) },

        getDocumentLabel(id) {
            let document = this.getDocument(id)
            return document.tagLabel ? document.tagLabel : null
        },

        getIcon(type) { return (this.eventTypes.find(e => e.value === type) || { icon : 'mdi-alert-decegram' }).icon },
        getTooltip(type) { return (this.eventTypes.find(e => e.value === type) || { text : 'n/a' }).text },

    },

}
</script>