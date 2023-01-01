<template>
    <v-row no-gutters>
        <v-col cols="12" sm="4">
            <v-text-field
                :value="day"
                @change="changeDay"
                class="ma-2"
                clearable
                dense
                hide-details
                hide-spin-buttons
                label="Day"
                outlined
                type="number"
            />
        </v-col>
        <v-col cols="12" sm="4">
            <v-text-field
                :value="month"
                @change="changeMonth"
                class="ma-2"
                clearable
                dense
                hide-details
                hide-spin-buttons
                label="Month"
                outlined
                type="number"
            />
        </v-col>
        <v-col cols="12" sm="4">
            <v-text-field
                :value="year"
                @change="changeYear"
                class="ma-2"
                clearable
                dense
                hide-details
                hide-spin-buttons
                label="Year"
                outlined
                type="number"
            />
        </v-col>
    </v-row>
</template>

<script>
export default {

    name: 'DatePicker',

    props: {
        day: { type: Number, default: null },
        month: { type: Number, default: null },
        year: { type: Number, default: null },
    },

    methods: {

        changeDay(value) { return this.$emit('changeDay', Math.min(31, Math.abs(Number(value))) || null) },
        changeMonth(value) { return this.$emit('changeMonth', Math.min(12, Math.abs(Number(value))) || null) },
        changeYear(value) { return this.$emit('changeYear', Math.min(2500, Math.abs(Number(value))) || null) },

    }

}
</script>