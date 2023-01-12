const axios = require('axios')

import store from '../store/index'
import * as data from './aettbokdata'



/* GENERIC FUNCTION */



// compare two values

export function compareStrings(a, b) { return (a || '').toLocaleLowerCase().localeCompare((b || '').toLocaleLowerCase()) }

// toggle value inside an array (add if absent, remove if present)

export function toggleArrayValue(value, array) {

    let index = array.findIndex(e => e === value)
    return index === -1 ? array.push(value) : array.splice(index, 1)

}



/* DATA LOADING AND PROCESSING */



// load all resources

export function loadAllResources() {

    store.dispatch('refreshData')

    console.debug('aettbok:loadAllResources')

    loadResource('Document')
    loadResource('Event')
    loadResource('Location')
    loadResource('LocationType')
    loadResource('Person')
    loadResource('Source')
    loadResource('Tag')

}

// process resource and relationships

export function processResource(label) {

    switch(label) {

        case 'Document':     return data.processDocuments()
        case 'Event':        return data.processEvents()
        case 'Location':     return data.processLocations()
        case 'LocationType': return data.processLocationTypes()
        case 'Person':       return data.processPersons()
        case 'Source':       return data.processSources()
        case 'Tag':          return data.processTags()

        default: return null

    }

}



/* REST API CALLS */



// load full resource for given label

export function loadResource(label) {

    const headers = { 'Authorization': `Bearer ${store.getters.getAccessToken}` }

    return axios
    .get(`${process.env.VUE_APP_API_BASE_URL}/${label}`, { "headers": headers })
    .then(result => {

        console.debug(`aettbok:loadResource`, label, result.data)

        return store.dispatch('setDataForLabel', { label: label, data: result.data, loaded: true })

    })
    .catch(() => console.error(`aettbok:loadResource:Error during loading "${label}"`))

}

// delete a node with give label and id

export function deleteNodeWithLabelAndId(label, id) {
    return new Promise((resolve, reject) => {

        const headers = { 'Authorization': `Bearer ${store.getters.getAccessToken}` }

        let url = `${process.env.VUE_APP_API_BASE_URL}/${label}/${id}`

        axios
        .delete(url, { "headers": headers })
        .then(result => {

            if (result.status !== 204) { return reject(result.status) }

            return resolve(store.dispatch('deleteNode', { label: label, id: id }))

        })
        .catch(error => reject(error))

    })
}

// upsert a node for given label

// BIG TODO:
// this needs to be changed, so that not everything is reloaded
// instead change only the affected node (insert or update)
// this also affects all the relations - they need to be flipped in other nodes
// then re-process everything

export function upsertNode(node, label) {
    return new Promise((resolve, reject) => {

        const headers = { 'Authorization': `Bearer ${store.getters.getAccessToken}` }

        let url = `${process.env.VUE_APP_API_BASE_URL}/${label}`

        if (node.id) { url += `/${node.id}` }

        return axios
        .post(url, node, { "headers": headers })
        .then(result => {

            if (result.status !== 200) { return reject(result.status) }

            return resolve(store.dispatch('upsertNode', { label: label, data: result.data }))

        })
        .catch(error => reject(error))

    })
}
