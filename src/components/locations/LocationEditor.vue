<template>
    <v-dialog max-width="830" persistent v-model="showDialog">
        <v-card>
            <v-card-title>{{ getDialogTitle }}</v-card-title>
            <v-card-text>
                <v-container>
                    <v-row no-gutters>
                        <v-col cols="12"><v-text-field class="ma-2" dense hide-details label="Location" outlined v-model="item.location" /></v-col>
                        <v-col cols="12"><location-picker :exclude="item.id" :selected="item.partof" @selectedItem="selectedLocation" label="Part of" /></v-col>
                        <v-col cols="12" md="6"><v-text-field class="ma-2" dense hide-details label="Latitude" outlined v-model="item.latitude" /></v-col>
                        <v-col cols="12" md="6"><v-text-field class="ma-2" dense hide-details label="Longitude" outlined v-model="item.longitude" /></v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <card-actions :allowRemove="isEditDialog" :isSaveDisabled="isSaveDisabled" @close="close" @remove="remove" @save="save" />
        </v-card>
    </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import CardActions from '../common/CardActions.vue'
import LocationPicker from './LocationPicker.vue'

export default {

    name: 'LocationEditor',

    components: {
        'card-actions': CardActions,
        'location-picker': LocationPicker,
    },

    props: {
        id: { type: String, default: undefined },
    },

    data: () => ({

        item: { },

    }),

    computed: {

        ...mapGetters({
            getLocation: 'getLocation',
        }),

        getDialogTitle() { return (this.isEditDialog ? 'Edit ' : 'New ') + 'Location' },

        isEditDialog() { return !([null, undefined].includes(this.id)) },
        isSaveDisabled() { return false },

        showDialog() { return this.id !== undefined }

    },

  methods: {

      ...mapActions({
          delete: 'deleteLocation',
          upsert: 'upsertLocation',
      }),

      close()  { return this.$emit('close') },
      remove() { return this.delete(this.item.id).then(this.close()) },
      save()   { return this.upsert(this.item).then(this.close()) },

      selectedLocation(id) { return this.item.partof = id },

  },

  watch: {

    id: function(id) {

        if (id === undefined || id === null) { return this.item = {
            id: null,
            location: null,
            partof: null,
        }}

        return this.item = { ...this.getLocation(id) }

    }

  },


}
</script>