<template>
    <v-chip
        :close-icon="closeicon"
        :close="closeicon !== null"
        :to="getItemLink"
        @click:close="close"
        class="ma-1"
        color="grey darken-4"
        label
        outlined
        small
    >
        {{ getItemLabel }}
    </v-chip>
</template>

<script>
import { mapGetters } from 'vuex'

export default {

    name: 'LocationChip',

    props: {
        closeicon: { type: String, default: null },
        id: { type: String, default: null },
    },

    computed: {

        ...mapGetters({
            getLocation: 'getLocation',
        }),

        selectedItem() { return this.getLocation(this.id) },

        getItemLabel() { return this.selectedItem && this.selectedItem.location ? this.selectedItem.location || 'n/a' : 'n/a' },
        getItemLink() { return this.selectedItem ? `/locations/${this.selectedItem.id}` : null },

    },

    methods: {

        close() { return this.$emit('close', this.id) }

    },

}
</script>