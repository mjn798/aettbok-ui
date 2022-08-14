<template>
    <v-card>
        <v-card-text>
            <v-data-table
                :headers="getTableHeaders"
                :items="getTaggedNodes"
                disable-pagination
                hide-default-footer
            >
                <template v-slot:[`item.link`]="{item}">
                    <tooltip-button :to="item.link" icon="mdi-view-dashboard" small :tooltip="`View ${item.type}`" />
                </template>
                <template v-slot:[`item.icon`]="{item}">
                    <person-icon :alive="item.icon.alive" :color="item.icon.iconColor" :icon="item.icon.icon" class="mr-2" v-if="item.type === 'Person'" />
                    <v-icon v-else>{{ item.icon }}</v-icon>
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

import PersonIcon from '../persons/PersonIcon.vue'
import TooltipButton from '../common/TooltipButton.vue'

export default {

  name: 'TagDetails',

  components: {
    'person-icon': PersonIcon,
    'tooltip-button': TooltipButton,
  },

  props: {
    selected: { type: Array, default: () => [] },
  },

  computed: {

    ...mapGetters({
        getLocations: 'getLocations',
        getPersons: 'getPersons',
    }),

    getTableHeaders() { return [
        { value: 'icon', text: '', sortable: false, align: 'center' },
        { value: 'label', text: 'Label', sortable: true },
        { value: 'details', text: 'Details', sortable: false },
        { value: 'link', text: 'Link', sortable: false, align: 'center' },
    ]},

    getTaggedLocations() {
        return this.getLocations.filter(e => {
            let result = false
            e.tags.forEach(tag => {
                if (this.selected.includes(tag)) { return result = true }
            })
            return result
        }).map(e => {
            return {
                details: (e.partofResolved || ''),
                icon: 'mdi-map-marker',
                label: (e.location || ''),
                link: `/locations/${e.id}`,
                type: 'Location',
            }
        })
    },

    getTaggedPersons() {
        return this.getPersons.filter(e => {
            let result = false
            e.tags.forEach(tag => {
                if (this.selected.includes(tag)) { return result = true }
            })
            return result
        }).map(e => {
            return {
                details: `${(e.birthLong || '')} - ${(e.deathLong || '')}`.trim(),
                icon: { alive: e.alive, icon: e.icon, iconColor: e.iconColor },
                label: `${(e.lastname || '')} ${(e.firstname || '')}`.trim(),
                link: `/persons/${e.id}`,
                type: 'Person',
            }
        })
    },

    getTaggedNodes() {

        return this.getTaggedLocations.concat(this.getTaggedPersons).sort((a, b) => (a.label || '').toUpperCase().localeCompare((b.label || '').toUpperCase()))

    },

  },

}
</script>