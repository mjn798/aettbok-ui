<template>
    <v-dialog max-width="600" persistent v-model="showDialog">
        <v-card>
            <v-card-title>{{ getDialogTitle }}</v-card-title>
            <v-card-text>
                <v-text-field
                    class="ma-2"
                    dense
                    hide-details
                    label="Location Type"
                    outlined
                    v-model="item.type"
                />
                <div class="ma-2">
                    <v-chip
                        :dark="hierarchy === item.hierarchy"
                        :key="hierarchy"
                        @click="setHierarchy(hierarchy)"
                        class="ma-1"
                        small
                        v-for="hierarchy in getSortedHierarchy"
                    >
                        <v-expand-x-transition>
                            <v-icon left v-if="hierarchy === item.hierarchy">mdi-check</v-icon>
                        </v-expand-x-transition>
                        <v-icon>mdi-numeric-{{ hierarchy }}</v-icon>
                    </v-chip>
                </div>
            </v-card-text>
            <card-actions :allowRemove="!isNewDialog" :isSaveDisabled="isSaveDisabled" @close="close" @remove="remove" @save="save" />
        </v-card>
    </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import * as aettbok from '../../scripts/aettbok'

import CardActions from '../common/CardActions.vue'

export default {

  name: 'LocationTypeDetailsEditor',

  components: {
      'card-actions': CardActions,
  },

  props: {
      id: { type: String, default: undefined },
  },

  data: () => ({

      item: { },

  }),

  computed: {

      ...mapGetters({
          getLocationType: 'getLocationType',
      }),

      showDialog() { return this.id !== undefined },

      getDialogTitle() { return (this.isNewDialog ? 'Neu ' : 'Edit ') + 'Location Type'},

      isNewDialog() { return !this.id },
      isSaveDisabled() { return !(this.item.type && this.item.type.trim()) },

      getSortedHierarchy() { return [1, 2, 3, 4, 5, 6, 7, 8, 9] },

  },

  methods: {

    close()  { return this.$emit('close') },

    remove() {

        // call REST API

        return aettbok.deleteNodeWithLabelAndId('LocationType', this.item.id)
        .catch(error => console.error(error))
        .finally(() => this.close())

    },

    save() {

        // convert empty strings to null values

        if (!this.item.type) { this.item.type = null }

        // call REST API

        return aettbok.upsertNode(this.item, 'LocationType')
        .catch(error => console.error(error))
        .finally(() => this.close())

    },

    setHierarchy(hierarchy) { return this.item.hierarchy = hierarchy },

  },

  watch: {

    id: function(id) {

        if (id) { return this.item = JSON.parse(JSON.stringify(this.getLocationType(id))) }

        return this.item = {
            id: null,
            hierarchy: 1,
            type: null,
        }

    }

  },

}
</script>