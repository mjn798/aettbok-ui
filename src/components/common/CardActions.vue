<template>
  <v-card-actions>
    <tooltip-button @click="remove" icon="mdi-delete" tooltip="Delete" v-if="allowRemove" />
    <v-spacer />
    <tooltip-button @click="close" icon="mdi-close" tooltip="Close" />
    <tooltip-button :disabled="isSaveDisabled" @click="save" color="green" icon="mdi-check" tooltip="Save" v-if="!hideSave" />
  </v-card-actions>
</template>

<script>
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

  methods: {

      close()  { return this.$emit('close') },
      remove() { return this.$emit('remove') },
      save()   { return this.$emit('save') },

  }

}
</script>