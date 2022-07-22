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
                        :key="hierarchy"
                        @click="setHierarchy(hierarchy)"
                        class="ma-1"
                        :dark="hierarchy === item.hierarchy"
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
            <card-actions :allowRemove="isEditDialog" :isSaveDisabled="isSaveDisabled" @close="close" @remove="remove" @save="save" />
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

      getDialogTitle() { return (this.isEditDialog ? 'Edit ' : 'New ') + 'Location Type'},

      isEditDialog() { return !([null, undefined].includes(this.id)) },
      isSaveDisabled() { return !(this.item && this.item.type && this.item.type.length) },

      showDialog() { return this.id !== undefined },

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

        if (!this.item.type)      { this.item.type = null }
        if (!this.item.hierarchy) { this.item.hierarchy = 1 }

        // call REST API

        return aettbok.upsertNode(this.item, 'LocationType')
        .catch(error => console.error(error))
        .finally(() => this.close())

    },

    setHierarchy(hierarchy) { return this.item.hierarchy = hierarchy },

  },

  watch: {

    id: function(id) {

        if (id === undefined || id === null) { return this.item = {
            id: null,
            type: null,
            hierarchy: 1
        }}

        return this.item = { ...this.getLocationType(id) }

    }

  },

}
</script>