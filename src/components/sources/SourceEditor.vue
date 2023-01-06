<template>
    <v-dialog max-width="830" persistent v-model="showDialog">
        <v-card>
            <v-card-title>{{ getDialogTitle }}</v-card-title>
            <v-card-text>
                <v-text-field class="ma-2" dense hide-details label="Source" outlined v-model="item.source" />
                <source-picker class="ma-2" :exclude="item.id" :selected="item.containedin" @selectedItem="selectedContainedIn" label="Contained in" />
                <location-picker class="ma-2" :selected="item.storedin" @selectedItem="selectedLocation" label="Stored in" />
                <v-text-field class="ma-2" dense hide-details label="Author" outlined v-model="item.author" />
                <v-text-field class="ma-2" dense hide-details label="Link" outlined v-model="item.link" />
                <tag-chips :selected="item.tags" :showSelectedOnly="false" @click="toggleTag" allowToggle class="ma-2 mt-8" />
            </v-card-text>
            <card-actions :allowRemove="!isNewDialog" :isSaveDisabled="isSaveDisabled" @close="close" @remove="remove" @save="save" />
        </v-card>
    </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import * as aettbok from '../../scripts/aettbok'

import CardActions from '../common/CardActions.vue'
import LocationPicker from '../locations/LocationPicker.vue'
import SourcePicker from './SourcePicker.vue'
import TagChips from '../tags/TagChips.vue'

export default {

    name: 'SourceEditor',

    components: {
        'card-actions': CardActions,
        'location-picker': LocationPicker,
        'source-picker': SourcePicker,
        'tag-chips': TagChips,
    },

    props: {
        id: { type: String, default: undefined },
    },

    data: () => ({

        item: { },

    }),

    computed: {

        ...mapGetters({
            getSource: 'getSource',
        }),

        showDialog() { return this.id !== undefined },

        getDialogTitle() { return (this.isNewDialog ? 'New ' : 'Edit ') + 'Source' },

        isNewDialog() { return !this.id },
        isSaveDisabled() { return !(this.item && this.item.source && this.item.source.length) },

    },

  methods: {

    close()  { return this.$emit('close') },

    remove() {

        // call REST API

        return aettbok.deleteNodeWithLabelAndId('Source', this.item.id)
        .catch(error => console.error(error))
        .finally(() => this.close())

    },

    save()   {

        // convert empty strings to null values

        if (!this.item.author) { this.item.author = null }
        if (!this.item.containedin) { this.item.containedin = null }
        if (!this.item.link) { this.item.link = null }
        if (!this.item.source) { this.item.source = null }
        if (!this.item.storedin) { this.item.storedin = null }

        // call REST API

        return aettbok.upsertNode(this.item, 'Source')
        .catch(error => console.error(error))
        .finally(() => this.close())

    },

    selectedLocation(id) { return this.item.storedin = id },
    selectedContainedIn(id) { return this.item.containedin = id },

    toggleTag(id) { return aettbok.toggleArrayValue(id, this.item.tags) },

  },

  watch: {

    id: function(id) {

        if (id) { return this.item = JSON.parse(JSON.stringify(this.getSource(id))) }

        return this.item = {
            author: null,
            containedin: null,
            id: null,
            link: null,
            source: null,
            storedin: null,
            tags: [],
        }

    }

  },

}
</script>