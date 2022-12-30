<template>
    <v-card
        class="ma-1"
        height="59"
    >
        <v-list-item disabled v-if="id === 'unknown'">
            <v-list-item-icon><icon icontype="person-ud" /></v-list-item-icon>
            <v-list-item-content><v-list-item-title class="mb-1 body-2">Unknown</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item :to="getProfileLink" v-else>
            <v-list-item-icon><icon :icontype="getIcontype" /></v-list-item-icon>
            <v-list-item-content>
                <v-list-item-title class="mb-1 body-2">{{ selectedPerson.fullname }}</v-list-item-title>
                <v-list-item-subtitle class="caption">{{ selectedPerson.birthLong }} &bull; {{ selectedPerson.deathLong }}</v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

import Icon from '../common/Icon.vue'

export default {

  name: 'PersonQuickCard',

  components: {
    'icon': Icon,
  },

  props: {
    id: { type: String, default: '' }
  },

  computed: {

    ...mapGetters({
        getPerson: 'getPerson',
    }),

    selectedPerson() { return this.getPerson(this.id) },

    getIcontype() { return `person-${this.selectedPerson.gender || 'u'}${this.selectedPerson.alive ? 'a' : 'd' }`},

    getProfileLink() { return `/persons/${this.id}` },

  },

}
</script>