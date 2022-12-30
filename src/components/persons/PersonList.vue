<template>
    <v-card>
        <person-editor :id="editingItemId" @close="upsertItem(undefined)" />
        <card-title
            :filterIconState="filterState"
            @click="upsertItem(null)"
            @filter="toggleFilter"
            titletype="person"
        />
        <v-card-text>
            <v-expand-transition>
                <v-card v-if="filterState">
                    <v-card-title>
                        <tooltip-button :buttontype="getFilterIsGender" @click="toggleFilterIsGender" />
                        <tooltip-button :buttontype="getFilterIsAlive" @click="toggleFilterIsAlive" />
                        <tooltip-button :buttontype="getFilterIsMarried" @click="toggleFilterIsMarried" />
                        <v-spacer/>
                        <v-text-field
                            class="ma-2"
                            clearable
                            dense
                            hide-details
                            label="Search"
                            outlined
                            prepend-inner-icon="mdi-magnify"
                            v-model="filterHasName"
                        />
                    </v-card-title>
                    <v-card-subtitle>{{ filterSubtitleText }}</v-card-subtitle>
                </v-card>
            </v-expand-transition>
        </v-card-text>
        <v-card-text>
            <v-data-table :headers="tableHeaders" :items="getFilteredItems">
                <template v-slot:[`item.actions`]="{item}">
                    <tooltip-button @click="upsertItem(item.id)" buttontype="edit" small />
                    <tooltip-button :to="`/persons/${item.id}`" buttontype="show-details" small />
                </template>
                <template v-slot:[`item.icon`]="{item}">
                    <icon :icontype="getPersonIcon(item)" />
                    <icon icontype="marriage" small v-if="item.marriages" />
                </template>
                <template v-slot:[`item.numberOfDocuments`]="{item}"><document-viewer :listofids="item.documentedby" /></template>
                <template v-slot:[`item.birth`]="{item}">{{ item.birthLong }}</template>
                <template v-slot:[`item.death`]="{item}">{{ item.deathLong }}</template>
                <template v-slot:[`item.birthLocationString`]="{item}"><location-chip :id="item.birthLocation" v-if="item.birthLocation" /></template>
                <template v-slot:[`item.deathLocationString`]="{item}"><location-chip :id="item.deathLocation" v-if="item.deathLocation" /></template>
            </v-data-table>
        </v-card-text>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

import CardTitle from '../common/CardTitle.vue'
import DocumentViewer from '../documents/DocumentViewer.vue'
import Icon from '../common/Icon.vue'
import LocationChip from '../locations/LocationChip.vue'
import PersonEditor from './PersonEditor.vue'
import TooltipButton from '../common/TooltipButton.vue'

export default {

  name: 'PersonList',

  components: {
      'card-title': CardTitle,
      'document-viewer': DocumentViewer,
      'icon': Icon,
      'location-chip': LocationChip,
      'person-editor': PersonEditor,
      'tooltip-button': TooltipButton,
  },

  data: () => ({

    editingItemId: undefined,

    filterState: false,
    filterHasName: '',
    filterIsAlive: -1,
    filterIsGender: -1,
    filterIsMarried: -1,

    tableHeaders: [
        { value: 'numberOfDocuments', text: '', sortable: true, width: 50 },
        { value: 'icon', text: '', sortable: false, width: 90 },
        { value: 'lastname', text: 'Last Name', sortable: true },
        { value: 'firstname', text: 'First Name', sortable: true },
        { value: 'birth', text: 'Birth', sortable: true },
        { value: 'birthLocationString', text: 'Birth', sortable: true },
        { value: 'death', text: 'Death', sortable: true },
        { value: 'deathLocationString', text: 'Death', sortable: true },
        { value: 'actions', text: 'Actions', sortable: false, align: 'center', width: 110 },
    ],

  }),

  computed: {

    ...mapGetters({
        getPersons: 'getPersons',
    }),

    getFilteredItems() {

        if (!this.filterState) { return this.getPersons }

        return this.getPersons
                .filter(e => this.filterIsAlive === -1 || (!!this.filterIsAlive === e.alive))
                .filter(e => this.filterIsGender === -1 || (this.filterIsGender && e.gender === 'm') || (!this.filterIsGender && e.gender === 'f'))
                .filter(e => this.filterIsMarried === -1 || (!!this.filterIsMarried === !!e.marriages))
                .filter(e => !this.filterHasName || ((e.firstname || '').toLowerCase().includes(this.filterHasName.toLowerCase())) || ((e.lastname || '').toLowerCase().includes(this.filterHasName.toLowerCase())))

    },

    getFilterIsAlive() { return this.filterIsAlive === -1 ? 'showing-status-u' : this.filterIsAlive === 1 ? 'showing-status-a' : 'showing-status-d' },
    getFilterIsGender() { return this.filterIsGender === -1 ? 'showing-persons-u' : this.filterIsGender === 1 ? 'showing-persons-m' : 'showing-persons-f' },
    getFilterIsMarried() { return this.filterIsMarried === -1 ? 'showing-married-u' : this.filterIsMarried === 1 ? 'showing-married-t' : 'showing-married-f' },

    filterSubtitleText()   { return `showing ${this.getFilteredItems.length} out of ${this.getPersons.length} entries` }

  },

  methods: {

    upsertItem(id) { return this.editingItemId = id },

    getPersonIcon(person) { return `person-${person.gender || 'u'}${person.alive ? 'a' : 'd'}` },

    toggleFilterIsAlive()   { return this.filterIsAlive = this.filterIsAlive === 1 ? -1 : this.filterIsAlive + 1 },
    toggleFilterIsGender()  { return this.filterIsGender = this.filterIsGender === 1 ? -1 : this.filterIsGender + 1 },
    toggleFilterIsMarried() { return this.filterIsMarried = this.filterIsMarried === 1 ? -1 : this.filterIsMarried + 1 },

    toggleFilter() {

        this.filterHasName = ''
        this.filterIsAlive = -1
        this.filterIsGender = -1
        this.filterIsMarried = -1

        return this.filterState = !this.filterState

    },

  }

}
</script>