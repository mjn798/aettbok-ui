<template>
    <div>
        <event-editor :id="editingEventId" @close="upsertEvent(undefined)" />
        <v-data-table
            :footer-props="{ 'items-per-page-options': [15, 25, 50, -1] }"
            :headers="getTableHeaders"
            :items="items"
        >
            <template v-slot:[`item.actions`]="{item}"><tooltip-button @click="edit(item.id)" buttontype="edit" small /></template>
            <template v-slot:[`item.birthlocationtext`]="{item}"><location-chip :id="item.birthlocation" v-if="item.birthlocation" /></template>
            <template v-slot:[`item.date`]="{item}">{{ item.datelong }}</template>
            <template v-slot:[`item.datebirth`]="{item}">{{ item.datebirthlong }}</template>
            <template v-slot:[`item.datedeath`]="{item}">{{ item.datedeathlong }}</template>
            <template v-slot:[`item.deathlocationtext`]="{item}"><location-chip :id="item.deathlocation" v-if="item.deathlocation" /></template>
            <template v-slot:[`item.documentscount`]="{item}"><document-viewer :listofids="item.documentedby" /></template>
            <template v-slot:[`item.location`]="{item}"><location-chip :id="item.id" v-if="item.id" /></template>
            <template v-slot:[`item.sourcedbytext`]="{item}"><source-chip :id="item.sourcedby" /></template>
            <template v-slot:[`item.storedintext`]="{item}"><location-chip :id="item.storedin" v-if="item.storedin" /></template>
            <template v-slot:[`item.tagtype`]="{item}"><icon :icontype="item.icon" /></template>
            <template v-slot:[`item.wasintext`]="{item}"><location-chip :id="item.wasin" v-if="item.wasin" /></template>
            <template v-slot:[`item.actionsview`]="{item}">
                <tooltip-button @click="edit(item.id)" buttontype="edit" small />
                <tooltip-button @click="view(item.id)" buttontype="show-details" small />
            </template>
            <template v-slot:[`item.attendedtext`]="{item}">
                <person-chip
                    :id="person"
                    :key="person"
                    islink
                    v-for="person in item.attended"
                />
            </template>
            <template v-slot:[`item.personicons`]="{item}">
                <icon :icontype="getPersonIcon(item)" />
                <icon icontype="marriage" small v-if="item.marriages" />
            </template>
            <template v-slot:[`item.taglabel`]="{item}">
                <document-viewer-list :listofids="[item.id]" v-if="item.id && item.tagtype === 'document'" />
                <location-chip :id="item.id" v-if="item.id && item.tagtype === 'location'" />
                <person-chip :id="item.id" islink v-if="item.id && item.tagtype === 'person'" />
                <source-chip :id="item.id" v-if="item.id && item.tagtype === 'source'" />
                <div class="mx-2" v-if="item.id && item.tagtype === 'event'">{{ item.taglabel }} <tooltip-button @click="upsertEvent(item.id)" buttontype="edit" small /></div>
            </template>
        </v-data-table>
    </div>
</template>

<script>
import DocumentViewer from '../documents/DocumentViewer.vue'
import DocumentViewerList from '../documents/DocumentViewerList.vue'
import EventEditor from '../events/EventEditor.vue'
import Icon from '../common/Icon.vue'
import LocationChip from '../locations/LocationChip.vue'
import PersonChip from '../persons/PersonChip.vue'
import SourceChip from '../sources/SourceChip.vue'
import TooltipButton from './TooltipButton.vue'

export default {

    name: 'DataTable',

    props: {
        headers: { type: Array, default: () => [] },
        items: { type: Array, default: () => [] },
    },

    components: {
        'document-viewer': DocumentViewer,
        'document-viewer-list': DocumentViewerList,
        'event-editor': EventEditor,
        'icon': Icon,
        'location-chip': LocationChip,
        'person-chip': PersonChip,
        'source-chip': SourceChip,
        'tooltip-button': TooltipButton,
    },

    data: () => ({

        editingEventId: undefined,

        tableHeaders: [

            // order matters

            { value: 'documentscount', text: '', sortable: true, width: 50 },
            { value: 'personicons', text: '', sortable: false, width: 90 },
            { value: 'source', text: 'Source', sortable: true },
            { value: 'lastname', text: 'Last Name', sortable: true },
            { value: 'firstname', text: 'First Name', sortable: true },
            { value: 'datebirth', text: 'Birth', sortable: true },
            { value: 'birthlocationtext', text: 'Birth', sortable: true },
            { value: 'datedeath', text: 'Death', sortable: true },
            { value: 'deathlocationtext', text: 'Death', sortable: true },
            { value: 'sourcedbytext', text: 'Source', sortable: true },
            { value: 'typetext', text: 'Type', sortable: true, align: 'end' },
            { value: 'locationtypetext', text: 'Type', sortable: true, align: 'end' },
            { value: 'location', text: 'Location', sortable: true },
            { value: 'partofresolved', text: 'Part of', sortable: true },
            { value: 'index', text: 'Document Index', sortable: true },
            { value: 'attendedtext', text: 'Attendees', sortable: false },
            { value: 'date', text: 'Date', sortable: true },
            { value: 'wasintext', text: 'Location', sortable: true },
            { value: 'containedintext', text: 'Contained in', sortable: true },
            { value: 'storedintext', text: 'Stored in', sortable: true },
            { value: 'tagtype', text: '', sortable: true, align: 'center', width: 50 },
            { value: 'taglabel', text: 'Label', sortable: true },
            { value: 'tagdetails', text: 'Details', sortable: false },
            { value: 'actions', text: 'Actions', sortable: false, align: 'center', width: 50 },
            { value: 'actionsview', text: 'Actions', sortable: false, align: 'center', width: 110 },

        ]

    }),

    computed: {

        getTableHeaders() { return this.tableHeaders.filter(e => this.headers.includes(e.value)) },

    },

    methods: {

        edit(id) { return this.$emit('edit', id) },
        view(id) { return this.$emit('view', id) },

        upsertEvent(id) { return this.editingEventId = id },

        getPersonIcon(person) { return `person-${person.gender || 'u'}${person.alive ? 'a' : 'd'}` },

    },

}
</script>