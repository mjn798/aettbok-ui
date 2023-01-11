import Vue from 'vue'
import Vuex from 'vuex'

import { processResource } from '../scripts/aettbok'

Vue.use(Vuex)

const numberOfResources = 7

export default new Vuex.Store({

  state: {

    /* AUTHENTICATION */

    accessToken: null,
    roleIsEditor: false,

    /* LOADING STATUS */

    loadedDocuments: false,
    loadedEvents: false,
    loadedLocations: false,
    loadedLocationTypes: false,
    loadedPersons: false,
    loadedSources: false,
    loadedTags: false,

    /* PROCESSING STATUS */

    processedDocuments: false,
    processedEvents: false,
    processedLocations: false,
    processedLocationTypes: false,
    processedPersons: false,
    processedSources: false,
    processedTags: false,

    /* NODES */

    documents: [],
    events: [],
    locations: [],
    locationtypes: [],
    persons: [],
    sources: [],
    tags: [],

    /* OTHER */

    tagcolors: [
      { sort: 10, default: true,  color: 'pink' },
      { sort: 20, default: false, color: 'purple' },
      { sort: 30, default: false, color: 'indigo' },
      { sort: 40, default: false, color: 'blue' },
      { sort: 50, default: false, color: 'cyan' },
      { sort: 60, default: false, color: 'teal lighten-1' },
      { sort: 70, default: false, color: 'lime darken-1' },
      { sort: 80, default: false, color: 'amber' },
      { sort: 90, default: false, color: 'orange' },
    ],

  },

  getters: {

    /* AUTHENTICATION */

    getAccessToken: (state) => state.accessToken ? state.accessToken.token : null,

    getRoleIsAdministrator: (state) => false,
    getRoleIsEditor: (state) => state.roleIsEditor,

    /* LOADING STATUS */

    getNumberLoaded: (state) => state.getAccessToken === null ? numberOfResources : state.loadedDocuments + state.loadedEvents + state.loadedLocations + state.loadedLocationTypes + state.loadedPersons + state.loadedSources + state.loadedTags,
    getNumberProcessed: (state) => state.getAccessToken === null ? numberOfResources : state.processedDocuments + state.processedEvents + state.processedLocations + state.processedLocationTypes + state.processedPersons + state.processedSources + state.processedTags,

    getLoadingStatus: (_state, getters) => { return { total: numberOfResources, loaded: getters.getNumberLoaded }},
    getProcessingStatus: (_state, getters) => { return { total: numberOfResources, loaded: getters.getNumberProcessed }},

    isDataLoaded: (_state, getters) => getters.getNumberLoaded === numberOfResources,
    isDataProcessed: (_state, getters) => getters.getNumberProcessed === numberOfResources,

    /* NODES */

    getNodesForLabel: (_state, getters) => (label) => {

      switch(label) {

        case 'Document':     return getters.getDocuments
        case 'Event':        return getters.getEvents
        case 'Location':     return getters.getLocations
        case 'LocationType': return getters.getLocationTypes
        case 'Person':       return getters.getPersons
        case 'Source':       return getters.getSources
        case 'Tag':          return getters.getTags

        default: return []

      }

    },

    /* DOCUMENTS */

    getDocument: (state) => (id) => state.documents.find(e => e.id === id),

    getDocuments: (state) => state.documents.sort((a, b) => (a.index || '').toUpperCase().localeCompare((b.index || '').toUpperCase())).sort((a, b) => (`${a.year ? a.year.toString().padStart(4, 0) : '0000'}-${a.month ? a.month.toString().padStart(2, 0) : '00'}-${a.day ? a.day.toString().padStart(2, 0) : '00'}`).localeCompare(`${b.year ? b.year.toString().padStart(4, 0) : '0000'}-${b.month ? b.month.toString().padStart(2, 0) : '00'}-${b.day ? b.day.toString().padStart(2, 0) : '00'}`)),

    /* EVENTS */

    getEvent: (state) => (id) => state.events.find(e => e.id === id),

    getEvents: (state) => state.events.sort((a, b) => (`${a.year ? a.year.toString().padStart(4, 0) : '0000'}-${a.month ? a.month.toString().padStart(2, 0) : '00'}-${a.day ? a.day.toString().padStart(2, 0) : '00'}`).localeCompare(`${b.year ? b.year.toString().padStart(4, 0) : '0000'}-${b.month ? b.month.toString().padStart(2, 0) : '00'}-${b.day ? b.day.toString().padStart(2, 0) : '00'}`)),

    getEventsForPerson: (state) => (id) => state.events.filter(e => e.attended.includes(id)).sort((a, b) => (`${a.year ? a.year.toString().padStart(4, 0) : '0000'}-${a.month ? a.month.toString().padStart(2, 0) : '00'}-${a.day ? a.day.toString().padStart(2, 0) : '00'}`).localeCompare(`${b.year ? b.year.toString().padStart(4, 0) : '0000'}-${b.month ? b.month.toString().padStart(2, 0) : '00'}-${b.day ? b.day.toString().padStart(2, 0) : '00'}`)),

    /* LOCATIONS */

    getLocation: (state) => (id) => state.locations.find(e => e.id === id),

    getLocations: (state) => state.locations.sort((a, b) => a.location.toUpperCase().localeCompare(b.location.toUpperCase())),

    /* LOCATIONTYPES */

    getLocationType: (state) => (id) => state.locationtypes.find(e => e.id === id),

    getLocationTypes: (state) => state.locationtypes.sort((a, b) => (a.type || '').toUpperCase().localeCompare((b.type || '').toUpperCase())).sort((a, b) => (a.hierarchy || 0) - (b.hierarchy || 0)),

    /* PERSONS */

    getPerson: (state) => (id) => state.persons.find(e => e.id === id),

    getPersons: (state) => state.persons.sort((a, b) => (a.firstname || '').toUpperCase().localeCompare((b.firstname || '').toUpperCase()))
                                        .sort((a, b) => (a.lastname || '').toUpperCase().localeCompare((b.lastname || '').toUpperCase())),

    /* SOURCES */

    getSource: (state) => (id) => state.sources.find(e => e.id === id),

    getSources: (state) => state.sources.sort((a, b) => a.source.toUpperCase().localeCompare(b.source.toUpperCase())),

    
    /* TAGS */

    getTag: (state) => (id) => state.tags.find(e => e.id === id),

    getTags: (state) => state.tags.sort((a, b) => a.tag.toUpperCase().localeCompare(b.tag.toUpperCase()))
                                  .sort((a, b) => state.tagcolors.find(e => e.color === a.color).sort - state.tagcolors.find(e => e.color === b.color).sort),

    getSortedTagColors: (state) => state.tagcolors.sort((a, b) => a.sort - b.sort),
    getDefaultTagColor: (state) => state.tagcolors.find(e => e.default),

  },

  actions: {

    /* AUTHENTICATION */

    setAccessToken({ commit }, token) { return commit('setAccessToken', token) },

    toggleRoleIsEditor({ commit }) { return commit('toggleRoleIsEditor') },

    /* DATA LOADING */

    setDataForLabel({ commit }, data) { return commit('setDataForLabel', data) },

    refreshData({ commit }) { return commit('refreshData') },

    /* NODES */

    deleteNode({ commit, getters }, data) { return commit('deleteNode', { data, getters}) },

  },

  mutations: {

    setAccessToken: (state, token) => state.accessToken = token,

    toggleRoleIsEditor: (state) => state.roleIsEditor = !state.roleIsEditor,

    deleteNode(state, { data, getters }) {

      let nodes = getters.getNodesForLabel(data.label)
      let index = nodes.findIndex(e => e.id === data.id)

      // if node with id does not exist = error
      if (index < 0) { return console.error('store:deleteNode:error', `${data.id} not found for ${data.label}`) }

      // remove index from nodes
      nodes = nodes.splice(index, 1)

      // adjust all relations
      state.documents.forEach(node =>     node.relations = node.relations.filter(e => e.id !== data.id))
      state.events.forEach(node =>        node.relations = node.relations.filter(e => e.id !== data.id))
      state.locations.forEach(node =>     node.relations = node.relations.filter(e => e.id !== data.id))
      state.locationtypes.forEach(node => node.relations = node.relations.filter(e => e.id !== data.id))
      state.persons.forEach(node =>       node.relations = node.relations.filter(e => e.id !== data.id))
      state.sources.forEach(node =>       node.relations = node.relations.filter(e => e.id !== data.id))
      state.tags.forEach(node =>          node.relations = node.relations.filter(e => e.id !== data.id))

      // reset processed state
      state.processedDocuments     = false
      state.processedEvents        = false
      state.processedLocations     = false
      state.processedLocationTypes = false
      state.processedPersons       = false
      state.processedSources       = false
      state.processedTags          = false

      // process all nodes to remove node from relations
      processResource('Document')
      processResource('Event')
      processResource('Location')
      processResource('LocationType')
      processResource('Person')
      processResource('Source')
      processResource('Tag')

      // everything ok
      console.debug('store:deleteNode:success', `${data.id} deleted for ${data.label}`)

    },

    setDataForLabel(state, data) {

      switch(data.label) {

        case 'Document':      state.documents = data.data
                              if (data.loaded)    { state.loadedDocuments = true }
                              if (data.processed) { state.processedDocuments = true }
                              return
        case 'Event':         state.events = data.data
                              if (data.loaded)    { state.loadedEvents = true }
                              if (data.processed) { state.processedEvents = true }
                              return
        case 'Location':      state.locations = data.data
                              if (data.loaded)    { state.loadedLocations = true }
                              if (data.processed) { state.processedLocations = true }
                              return
        case 'LocationType':  state.locationtypes = data.data
                              if (data.loaded)    { state.loadedLocationTypes = true }
                              if (data.processed) { state.processedLocationTypes = true }
                              return
        case 'Person':        state.persons = data.data
                              if (data.loaded)    { state.loadedPersons = true }
                              if (data.processed) { state.processedPersons = true }
                              return
        case 'Source':        state.sources = data.data
                              if (data.loaded)    { state.loadedSources = true }
                              if (data.processed) { state.processedSources = true }
                              return
        case 'Tag':           state.tags = data.data
                              if (data.loaded)    { state.loadedTags = true }
                              if (data.processed) { state.processedTags = true }
                              return
        default: return

      }

    },

    refreshData(state) {

      state.loadedDocuments        = false
      state.loadedEvents           = false
      state.loadedLocations        = false
      state.loadedLocationTypes    = false
      state.loadedPersons          = false
      state.loadedSources          = false
      state.loadedTags             = false

      state.processedDocuments     = false
      state.processedEvents        = false
      state.processedLocations     = false
      state.processedLocationTypes = false
      state.processedPersons       = false
      state.processedSources       = false
      state.processedTags          = false

    }

  },

})