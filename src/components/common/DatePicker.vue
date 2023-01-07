<template>
    <v-row no-gutters v-if="getRoleIsEditor">
        <v-col
            :key="field.label"
            cols="12"
            sm="4"
            v-for="field in getFields"
        >
            <date-picker-field
                :label="field.label"
                :value="field.value"
                @change="(value) => change(field.label, field.maxvalue, value)"
            />
        </v-col>
    </v-row>
    <v-row class="mx-2" no-gutters v-else>
        <v-col>
            {{ getLabel }}
        </v-col>
    </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
import { getFormattedDate } from '../../scripts/aettbokdata'

import DatePickerField from './DatePickerField.vue'

export default {

    name: 'DatePicker',

    components: {
        'date-picker-field': DatePickerField,
    },

    props: {
        day: { type: Number, default: null },
        month: { type: Number, default: null },
        year: { type: Number, default: null },
    },

    computed: {

        ...mapGetters({
            getRoleIsEditor: 'getRoleIsEditor',
        }),

        getLabel() { return getFormattedDate(this.day, this.month, this.year, 'long') },

        getFields() { return [
            { label: 'Day',   maxvalue: 31,   value: this.day   },
            { label: 'Month', maxvalue: 12,   value: this.month },
            { label: 'Year',  maxvalue: 2500, value: this.year  },
        ]}

    },

    methods: {

        change(label, maxvalue, value) { return this.$emit(`change${label}`, Math.min(maxvalue, Math.abs(Number(value))) || null) },

    }

}
</script>