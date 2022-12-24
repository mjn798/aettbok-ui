<template>
    <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
            <v-btn
                :color="color"
                :dark="color !== null && !disabled"
                :disabled="disabled"
                :fab="color !== null"
                :icon="color === null"
                :small="color !== null || small"
                :to="to"
                @click="clicked"
                class="ma-1"
                elevation="0"
                v-bind="attrs"
                v-on="on"
            >
                <v-icon :small="small">{{ icon }}</v-icon>
            </v-btn>
        </template>
        <span>{{ tooltip }}</span>
    </v-tooltip>
</template>

<script>
export default {

  name: 'TooltipButton',

  props: {
      color: { type: String, default: null },
      disabled: { type: Boolean, default: false },
      icon: { type: String, default: 'mdi-alert-decagram' },
      small: { type: Boolean, default: false },
      to: { type: String, default: null },
      tooltip: { type: String, default: 'n/a' },
  },

  methods: {

      clicked() { return this.$emit('click') },

  }

}
</script>