<template>
    <div v-if="getRoleIsEditor">
        <source-editor :id="editingItemId" @close="upsertItem(undefined)" />
        <v-autocomplete
            :items="getItems"
            :label="label"
            :value="selected"
            @change="selectItem"
            clearable
            dense
            hide-details
            outlined
        >
            <template v-slot:append-outer>
                <div class="mt-n3">
                    <tooltip-button @click="upsertItem(null)" buttontype="source-new" />
                </div>
            </template>
        </v-autocomplete>
    </div>
    <div v-else>
        {{ getLabel }}
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

import TooltipButton from '../common/TooltipButton.vue'

export default {

    name: 'SourcePicker',

    components: {
        'source-editor': () => import('./SourceEditor.vue'),
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
            getRoleIsEditor: 'getRoleIsEditor',
            getSource: 'getSource',
            getSources: 'getSources',
        }),

        getLabel() { return (this.getSource(this.selected) || { source: '' }).source },

        getItems() { return this.getSources.filter(e => e.id !== this.exclude).map(e => { return { text: e.source, value: e.id } }) },

    },

    methods: {

        upsertItem(id) { return this.editingItemId = id },

        selectItem(id) { return this.$emit('selectedItem', id) },

    },

}
</script>