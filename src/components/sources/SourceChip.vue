<template>
    <v-chip
        :close-icon="closeicon"
        :close="closeicon !== null"
        :to="getItemLink"
        @click:close="close"
        class="ma-1"
        color="blue-grey darken-4"
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

    name: 'SourceChip',

    props: {
        closeicon: { type: String, default: null },
        id: { type: String, default: null },
    },

    computed: {

        ...mapGetters({
            getSource: 'getSource',
        }),

        selectedItem() { return this.getSource(this.id) },

        getItemLabel() { return this.selectedItem && this.selectedItem.source ? this.selectedItem.source || 'n/a' : 'n/a' },
        getItemLink() { return '/sources' },

    },

    methods: {

        close() { return this.$emit('close', this.id) }

    },

}
</script>