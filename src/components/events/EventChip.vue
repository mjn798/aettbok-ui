<template>
    <v-chip
        :close-icon="closeicon"
        :close="closeicon !== null"
        @click:close="close"
        @click="click"
        class="ma-1"
        color="grey darken-3"
        label
        outlined
    >
        <event-editor :id="editingItemId" @close="upsertItem(undefined)" />
        <small class="mr-2">{{ getItemType }}</small>
        {{ getItemAttended }}
        <small class="ml-2">{{ getItemDate }}</small>
    </v-chip>
</template>

<script>
import { mapGetters } from 'vuex'

import EventEditor from './EventEditor.vue'

export default {

    name: 'EventChip',

    props: {
        allowOpen: { type: Boolean, default: false },
        closeicon: { type: String, default: null },
        id: { type: String, default: null },
    },

    components: {
        'event-editor': EventEditor,
    },

    data: () => ({

        editingItemId: undefined,

    }),

    computed: {

        ...mapGetters({
            getEvent: 'getEvent',
        }),

        selectedItem() { return this.getEvent(this.id) },

        getItemAttended() { return this.selectedItem && this.selectedItem.attendedtext ? this.selectedItem.attendedtext : null },
        getItemDate() { return this.selectedItem && this.selectedItem.dateshort ? this.selectedItem.dateshort : null },
        getItemType() { return this.selectedItem && this.selectedItem.typetext ? this.selectedItem.typetext : null },

    },

    methods: {

        upsertItem(id) { return this.editingItemId = id },

        click() { return this.allowOpen ? this.upsertItem(this.id) : null },
        close() { return this.$emit('close', this.id) },

    }

}
</script>