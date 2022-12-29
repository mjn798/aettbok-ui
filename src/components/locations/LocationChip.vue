<template>
    <v-chip
        :to="getLocationLink"
        class="ma-1"
        label
        small
        outlined
    >
        {{ getLocationName }}
    </v-chip>
</template>

<script>
import { mapGetters } from 'vuex'

export default {

    name: 'LocationChip',

    props: {
        id: { type: String, default: null },
    },

    computed: {

        ...mapGetters({
            getLocation: 'getLocation',
        }),

        selectedLocation() { return this.getLocation(this.id) },

        getLocationName() { return this.selectedLocation ? this.selectedLocation.location || 'n/a' : 'n/a' },
        getLocationLink() { return this.selectedLocation ? `/locations/${this.selectedLocation.id}` || null : null },

    },

}
</script>