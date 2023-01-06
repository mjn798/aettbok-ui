<template>
    <v-chip
        :close-icon="closeicon"
        :close="closeicon !== null"
        :color="getColor"
        :to="getItemLink"
        @click:close="close"
        class="ma-1"
        label
        outlined
        small
    >
        {{ getItemLabel }}
        <small class="ml-2">{{ getItemDates }}</small>
    </v-chip>
</template>

<script>
import { mapGetters } from 'vuex'

export default {

    name: 'PersonChip',

    props: {
        closeicon: { type: String, default: null },
        id: { type: String, default: null },
        islink: { type: Boolean, default: false },
        longdate: { type: Boolean, default: false },
    },

    computed: {

        ...mapGetters({
            getPerson: 'getPerson',
        }),

        selectedItem() { return this.getPerson(this.id) },

        getColor() { return this.selectedItem && this.selectedItem.gendercolor ? this.selectedItem.gendercolor || null : null },
        getItemDates() { return this.selectedItem ? `(${(this.longdate ? this.selectedItem.datebirthshort : this.selectedItem.datebirthyear) || ''} • ${(this.longdate ? this.selectedItem.datedeathshort : this.selectedItem.datedeathyear) || ''})`.trim() : null },
        getItemLabel() { return this.selectedItem ? `${this.selectedItem.firstname || ''} ${this.selectedItem.lastname || ''}`.trim() : null },
        getItemLink() { return this.islink && this.selectedItem ? `/persons/${this.selectedItem.id}` : null },

    },

    methods: {

        close() { return this.$emit('close', this.id) },

    }

}
</script>