<template>
    <v-card>
        <location-editor :id="editingItemId" @close="upsertItem(undefined)" />
        <v-card-title>
            <div>{{ selectedLocation.location }}</div>
            <v-spacer/>
            <tooltip-button
                @click="upsertItem($route.params.id)"
                icon="mdi-map-marker"
                tooltip="Edit Location"
            />
        </v-card-title>
        <v-card-text>
            {{ `${selectedLocation.locationtypeString} ${selectedLocation.partofResolved ? 'in ' + selectedLocation.partofResolved : ''}`.trim() }}
        </v-card-text>
        <v-card-text v-if="selectedLocation.tags.length"><tag-chips :selected="selectedLocation.tags" /></v-card-text>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

import CardTitle from '../common/CardTitle.vue'
import LocationEditor from './LocationEditor.vue'
import TagChips from '../tags/TagChips.vue'
import TooltipButton from '../common/TooltipButton.vue'

export default {

    name: 'LocationDetails',

    components: {
        'card-title': CardTitle,
        'location-editor': LocationEditor,
        'tag-chips': TagChips,
        'tooltip-button': TooltipButton,
    },

    data: () => ({

        editingItemId: undefined,

    }),

    computed: {

        ...mapGetters({
            getLocation: 'getLocation',
        }),

        selectedLocation() { return this.getLocation(this.$route.params.id) },

    },

    methods: {

        upsertItem(id) { return this.editingItemId = id },

    },

}
</script>