<template>
    <v-card>
        <person-editor :id="editingItemId" @close="upsertItem(undefined)" />
        <card-title
            :filterIconState="filterState"
            @click="upsertItem(null)"
            @filter="toggleFilter"
            actionIcon="mdi-account-plus"
            actionTooltip="New Person"
            title="Persons"
        />
        <v-card-text>
            <v-expand-transition>
                <v-card v-if="filterState">
                    <v-container fluid>
                        <v-row align="center" no-gutters>
                            <v-col>
                                <tooltip-button :color="filterIsGenderColor" :icon="filterIsGenderIcon" :tooltip="filterIsGenderText" @click="toggleFilterIsGender" />
                                <tooltip-button :color="filterIsAliveColor" :icon="filterIsAliveIcon" :tooltip="filterIsAliveText" @click="toggleFilterIsAlive" />
                                <tooltip-button :color="filterIsMarriedColor" :icon="filterIsMarriedIcon" :tooltip="filterIsMarriedText" @click="toggleFilterIsMarried" />
                            </v-col>
                            <v-col>
                                <v-text-field
                                    class="ma-2"
                                    clearable
                                    dense
                                    hide-details
                                    outlined
                                    prepend-inner-icon="mdi-magnify"
                                    v-model="filterHasName"
                                />
                            </v-col>
                        </v-row>
                    </v-container>
                    <v-card-subtitle>{{ filterSubtitleText }}</v-card-subtitle>
                </v-card>
            </v-expand-transition>
        </v-card-text>
        <v-card-text>
            <v-data-table
                :headers="getTableHeaders"
                :items="getFilteredPersons"
                disable-pagination
                hide-default-footer
            >
                <template v-slot:[`item.actions`]="{item}">
                    <tooltip-button @click="upsertItem(item.id)" icon="mdi-pencil" small tooltip="Edit Person" />
                    <tooltip-button :to="`/persons/${item.id}`" icon="mdi-view-dashboard" small tooltip="View Person" />
                </template>
                <template v-slot:[`item.icon`]="{item}">
                    <person-icon :alive="item.alive" :color="item.iconColor" :icon="item.icon" />
                    <v-icon color="grey lighten-1" small v-if="item.marriages">mdi-set-none</v-icon>
                </template>
                <template v-slot:[`item.numberOfDocuments`]="{item}">
                    <tooltip-button :icon="item.numberOfDocumentsIcon" :tooltip="`${item.numberOfDocuments} Documents`" small />
                </template>
                <template v-slot:[`item.birth`]="{item}">{{ item.birthlong }}</template>
                <template v-slot:[`item.death`]="{item}">{{ item.deathlong }}</template>
            </v-data-table>
        </v-card-text>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

import CardTitle from '../common/CardTitle.vue'
import PersonEditor from './PersonEditor.vue'
import PersonIcon from './PersonIcon.vue'
import TooltipButton from '../common/TooltipButton.vue'

export default {

  name: 'PersonList',

  components: {
      'card-title': CardTitle,
      'person-editor': PersonEditor,
      'person-icon': PersonIcon,
      'tooltip-button': TooltipButton,
  },

  data: () => ({

    editingItemId: undefined,
    filterState: false,

    filterHasName: '',
    filterIsAlive: -1,
    filterIsGender: -1,
    filterIsMarried: -1,

  }),

  computed: {

    ...mapGetters({
        getPersons: 'getPersons',
    }),

    getTableHeaders() { return [
        { value: 'numberOfDocuments', text: '', sortable: true, width: 45 },
        { value: 'icon', text: '', sortable: false, width: 90 },
        { value: 'lastname', text: 'Last Name', sortable: true },
        { value: 'firstname', text: 'First Name', sortable: true },
        { value: 'birth', text: 'Birth', sortable: true },
        { value: 'birthLocation', text: 'Birth', sortable: true },
        { value: 'death', text: 'Death', sortable: true },
        { value: 'deathLocation', text: 'Death', sortable: true },
        { value: 'actions', text: 'Actions', sortable: false, width: 110 },
    ]},

    getFilteredPersons() {

        if (!this.filterState) { return this.getPersons }

        return this.getPersons
                .filter(e => this.filterIsAlive === -1 || (!!this.filterIsAlive === e.alive))
                .filter(e => this.filterIsGender === -1 || (this.filterIsGender && e.gender === 'm') || (!this.filterIsGender && e.gender === 'f'))
                .filter(e => this.filterIsMarried === -1 || (!!this.filterIsMarried === !!e.marriages))
                .filter(e => !this.filterHasName || (e.firstname && e.firstname.toLowerCase().includes(this.filterHasName.toLowerCase())) || (e.lastname && e.lastname.toLowerCase().includes(this.filterHasName.toLowerCase())))

    },

    filterIsAliveColor()   { return this.filterIsAlive === -1 ? 'grey lighten-1' : this.filterIsAlive === 0 ? 'grey lighten-2' : 'grey' },
    filterIsAliveIcon()    { return this.filterIsAlive === -1 ? 'mdi-circle-opacity' : this.filterIsAlive === 0 ? 'mdi-circle-outline' : 'mdi-circle' },
    filterIsAliveText()    { return this.filterIsAlive === -1 ? 'Showing all' : this.filterIsAlive === 0 ? 'Showing dead only' : 'Showing alive only' },
    filterIsGenderColor()  { return this.filterIsGender === -1 ? 'grey lighten-1' : this.filterIsGender === 0 ? 'pink darken-2' : 'blue darken-2' },
    filterIsGenderIcon()   { return this.filterIsGender === -1 ? 'mdi-human-male-female' : this.filterIsGender === 0 ? 'mdi-human-female' : 'mdi-human-male' },
    filterIsGenderText()   { return this.filterIsGender === -1 ? 'Showing all' : this.filterIsGender === 0 ? 'Showing female only' : 'Showing male only' },
    filterIsMarriedColor() { return this.filterIsMarried === -1 ? 'grey lighten-1' : this.filterIsMarried === 0 ? 'grey lighten-2' : 'grey' },
    filterIsMarriedIcon()  { return this.filterIsMarried === -1 ? 'mdi-circle-double' : this.filterIsMarried === 0 ? 'mdi-circle-outline' : 'mdi-set-none' },
    filterIsMarriedText()  { return this.filterIsMarried === -1 ? 'Showing all' : this.filterIsMarried === 0 ? 'Showing unmarried only' : 'Showing married only' },

    filterSubtitleText()   { return `showing ${this.getFilteredPersons.length} out of ${this.getPersons.length} entries` }

  },

  methods: {

    upsertItem(id) { return this.editingItemId = id },

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