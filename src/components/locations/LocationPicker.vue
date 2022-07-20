<template>
    <div>
        <location-editor :id="editingItemId" @close="upsertItem(undefined)" />
        <v-autocomplete
            :items="getItems"
            :label="label"
            :value="selected"
            @change="selectItem"
            class="ma-2"
            clearable
            dense
            hide-details
            outlined
        >
            <template v-slot:append-outer>
                <div class="mt-n2">
                    <tooltip-button icon="mdi-map-marker-plus" tooltip="New Location" @click="upsertItem(null)" />
                </div>
            </template>
        </v-autocomplete>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

import TooltipButton from '../common/TooltipButton.vue'

export default {

    name: 'LocationPicker',

    components: {
        'location-editor': () => import('./LocationEditor.vue'),
        'tooltip-button': TooltipButton,
    },

    props: {
        exclude: { type: String, default: null },
        label: { type: String, default: null },
        selected: { type: String, default: null },
    },

    data: () => ({
        editingItemId: undefined,
    }),

    computed: {

        ...mapGetters({
            getLocations: 'getLocations',
        }),

        getItems() {
            return this.getLocations.filter(e => e.id !== this.exclude).map(e => { return { text: e.location, value: e.id } })
        },

    },

    methods: {

        upsertItem(id) { return this.editingItemId = id },

        selectItem(id) { return this.$emit('selectedItem', id) },

    },

}
</script>