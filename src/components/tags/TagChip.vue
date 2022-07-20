<template>
    <v-chip
        :close="allowEdit"
        :color="data.color"
        :dark="active"
        :disabled="disabled"
        :outlined="!active"
        :style="active ? 'border: 1px solid white' : ''"
        @click:close="clickEdit"
        @click="toggle"
        class="ma-1"
        close-icon="mdi-pencil"
        small
    >
        {{ data.tag }}
    </v-chip>
</template>

<script>
export default {

  name: 'TagChip',

  props: {
      active: { type: Boolean, default: false },
      allowEdit: { type: Boolean, default: false },
      data: { type: Object },
      disabled: { type: Boolean, default: false },
  },

  methods: {
      
      clickEdit() { return this.$emit('clickEdit', this.data.id) },
      toggle() { return this.$emit('toggle', this.data.id) },

  },

}
</script>

<style scoped>
.v-chip--disabled {
    opacity: 0.9 !important;
}
</style>