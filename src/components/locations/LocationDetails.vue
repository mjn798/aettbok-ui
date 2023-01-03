<template>
    <v-card>
        <location-editor :id="editingItemId" @close="upsertItem(undefined)" />
        <v-card-title>
            <div>{{ selectedItem.location }}</div>
            <v-spacer/>
            <tooltip-button @click="upsertItem(selectedItem.id)" buttontype="location-edit" />
        </v-card-title>
        <v-card-text>
            {{ selectedItem.locationtypetext }}
            {{ selectedItem.partof ? 'in' : '' }}
            <location-chip
                :id="part"
                :key="part"
                v-for="part in getPartOfIds(selectedItem.partof)"
            />
        </v-card-text>
        <v-card-text v-if="selectedItem.parts.length">
            <location-chip
                :id="part.id"
                :key="part.id"
                v-for="part in getParts"
            />
        </v-card-text>
        <v-card-text v-if="selectedItem.tags.length"><tag-chips :selected="selectedItem.tags" /></v-card-text>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { compareStrings } from '../../scripts/aettbok'

import CardTitle from '../common/CardTitle.vue'
import LocationChip from './LocationChip.vue'
import LocationEditor from './LocationEditor.vue'
import TagChips from '../tags/TagChips.vue'
import TooltipButton from '../common/TooltipButton.vue'

export default {

    name: 'LocationDetails',

    components: {
        'card-title': CardTitle,
        'location-chip': LocationChip,
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

        selectedItem() { return this.getLocation(this.$route.params.id) },

        getParts() { return this.selectedItem.parts.sort((a, b) => compareStrings(a.text, b.text)) },

    },

    methods: {

        upsertItem(id) { return this.editingItemId = id },

        getPartOfIds(id, partof = []) {

            let location = this.getLocation(id)

            if (!location) { return partof }
            if (!location.partof) { return [id] }

            return [id, ...this.getPartOfIds(location.partof, partof)]

        },

    },

}
</script>