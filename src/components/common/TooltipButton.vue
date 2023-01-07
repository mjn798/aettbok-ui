<template>
    <v-tooltip bottom>
        <template v-slot:activator="{ on }">
            <v-btn
                :color="getColor"
                :dark="!!getColor && !disabled"
                :disabled="disabled"
                :fab="!!getColor"
                :icon="!getColor"
                :small="small || !!getColor"
                :to="to"
                @click="clicked"
                class="ma-1"
                elevation="0"
                v-on="on"
            >
                <icon :icontype="buttontype" :small="small" />
            </v-btn>
        </template>
        <span>{{ getTooltip.tooltip }}</span>
    </v-tooltip>
</template>

<script>
import Icon from './Icon.vue'

const colorHiding = 'grey lighten-2'
const colorShowing = 'grey'
const colorMale = 'blue darken-2'
const colorFemale = 'pink darken-2'

const tooltips = new Map()

tooltips.set('default', { tooltip: 'n/a', color: 'orange' })

tooltips.set('action-delete', { tooltip: 'Delete', color: null })
tooltips.set('action-ko', { tooltip: 'Close', color: null })
tooltips.set('action-ok', { tooltip: 'Save', color: 'success' })
tooltips.set('document-new', { tooltip: 'New Document', color: null })
tooltips.set('documents-0', { tooltip: 'No related Documents', color: null })
tooltips.set('documents-1', { tooltip: '1 related Document', color: null })
tooltips.set('documents-10', { tooltip: 'more than 9 related Documents', color: null })
tooltips.set('documents-2', { tooltip: '2 related Documents', color: null })
tooltips.set('documents-3', { tooltip: '3 related Documents', color: null })
tooltips.set('documents-4', { tooltip: '4 related Documents', color: null })
tooltips.set('documents-5', { tooltip: '5 related Documents', color: null })
tooltips.set('documents-6', { tooltip: '6 related Documents', color: null })
tooltips.set('documents-7', { tooltip: '7 related Documents', color: null })
tooltips.set('documents-8', { tooltip: '8 related Documents', color: null })
tooltips.set('documents-9', { tooltip: '9 related Documents', color: null })
tooltips.set('edit', { tooltip: 'Edit', color: null })
tooltips.set('event-baptism', { tooltip: 'Baptism', color: null })
tooltips.set('event-birth', { tooltip: 'Birth', color: null })
tooltips.set('event-death', { tooltip: 'Death', color: null })
tooltips.set('event-divorce', { tooltip: 'Divorce', color: null })
tooltips.set('event-marriage', { tooltip: 'Marriage', color: null })
tooltips.set('event-military', { tooltip: 'Military', color: null })
tooltips.set('event-new', { tooltip: 'New Event', color: null })
tooltips.set('event-occupation', { tooltip: 'Occupation', color: null })
tooltips.set('event-residence', { tooltip: 'residence', color: null })
tooltips.set('filter-normal', { tooltip: 'Apply Filter', color: null })
tooltips.set('filter-remove', { tooltip: 'Remove Filter', color: null })
tooltips.set('hiding-baptism', { tooltip: 'Hiding Baptisms', color: colorHiding })
tooltips.set('hiding-birth', { tooltip: 'Hiding Births', color: colorHiding })
tooltips.set('hiding-death', { tooltip: 'Hiding Deaths', color: colorHiding })
tooltips.set('hiding-divorce', { tooltip: 'Hiding Divorces', color: colorHiding })
tooltips.set('hiding-documents', { tooltip: 'Hiding Documents', color: colorHiding })
tooltips.set('hiding-events', { tooltip: 'Hiding Events', color: colorHiding })
tooltips.set('hiding-locations', { tooltip: 'Hiding Locations', color: colorHiding })
tooltips.set('hiding-marriage', { tooltip: 'Hiding Marriages', color: colorHiding })
tooltips.set('hiding-military', { tooltip: 'Hiding Military', color: colorHiding })
tooltips.set('hiding-occupation', { tooltip: 'Hiding Occupation', color: colorHiding })
tooltips.set('hiding-persons', { tooltip: 'Hiding Persons', color: colorHiding })
tooltips.set('hiding-residence', { tooltip: 'Hiding Residence', color: colorHiding })
tooltips.set('hiding-sources', { tooltip: 'Hiding Sources', color: colorHiding })
tooltips.set('link', { tooltip: 'Link', color: null })
tooltips.set('location-edit', { tooltip: 'Edit Location', color: null })
tooltips.set('location-new', { tooltip: 'New Location', color: null })
tooltips.set('locations-exact', { tooltip: 'Location only', color: null })
tooltips.set('locations-radius', { tooltip: 'Location and parts', color: null })
tooltips.set('locationtype-new', { tooltip: 'New Location Type', color: null })
tooltips.set('locationtypes-edit', { tooltip: 'Edit Location Types', color: null })
tooltips.set('person-edit', { tooltip: 'Edit Person', color: null })
tooltips.set('person-new', { tooltip: 'New Person', color: null })
tooltips.set('show-details', { tooltip: 'Show Details', color: null })
tooltips.set('showing-baptism', { tooltip: 'Showing Baptisms', color: colorShowing })
tooltips.set('showing-birth', { tooltip: 'Showing Births', color: colorShowing })
tooltips.set('showing-death', { tooltip: 'Showing Deaths', color: colorShowing })
tooltips.set('showing-divorce', { tooltip: 'Showing Divorces', color: colorShowing })
tooltips.set('showing-documents', { tooltip: 'Showing Documents', color: colorShowing })
tooltips.set('showing-events', { tooltip: 'Showing Events', color: colorShowing })
tooltips.set('showing-locations', { tooltip: 'Showing Locations', color: colorShowing })
tooltips.set('showing-marriage', { tooltip: 'Showing Marriages', color: colorShowing })
tooltips.set('showing-married-f', { tooltip: 'Showing unmarried only', color: colorShowing })
tooltips.set('showing-married-t', { tooltip: 'Showing married only', color: colorShowing })
tooltips.set('showing-married-u', { tooltip: 'Showing married and unmarried', color: colorShowing })
tooltips.set('showing-military', { tooltip: 'Showing Military', color: colorShowing })
tooltips.set('showing-occupation', { tooltip: 'Showing Occupation', color: colorShowing })
tooltips.set('showing-persons-f', { tooltip: 'Showing female only', color: colorFemale })
tooltips.set('showing-persons-m', { tooltip: 'Showing male only', color: colorMale })
tooltips.set('showing-persons-u', { tooltip: 'Showing male and female', color: colorShowing })
tooltips.set('showing-persons', { tooltip: 'Showing Persons', color: colorShowing })
tooltips.set('showing-residence', { tooltip: 'Showing Residence', color: colorShowing })
tooltips.set('showing-sources', { tooltip: 'Showing Sources', color: colorShowing })
tooltips.set('showing-status-a', { tooltip: 'Showing alive only', color: colorShowing })
tooltips.set('showing-status-d', { tooltip: 'Showing dead only', color: colorShowing })
tooltips.set('showing-status-u', { tooltip: 'Showing dead and alive', color: colorShowing })
tooltips.set('source-new', { tooltip: 'New Source', color: null })
tooltips.set('tag-new', { tooltip: 'New Tag', color: null })
tooltips.set('unlink', { tooltip: 'Unlink', color: null })
tooltips.set('view', { tooltip: 'View', color: null })

export default {

    name: 'TooltipButton',

    components: {
        'icon': Icon,
    },

    props: {
        buttontype: { type: String, default: 'default' },
        color: { type: String, default: null },
        disabled: { type: Boolean, default: false },
        small: { type: Boolean, default: false },
        to: { type: String, default: null },
    },

    computed: {

        getColor() { return this.color || this.getTooltip.color },
        getTooltip() { return tooltips.get(this.buttontype) || tooltips.get('default') },

    },

    methods: {

        clicked() { return this.$emit('click') },

    }

}
</script>