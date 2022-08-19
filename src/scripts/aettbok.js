const axios = require('axios')

import store from '../store/index'
import * as data from './aettbokdata'



/* DATA LOADING AND PROCESSING */



// refresh data from API

function refreshData() { return store.dispatch('refreshData') }

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

export function upsertNode(node, label) {
    return new Promise((resolve, reject) => {

        const headers = { 'Authorization': `Bearer ${store.getters.getAccessToken}` }

        let url = `${process.env.VUE_APP_API_BASE_URL}/${label}`

        if (node.id) { url += `/${node.id}` }

        return axios
        .post(url, node, { "headers": headers })
        .then(() => resolve(refreshData()))
        .catch(error => reject(error))

    })
}
