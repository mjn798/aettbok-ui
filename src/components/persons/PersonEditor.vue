<template>
    <v-dialog max-width="830" persistent v-model="showDialog">
        <v-card>
            <v-card-title>{{ getDialogTitle }}</v-card-title>
            <v-card-text>
                <v-container>
                    <v-row no-gutters>
                        <v-col cols="12" md="6"><v-text-field class="ma-2" dense hide-details label="First Name" outlined v-model="item.firstname" /></v-col>
                        <v-col cols="12" md="6"><v-text-field class="ma-2" dense hide-details label="Last Name" outlined v-model="item.lastname" /></v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-radio-group class="mx-4" mandatory row v-model="item.gender">
                                <v-radio color="blue darken-2" label="Male" value="m" />
                                <v-radio color="pink darken-2" label="Female" value="f" />
                                <v-radio color="grey" label="Unknown" value="u" />
                            </v-radio-group>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-radio-group class="mx-4" mandatory row v-model="item.alive">
                                <v-radio color="grey darken-2" label="Living" :value="true" />
                                <v-radio color="grey lighten-1" label="Deceased" :value="false" />
                            </v-radio-group>
                        </v-col>
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

export default {

    name: 'PersonEditor',

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
            getPerson: 'getPerson',
        }),

        getDialogTitle() { return (this.isEditDialog ? 'Edit ' : 'New ') + 'Person' },

        isEditDialog() { return !([null, undefined].includes(this.id)) },
        isSaveDisabled() { return !(this.item && this.item.firstname && this.item.firstname.length) &&
                                  !(this.item && this.item.lastname && this.item.lastname.length) },

        showDialog() { return this.id !== undefined }

    },

  methods: {

      ...mapActions({
          delete: 'deletePerson',
          upsert: 'upsertPerson',
      }),

      close()  { return this.$emit('close') },
      remove() { return this.delete(this.item.id).then(this.close()) },
      save()   { return this.upsert(this.item).then(this.close()) },

  },

  watch: {

    id: function(id) {

        if (id === undefined || id === null) { return this.item = {
            id: null,
            firstname: null,
            lastname: null,
            gender: 'u',
            alive: false,
        }}

        return this.item = { ...this.getPerson(id) }

    }

  },


}
</script>