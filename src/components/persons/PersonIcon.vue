<template>
    <v-icon :class="getClass" :color="color">{{ icon }}</v-icon>
</template>

<script>
export default {

    name: 'PersonIcon',

    props: {
        alive: { type: Boolean, default: false },
        color: { type: String, default: 'grey' },
        icon: { type: String, default: 'mdi-human-male-female' },
    },

    computed: {

        getClass() { return this.alive || 'deceased' }

    },

}
</script>

<style scoped>
.deceased { opacity: 0.2;}
</style>