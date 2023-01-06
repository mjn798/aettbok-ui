<template>
    <v-autocomplete
        :filter="filterItems"
        :items="items"
        :label="label"
        dense
        hide-details
        outlined
        v-model="selectedItem"
    >
        <template v-slot:[`item`]="{item}">
            <small class="mr-2">{{ item.pretail }}</small>
            {{ item.text }}
            <small class="ml-2">{{ item.detail }}</small>
        </template>
        <template v-slot:[`selection`]="{item}">
            <small class="mr-2">{{ item.pretail }}</small>
            {{ item.text }}
            <small class="ml-2">{{ item.detail }}</small>
        </template>
        <template v-slot:append-outer>
            <div class="mt-n3">
                <tooltip-button :disabled="selectedItem === null" @click="link" buttontype="link" />
            </div>
        </template>
    </v-autocomplete>
</template>

<script>
import TooltipButton from './TooltipButton.vue'

export default {

    name: 'LinkerAutocomplete',

    components: {
        'tooltip-button': TooltipButton,
    },

    props: {
        items: { type: Array, default: () => [] },
        label: { type: String, default: null },
    },

    data: () => ({
        selectedItem: null,
    }),

    methods: {

        filterItems(item, queryText, itemText) {
            return (itemText || '').toLocaleLowerCase().includes(queryText.toLocaleLowerCase()) ||
            (item.pretail || '').toLocaleLowerCase().includes(queryText.toLocaleLowerCase()) ||
            (item.detail || '').toLocaleLowerCase().includes(queryText.toLocaleLowerCase())
        },

        link() {
            this.$emit('link', this.selectedItem)
            return this.selectedItem = null
        },

    }

}
</script>