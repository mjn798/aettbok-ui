<template>
    <v-card>
        <event-editor :id="editingItemId" @close="upsertItem(undefined)" />
        <document-editor :id="viewingDocument" @close="viewDocument(undefined)" />
        <card-title
            @click="upsertItem(null)"
            actionIcon="mdi-calendar-plus"
            actionTooltip="New Event"
            title="Personal Events"
        />
        <v-timeline dense class="mx-4">
            <v-timeline-item
                :icon="getIcon(event.type)"
                :key="event.id"
                color="grey"
                fill-dot
                small
                v-for="event in getEventsForPerson(selectedPerson.id)"
            >
                <v-card>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-subtitle>{{ event.dateFull || '' }} {{ event.wasinString ? `in ${event.wasinString}` : '' }}</v-list-item-subtitle>
                            <v-list-item-subtitle v-if="event.comment">{{ event.comment }}</v-list-item-subtitle>
                            <v-list-item-subtitle v-if="event.documentedby.length">
                                <v-chip-group column class="ma-2">
                                    <v-chip
                                        :key="id"
                                        @click="viewDocument(id)"
                                        label
                                        outlined
                                        v-for="id in event.documentedby"
                                    >
                                        {{ getDocumentLabel(id) }}
                                    </v-chip>
                                </v-chip-group>
                            </v-list-item-subtitle>
                            <v-list-item-subtitle
                                :key="attendee"
                                v-for="attendee in getOtherAttendees(event)"
                            >
                                <person-quickcard class="mt-4" :id="attendee" />
                            </v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                            <tooltip-button @click="upsertItem(event.id)" icon="mdi-pencil" tooltip="Edit Event" small />
                        </v-list-item-action>
                    </v-list-item>
                </v-card>
            </v-timeline-item>
        </v-timeline>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

import CardTitle from '../common/CardTitle.vue'
import DocumentEditor from '../documents/DocumentEditor.vue'
import EventEditor from '../events/EventEditor.vue'
import PersonQuickCard from './PersonQuickCard.vue'
import TooltipButton from '../common/TooltipButton.vue'

export default {

    name: 'PersonEvents',

    components: {
        'card-title': CardTitle,
        'document-editor': DocumentEditor,
        'event-editor': EventEditor,
        'person-quickcard': PersonQuickCard,
        'tooltip-button': TooltipButton,
    },

    data: () => ({

        editingItemId: undefined,
        viewingDocument: undefined,

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

        getIcon(event) {
            switch(event) {
                case 'BIRTH': return 'mdi-star'
                case 'DEATH': return 'mdi-cross'
                case 'MARRIAGE': return 'mdi-set-none'
                case 'MILITARY': return 'mdi-bow-arrow'
                case 'RESIDENCE': return 'mdi-home'
                case 'WORK': return 'mdi-hammer-wrench'
                default: return 'mdi-alert-decagram'
            }
        }

    },

}
</script>