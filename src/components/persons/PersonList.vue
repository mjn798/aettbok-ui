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
            <data-table
                :headers="tableHeaders"
                :items="getFilteredItems"
                @edit="upsertItem"
                @view="navigateTo"
            />
        </v-card-text>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

import CardTitle from '../common/CardTitle.vue'
import DataTable from '../common/DataTable.vue'
import PersonEditor from './PersonEditor.vue'
import TooltipButton from '../common/TooltipButton.vue'

export default {

  name: 'PersonList',

  components: {
      'card-title': CardTitle,
      'data-table': DataTable,
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

    tableHeaders: ['documentscount', 'personicons', 'lastname', 'firstname', 'datebirth', 'birthlocationtext', 'datedeath', 'deathlocationtext', 'actionsview'],

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
                .filter(e => !this.filterHasName || (`${e.firstname || ''} ${e.lastname || ''}`.trim().toLocaleLowerCase().includes(this.filterHasName.toLocaleLowerCase())))

    },

    getFilterIsAlive() { return this.filterIsAlive === -1 ? 'showing-status-u' : this.filterIsAlive === 1 ? 'showing-status-a' : 'showing-status-d' },
    getFilterIsGender() { return this.filterIsGender === -1 ? 'showing-persons-u' : this.filterIsGender === 1 ? 'showing-persons-m' : 'showing-persons-f' },
    getFilterIsMarried() { return this.filterIsMarried === -1 ? 'showing-married-u' : this.filterIsMarried === 1 ? 'showing-married-t' : 'showing-married-f' },

    filterSubtitleText()   { return `showing ${this.getFilteredItems.length} out of ${this.getPersons.length} entries` }

  },

  methods: {

    upsertItem(id) { return this.editingItemId = id },
    navigateTo(id) { return this.$router.push(`/persons/${id}`) },

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