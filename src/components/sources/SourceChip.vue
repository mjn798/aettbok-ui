<template>
    <v-chip
        :close-icon="closeicon"
        :close="closeicon !== null"
        @click:close="close"
        @click="click"
        class="ma-1"
        color="blue-grey darken-4"
        label
        outlined
    >
        <source-editor :id="editingItemId" @close="upsertItem(undefined)" />
        {{ getItemLabel }}
    </v-chip>
</template>

<script>
import { mapGetters } from 'vuex'

import SourceEditor from './SourceEditor.vue'

export default {

    name: 'SourceChip',

    props: {
        allowOpen: { type: Boolean, default: false },
        closeicon: { type: String, default: null },
        id: { type: String, default: null },
    },

    components: {
        'source-editor': SourceEditor,
    },

    data: () => ({

        editingItemId: undefined,

    }),

    computed: {

        ...mapGetters({
            getSource: 'getSource',
        }),

        selectedItem() { return this.getSource(this.id) },

        getItemLabel() { return this.selectedItem && this.selectedItem.source ? this.selectedItem.source || 'n/a' : 'n/a' },

    },

    methods: {

        upsertItem(id) { return this.editingItemId = id },

        click() { return this.allowOpen ? this.upsertItem(this.id) : null },
        close() { return this.$emit('close', this.id) }

    },

}
</script>