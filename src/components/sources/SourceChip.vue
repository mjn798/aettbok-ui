<template>
    <v-chip
        class="ma-1"
        color="blue-grey darken-4"
        label
        outlined
        small
        to="/sources"
    >
        {{ getSourceName }}
    </v-chip>
</template>

<script>
import { mapGetters } from 'vuex'

export default {

    name: 'SourceChip',

    props: {
        id: { type: String, default: null },
    },

    computed: {

        ...mapGetters({
            getSource: 'getSource',
        }),

        selectedItem() { return this.getSource(this.id) },

        getSourceName() { return this.selectedItem && this.selectedItem.source ? this.selectedItem.source || 'n/a' : 'n/a' },

    },

}
</script>