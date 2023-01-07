<template>
  <v-card-actions>
    <tooltip-button @click="remove" buttontype="action-delete" v-if="allowRemove && getRoleIsEditor" />
    <v-spacer />
    <tooltip-button @click="close" buttontype="action-ko" />
    <tooltip-button :disabled="isSaveDisabled" @click="save" buttontype="action-ok" v-if="!hideSave && getRoleIsEditor" />
  </v-card-actions>
</template>

<script>
import { mapGetters } from 'vuex'

import TooltipButton from './TooltipButton.vue'

export default {

  name: 'CardActions',

  components: {
    'tooltip-button': TooltipButton,
  },

  props: {
      allowRemove: { type: Boolean, default: false },
      isSaveDisabled: { type: Boolean, default: true },
      hideSave: { type: Boolean, default: false },
  },

  computed: {

    ...mapGetters({
      getRoleIsEditor: 'getRoleIsEditor',
    }),

  },

  methods: {

      close()  { return this.$emit('close') },
      remove() { return this.$emit('remove') },
      save()   { return this.$emit('save') },

  }

}
</script>