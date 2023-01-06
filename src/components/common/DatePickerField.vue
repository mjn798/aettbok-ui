<template>
    <v-text-field
        :label="label"
        :value="value"
        @change="change"
        class="ma-2"
        clearable
        dense
        hide-details
        hide-spin-buttons
        outlined
        type="number"
    />
</template>

<script>
export default {

    name: 'DatePickerField',

    props: {
        label: { type: String, default: null },
        value: { type: Number, default: null },
    },

    methods: {

        change(value) { return this.$emit('change', value) },

    }

}
</script>