<template>
    <v-dialog max-width="380" persistent v-model="showDialog">
        <v-card>
            <v-card-title>{{ getDialogTitle }}</v-card-title>
            <v-card-text>
                <v-text-field
                    class="ma-2"
                    dense
                    hide-details
                    label="Tag"
                    outlined
                    v-model="item.tag"
                >
                    <template v-slot:prepend>
                        <v-btn :color="item.color" @click="inColorEditMode = !inColorEditMode" class="mt-n1" icon>
                            <v-icon v-if="inColorEditMode">mdi-tag-arrow-up</v-icon>
                            <v-icon v-else>mdi-tag-arrow-down</v-icon>
                        </v-btn>
                    </template>
                </v-text-field>
                <v-expand-transition>
                    <div class="ma-2" v-if="inColorEditMode">
                        <v-chip
                            :color="color.color"
                            :key="color.color"
                            @click="setColor(color.color)"
                            class="ma-1"
                            dark
                            small
                            v-for="color in getSortedTagColors"
                        >
                            <v-expand-x-transition>
                                <v-icon left v-if="color.color === item.color">mdi-check</v-icon>
                            </v-expand-x-transition>
                        </v-chip>
                    </div>
                </v-expand-transition>
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

  name: 'TagEditor',

  components: {
      'card-actions': CardActions,
  },

  props: {
      id: { type: String, default: undefined },
  },

  data: () => ({

      item: { },

      inColorEditMode: false,

  }),

  computed: {

      ...mapGetters({
          getTag: 'getTag',
          getSortedTagColors: 'getSortedTagColors',
          getDefaultTagColor: 'getDefaultTagColor',
      }),

      getDialogTitle() { return (this.isEditDialog ? 'Edit ' : 'New ') + 'Tag'},

      isEditDialog() { return !([null, undefined].includes(this.id)) },
      isSaveDisabled() { return !(this.item && this.item.tag && this.item.tag.length) },

      showDialog() { return this.id !== undefined },

  },

  methods: {

    close()  { return this.$emit('close') },

    remove() {

        // call REST API

        return aettbok.deleteNodeWithLabelAndId('Tag', this.item.id)
        .catch(error => console.error(error))
        .finally(() => this.close())

    },

    save() {

        // convert empty strings to null values

        if (!this.item.tag)   { this.item.tag = null }
        if (!this.item.color) { this.item.color = this.getDefaultTagColor.color }

        // call REST API

        return aettbok.upsertNode(this.item, 'Tag')
        .catch(error => console.error(error))
        .finally(() => this.close())

    },

    setColor(color) { return this.item.color = color },

  },

  watch: {

    id: function(id) {

        this.inColorEditMode = false

        if (id === undefined || id === null) { return this.item = {
            id: null,
            tag: null,
            color: this.getDefaultTagColor.color
        }}

        return this.item = { ...this.getTag(id) }

    }

  },

}
</script>