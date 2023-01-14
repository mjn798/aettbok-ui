<template>
  <v-tabs class="mb-4" hide-slider>
    <v-tab
      :key="item.text"
      :to="item.route"
      v-for="item in menuItems"
    >
      {{ item.text }}
    </v-tab>
  </v-tabs>
</template>

<script>
export default {

  name: 'ChartsMenu',

  data: () => ({

    menuItems: [
      { text: 'Charts', route: '/charts' },
      { text: 'Fan', route: '/charts/fan' },
      { text: 'Tree', route: '/charts/tree' },
      { text: 'Waterfall', route: '/charts/waterfall' },
      { text: 'Migration', route: '/charts/migration' },
      { text: 'Histogram', route: '/charts/histogram' },
    ],

  }),

}
</script>