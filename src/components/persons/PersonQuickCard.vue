<template>
    <v-card
        class="ma-1"
        height="59"
    >
        <v-list-item disabled v-if="id === 'unknown'">
            <v-list-item-icon>
                <person-icon :alive="false" color="grey" icon="mdi-human-male-female" />
            </v-list-item-icon>
            <v-list-item-content>
                <v-list-item-title class="mb-1 body-2">Unknown</v-list-item-title>
            </v-list-item-content>
        </v-list-item>
        <v-list-item :to="getProfileLink" v-else>
            <v-list-item-icon>
                <person-icon :alive="selectedPerson.alive" :color="selectedPerson.iconColor" :icon="selectedPerson.icon" />
            </v-list-item-icon>
            <v-list-item-content>
                <v-list-item-title class="mb-1 body-2">{{ selectedPerson.fullname }}</v-list-item-title>
                <v-list-item-subtitle class="caption">{{ selectedPerson.birthLong }} &bull; {{ selectedPerson.deathlLong }}</v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

import PersonIcon from './PersonIcon.vue'

export default {

  name: 'PersonQuickCard',

  components: {
    'person-icon': PersonIcon,
  },

  props: {
    id: { type: String, default: '' }
  },

  computed: {

    ...mapGetters({
        getPerson: 'getPerson',
    }),

    selectedPerson() { return this.getPerson(this.id) },

    getProfileLink() { return `/persons/${this.id}` },

  },

}
</script>