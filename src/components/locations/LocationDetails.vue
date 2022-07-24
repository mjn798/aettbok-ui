<template>
    <v-container class="ma-0 pa-0">
        <location-editor :id="editingItemId" @close="upsertItem(undefined)" />
        <v-row no-gutters>
            <v-col cols="12">
                <v-card flat>
                    <v-card-title>
                        <div class="text-h4">{{ selectedLocation.location }}</div>
                        <v-spacer/>
                        <tooltip-button
                            @click="upsertItem($route.params.id)"
                            icon="mdi-map-marker"
                            tooltip="Edit Location"
                        />
                    </v-card-title>
                    <v-card-text>
                        <div>{{ `${selectedLocation.locationtypeString} in ${selectedLocation.partofResolved}` }}</div>
                    </v-card-text>
                    <v-card-text>
                        <tag-chips :selected="selectedLocation.tags" />
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row no-gutters>
            <v-col cols="12"><event-list :locationFilter="selectedLocation.location" /></v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

import EventList from '../events/EventList.vue'
import LocationEditor from './LocationEditor.vue'
import TagChips from '../tags/TagChips.vue'
import TooltipButton from '../common/TooltipButton.vue'

export default {

  name: 'LocationDetails',

  components: {
    'event-list': EventList,
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