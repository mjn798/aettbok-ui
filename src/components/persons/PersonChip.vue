<template>
    <v-chip
        :close-icon="closeicon"
        :close="closeicon !== null"
        :color="getPersonColor"
        :to="getPersonLink"
        @click:close="closed(id)"
        class="ma-1"
        label
        outlined
    >
        {{ getPersonName }}
        <small class="ml-2">{{ getPersonDates }}</small>
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

        selectedPerson() { return this.getPerson(this.id) },

        getPersonColor() { return this.selectedPerson.gendercolor },
        getPersonDates() { return this.selectedPerson ? `(${(this.longdate ? this.selectedPerson.datebirthshort : this.selectedPerson.datebirthyear) || ''} • ${(this.longdate ? this.selectedPerson.datedeathshort : this.selectedPerson.datedeathyear) || ''})`.trim() : null },
        getPersonName() { return this.selectedPerson ? `${this.selectedPerson.firstname || ''} ${this.selectedPerson.lastname || ''}`.trim() : null },
        getPersonLink() { return (this.islink && this.selectedPerson) ? `/persons/${this.selectedPerson.id}` : null }

    },

    methods: {

        closed(id) { return this.$emit('closed', id) },

    }

}
</script>