<template>
    <v-card>
        <event-editor :id="editingItemId" @close="upsertItem(undefined)" />
        <card-title
            @click="upsertItem(null)"
            titletype="event"
        />
        <v-card-text
            :key="event.id"
            v-for="event in getItems"
        >
            <v-card>
                <v-list-item>
                    <v-list-item-icon>
                        <icon :icontype="`event-${(event.type || '').toLocaleLowerCase()}`" class="ma-2" />
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-subtitle class="ma-2" v-if="event.dateFull || event.wasin">
                            {{ getDateLocationText(event) }}
                            <location-chip :id="event.wasin" v-if="event.wasin" />
                        </v-list-item-subtitle>
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
                    <v-list-item-action class="text-right align-self-start"><tooltip-button @click="upsertItem(event.id)" buttontype="edit" small /></v-list-item-action>
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
import Icon from '../common/Icon.vue'
import LocationChip from '../locations/LocationChip.vue'
import PersonChip from './PersonChip.vue'
import TooltipButton from '../common/TooltipButton.vue'

export default {

    name: 'PersonEvents',

    components: {
        'card-title': CardTitle,
        'document-viewer-list': DocumentViewerList,
        'event-editor': EventEditor,
        'icon': Icon,
        'location-chip': LocationChip,
        'person-chip': PersonChip,
        'tooltip-button': TooltipButton,
    },

    data: () => ({

        editingItemId: undefined,

    }),

    computed: {

        ...mapGetters({
            getEvents: 'getEvents',
            getEventsForPerson: 'getEventsForPerson',
            getPerson: 'getPerson',
        }),

        selectedPerson() { return this.getPerson(this.$route.params.id) },

        getItems() {

            let involvedids = [this.selectedPerson.id, ...this.selectedPerson.haschildren]

            let events = this.getEvents.filter(e => e.attended.some(person => involvedids.includes(person))).filter(e => e.attended.includes(this.selectedPerson.id) || e.type === 'BIRTH')

            events = JSON.parse(JSON.stringify(events))
            events.forEach(e => { if (!e.attended.includes(this.selectedPerson.id) && e.type === 'BIRTH') { e.type = 'CHILDBIRTH' } })

            return events

        }

    },

    methods: {

        upsertItem(id) { return this.editingItemId = id },

        getOtherAttendees(event) { return (event.attended || null).filter(e => e !== this.selectedPerson.id) },
        getDateLocationText(event) { return `${event.datelong || ''}${event.wasin ? ' in ' : ''}`.trim() },

    },

}
</script>