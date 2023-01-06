<template>
    <v-row no-gutters>
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
</template>

<script>
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