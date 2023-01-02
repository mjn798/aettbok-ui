<template>
    <v-chip
        :to="getLocationLink"
        class="ma-1"
        color="grey darken-4"
        label
        outlined
        small
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

        selectedItem() { return this.getLocation(this.id) },

        getLocationName() { return this.selectedItem ? this.selectedItem.location || 'n/a' : 'n/a' },
        getLocationLink() { return this.selectedItem ? `/locations/${this.selectedItem.id}` || null : null },

    },

}
</script>