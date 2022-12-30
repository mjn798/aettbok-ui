<template>
    <v-icon
        :class="getIcon.class"
        :color="getColor"
        :small="small"
    >
        {{ getIcon.icon }}
    </v-icon>
</template>

<script>

const colorMale = 'blue darken-2'
const colorFemale = 'pink darken-2'

const icons = new Map()

icons.set('default', { icon: 'mdi-alert-decegram', class: null, color: null })

icons.set('action-delete', { icon: 'mdi-delete', class: null, color: null })
icons.set('action-ko', { icon: 'mdi-close', class: null, color: null })
icons.set('action-ok', { icon: 'mdi-check', class: null, color: null })
icons.set('document-new', { icon: 'mdi-note-plus', class: null, color: null })
icons.set('documents-0', { icon: 'mdi-numeric-0-box-outline', class: null, color: null })
icons.set('documents-1', { icon: 'mdi-numeric-1-box-multiple', class: null, color: null })
icons.set('documents-10', { icon: 'mdi-numeric-9-plus-box-multiple', class: null, color: null })
icons.set('documents-2', { icon: 'mdi-numeric-2-box-multiple', class: null, color: null })
icons.set('documents-3', { icon: 'mdi-numeric-3-box-multiple', class: null, color: null })
icons.set('documents-4', { icon: 'mdi-numeric-4-box-multiple', class: null, color: null })
icons.set('documents-5', { icon: 'mdi-numeric-5-box-multiple', class: null, color: null })
icons.set('documents-6', { icon: 'mdi-numeric-6-box-multiple', class: null, color: null })
icons.set('documents-7', { icon: 'mdi-numeric-7-box-multiple', class: null, color: null })
icons.set('documents-8', { icon: 'mdi-numeric-8-box-multiple', class: null, color: null })
icons.set('documents-9', { icon: 'mdi-numeric-9-box-multiple', class: null, color: null })
icons.set('edit', { icon: 'mdi-pencil', class: null, color: null })
icons.set('event-baptism', { icon: 'mdi-tilde', class: null, color: null })
icons.set('event-birth', { icon: 'mdi-asterisk', class: null, color: null })
icons.set('event-death', { icon: 'mdi-cross', class: null, color: null })
icons.set('event-divorce', { icon: 'mdi-circle-off-outline', class: null, color: null })
icons.set('event-marriage', { icon: 'mdi-set-none', class: null, color: null })
icons.set('event-military', { icon: 'mdi-sword-cross', class: null, color: null })
icons.set('event-new', { icon: 'mdi-calendar-plus', class: null, color: null })
icons.set('event-occupation', { icon: 'mdi-occupation', class: null, color: null })
icons.set('event-residence', { icon: 'mdi-residence', class: null, color: null })
icons.set('filter-normal', { icon: 'mdi-filter-variant', class: null, color: null })
icons.set('filter-remove', { icon: 'mdi-filter-variant-remove', class: null, color: null })
icons.set('hiding-baptism', { icon: 'mdi-tilde', class: null, color: null })
icons.set('hiding-birth', { icon: 'mdi-asterisk', class: null, color: null })
icons.set('hiding-death', { icon: 'mdi-cross', class: null, color: null })
icons.set('hiding-divorce', { icon: 'mdi-circle-off-outline', class: null, color: null })
icons.set('hiding-documents', { icon: 'mdi-note', color: null })
icons.set('hiding-events', { icon: 'mdi-calendar', color: null })
icons.set('hiding-locations', { icon: 'mdi-map-marker', color: null })
icons.set('hiding-marriage', { icon: 'mdi-set-none', class: null, color: null })
icons.set('hiding-military', { icon: 'mdi-sword-cross', class: null, color: null })
icons.set('hiding-occupation', { icon: 'mdi-hammer-wrench', class: null, color: null })
icons.set('hiding-persons', { icon: 'mdi-account', color: null })
icons.set('hiding-residence', { icon: 'mdi-home', class: null, color: null })
icons.set('hiding-sources', { icon: 'mdi-book-multiple', color: null })
icons.set('link', { icon: 'mdi-link', class: null, color: null })
icons.set('location', { icon: 'mdi-map-marker', class: null, color: null })
icons.set('location-edit', { icon: 'mdi-map-marker', class: null, color: null })
icons.set('location-new', { icon: 'mdi-map-marker-plus', class: null, color: null })
icons.set('locations-exact', { icon: 'mdi-map-marker', class: null, color: null })
icons.set('locations-radius', { icon: 'mdi-map-marker-radius', class: null, color: null })
icons.set('locationtype-new', { icon: 'mdi-home-plus', class: null, color: null })
icons.set('locationtypes-edit', { icon: 'mdi-home-edit', class: null, color: null })
icons.set('marriage', { icon: 'mdi-set-none', class: null, color: null })
icons.set('person-edit', { icon: 'mdi-account-edit', class: null, color: null })
icons.set('person-fa', { icon: 'mdi-human-female', class: null, color: colorFemale })
icons.set('person-fd', { icon: 'mdi-human-female', class: 'deceased', color: colorFemale })
icons.set('person-ma', { icon: 'mdi-human-male', class: null, color: colorMale })
icons.set('person-md', { icon: 'mdi-human-male', class: 'deceased', color: colorMale })
icons.set('person-new', { icon: 'mdi-account-plus', class: null, color: null })
icons.set('person-ua', { icon: 'mdi-human-male-female', class: null, color: null })
icons.set('person-ud', { icon: 'mdi-human-male-female', class: 'deceased', color: null })
icons.set('show-details', { icon: 'mdi-view-dashboard', class: null, color: null })
icons.set('showing-baptism', { icon: 'mdi-tilde', class: null, color: null })
icons.set('showing-birth', { icon: 'mdi-asterisk', class: null, color: null })
icons.set('showing-death', { icon: 'mdi-cross', class: null, color: null })
icons.set('showing-divorce', { icon: 'mdi-circle-off-outline', class: null, color: null })
icons.set('showing-documents', { icon: 'mdi-note', color: null })
icons.set('showing-events', { icon: 'mdi-calendar', color: null })
icons.set('showing-locations', { icon: 'mdi-map-marker', color: null })
icons.set('showing-marriage', { icon: 'mdi-set-none', class: null, color: null })
icons.set('showing-married-f', { icon: 'mdi-circle-outline', class: null, color: null })
icons.set('showing-married-t', { icon: 'mdi-set-none', class: null, color: null })
icons.set('showing-married-u', { icon: 'mdi-circle-multiple-outline', class: null, color: null })
icons.set('showing-military', { icon: 'mdi-sword-cross', class: null, color: null })
icons.set('showing-occupation', { icon: 'mdi-hammer-wrench', class: null, color: null })
icons.set('showing-persons-f', { icon: 'mdi-human-female', class: null, color: null })
icons.set('showing-persons-m', { icon: 'mdi-human-male', class: null, color: null })
icons.set('showing-persons-u', { icon: 'mdi-human-male-female', class: null, color: null })
icons.set('showing-persons', { icon: 'mdi-account', color: null })
icons.set('showing-residence', { icon: 'mdi-home', class: null, color: null })
icons.set('showing-sources', { icon: 'mdi-book-multiple', color: null })
icons.set('showing-status-a', { icon: 'mdi-emoticon', class: null, color: null })
icons.set('showing-status-d', { icon: 'mdi-emoticon-dead', class: null, color: null })
icons.set('showing-status-u', { icon: 'mdi-emoticon-neutral', class: null, color: null })
icons.set('source-new', { icon: 'mdi-book-plus-multiple', class: null, color: null })
icons.set('tag-new', { icon: 'mdi-tag-plus', class: null, color: null })
icons.set('unlink', { icon: 'mdi-link-off', class: null, color: null })

export default {

    name: 'Icon',

    props: {
        color: { type: String, default: null },
        icontype: { type: String, default: 'default' },
        small: { type: Boolean, default: false },
    },

    computed: {

        getColor() { return this.color || this.getIcon.color },
        getIcon() { return icons.get(this.icontype) || icons.get('default') },

    }

}
</script>

<style scoped>
.deceased { opacity: 0.2 }
</style>