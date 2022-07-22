require('dotenv').config()

const axios = require('axios')

import store from '../store/index'

export function getFormattedDate(day, month, year, monthLength = 'short') {

    if (!day && !month && !year) { return null }

    let options = { }

    if (year) { options.year = 'numeric' } else { year = 0 }

    if (monthLength !== 'yearOnly') {

        if (month) { options.month = monthLength } else { month = 1 }
        if (day) { options.day = 'numeric' } else { day = 1 }

    } else {

        month = 1
        day = 1

    }

    return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString(undefined, options)

}

function getSortableDate(day, month, year) { return `${year ? year.toString().padStart(4, 0) : '0000'}-${month ? month.toString().padStart(2, 0) : '00'}-${day ? day.toString().padStart(2, 0) : '00'}` }

export function getFormattedEventType(type) {

    switch(type) {
        case 'BIRTH': return 'Birth'
        case 'DEATH': return 'Death'
        case 'MARRIAGE': return 'Marriage'
        case 'RESIDENCE': return 'Residence'
        case 'WORK': return 'Work'
        default: return null
    }

}

export function getPersonFullName(item) {

    if (!item) { return null }

    return `${item.firstname ? item.firstname : ''} ${item.lastname ? item.lastname : ''}`.trim()

}



/* DATA LOADING AND PROCESSING */



// refresh data from API

function refreshData() {

    return store.dispatch('refreshData')

}

// load resource from REST API

export function loadResource(label, token) {

    const headers = { 'Authorization': `Bearer ${token}` }

    return axios
    .get(`${process.env.VUE_APP_API_BASE_URL}/${label}`, { "headers": headers })
    .then(result => {

        // resolve some of the relationships

        console.debug(`aettbok:loadResource`, label, result.data)

        store.dispatch('setDataForLabel', { label: label, data: result.data, loaded: true })

    })
    .catch(() => console.error(`aettbok:loadResource:Error during loading "${label}"`))

}

// process resource and resolve relationships into node object

export function processResource(label) {

    switch(label) {

        case 'Document':     return processDocuments()
        case 'Event':        return processEvents()
        case 'Location':     return processLocations()
        case 'LocationType': return processLocationTypes()
        case 'Person':       return processPersons()
        case 'Source':       return processSources()
        case 'Tag':          return processTags()

        default: return null

    }

}

// process Document labels

function processDocuments() {

    let documents = store.getters.getDocuments
    let persons   = store.getters.getPersons
    let sources   = store.getters.getSources

    documents.forEach(document => {

        // resolve tags

        document.tags = []
        document.persons = []

        // resolve source

        document.relations.filter(e => (e.label === 'Source') && (e.direction === 'to')).forEach(relation => {

            let node = sources.find(e => e.id === relation.id)
            if (node) {
                document[`sourcedby`] = node.id
                document[`sourcedbyName`] = node.source
            }

        })

        // resolve persons

        document.relations.filter(e => (e.label === 'Person') && (e.direction === 'from')).forEach(relation => {

            let node = persons.find(e => e.id === relation.id)
            if (node) { document.persons.push(node.id) }

        })

        // resolve date

        if (document.date) {

            let date = document.date.split('-')
    
            document.datelong = getFormattedDate(date[2], date[1], date[0])

        }

        // resolve tag labels

        document.tagLabel = `${document.sourcedbyName || ''} - ${document.index || ''}`.trim()

    })

    return store.dispatch('setDataForLabel', { label: 'Document', data: documents, processed: true })

}

// process Event labels

function processEvents() {

    let documents = store.getters.getDocuments
    let events    = store.getters.getEvents
    let locations = store.getters.getLocations
    let persons   = store.getters.getPersons

    events.forEach(event => {

        event.tags = []

        // resolved type

        event[`typeString`] = getFormattedEventType(event.type)

        // resolved event date

        if (event.day || event.month || event.year) {
            event.date = getSortableDate(event.day, event.month, event.year)
            event.datelong = getFormattedDate(event.day, event. month, event.year)
        }

        // location

        event.relations.filter(e => (e.label === 'Location') && (e.direction === 'to')).forEach(relation => {

            let node = locations.find(e => e.id === relation.id)
            if (node && node.location) {
                event[`wasin`] = node.id
                event[`wasinString`] = node.location
            }

        })

        // persons

        event[`attended`] = []
        event[`attendedString`] = ''

        event.relations.filter(e => (e.label === 'Person') && (e.direction === 'from')).forEach(relation => {

            let node = persons.find(e => e.id === relation.id)
            if (node) {
                event[`attended`].push(node.id)
                event[`attendedString`] += `${node.lastname ? node.lastname : ''} ${node.firstname ? node.firstname : ''}`.trim() + ', '
            }

        })

        if (event['attendedString'].length) { event['attendedString'] = event['attendedString'].slice(0, -2) }

        // documents

        event.documentedby = []

        event.relations.filter(e => (e.label === 'Document') && (e.direction === 'to')).forEach(relation => {

            let node = documents.find(e => e.id === relation.id)
            if (node) { event.documentedby.push(node.id) }

        })

        event.numberOfDocuments = event.documentedby.length || 0
        event.numberOfDocumentsIcon = `mdi-numeric-${event.numberOfDocuments < 10 ? event.numberOfDocuments : '9-plus'}-box${event.numberOfDocuments === 0 ? '-outline' : '-multiple'}`

    })

    return store.dispatch('setDataForLabel', { label: 'Event', data: events, processed: true })

}

// recursively resolve location partofs

function resolvePartOf(id, getFull, resolvedString = null) {

    /* check for given id's parent */

    // return if no PARTOF relation, location has no parent
    let partof = store.getters.getLocation(getPartOfId(id))
    if (!(partof && partof.id)) { return resolvedString }

    // return if parent location does not exist
    let parentLocation = store.getters.getLocation(partof.id)
    if (!(parentLocation && parentLocation.id && parentLocation.location)) { return resolvedString }

    // return immediately parent if not getting full location
    if (!getFull) { return parentLocation.location }

    // if already calculated return known resolved parents
    if (parentLocation.partofResolved) { return `${parentLocation.location}, ${parentLocation.partofResolved}` }

    /* check for given id's grandparent */

    // if grandparent can be resolved, return it - otherwise return only parent
    let resolvedParent = resolvePartOf(parentLocation.id, getFull, resolvedString)
    return resolvedParent ? `${parentLocation.location}, ${resolvedParent}` : parentLocation.location

}

// get partof id

function getPartOfId(id) {

    // return if no id
    if (!id) { return null }

    // return if no location / relations for given id
    let location = store.getters.getLocation(id)
    if (!(location && location.relations)) { return null }

    // return if no PARTOF relation / location has no parent
    let partof = location.relations.find(e => (e.label === 'Location') && (e.direction === 'to'))

    return partof && partof.id ? partof.id : null

}

// process Location labels

function processLocations() {

    let locations     = store.getters.getLocations
    let locationTypes = store.getters.getLocationTypes

    locations.forEach(location => {

        location.tags = []
        location.documentedby = []

        // partof

        location.partof         = getPartOfId(location.id)
        location.partofLocation = resolvePartOf(location.id, false)
        location.partofResolved = resolvePartOf(location.id, true)

        // locationtype

        location.relations.filter(e => (e.label === 'LocationType') && (e.direction === 'to')).forEach(relation => {

            let locationType = locationTypes.find(e => e.id === relation.id)
            if (locationType) {
                location.locationtype = locationType.id
                location.locationtypeString = locationType.type
            } else {
                location.locationtype = null
                location.locationtypeString = null
            }

        })

        // number of documents icon

        location.numberOfDocuments = location.relations.filter(e => (e.label === 'Document') && (e.direction === 'from')).length || 0
        location.numberOfDocumentsIcon = `mdi-numeric-${location.numberOfDocuments < 10 ? location.numberOfDocuments : '9-plus'}-box${location.numberOfDocuments === 0 ? '-outline' : '-multiple'}`
        

    })

    return store.dispatch('setDataForLabel', { label: 'Location', data: locations, processed: true })

}

// process LocationType labels

function processLocationTypes() {
    let locationTypes = store.getters.getLocationTypes
    return store.dispatch('setDataForLabel', { label: 'LocationType', data: locationTypes, processed: true })
}

// process Person labels

function processPersons() {

    let documents = store.getters.getDocuments
    let events    = store.getters.getEvents
    let locations = store.getters.getLocations
    let persons   = store.getters.getPersons

    persons.forEach(person => {

        person.marriages = 0
        person.hasparents = []
        person.haschildren = []

        // icon

        person.icon      = person.gender === 'f' ? 'mdi-human-female' : person.gender === 'm' ? 'mdi-human-male' : 'mdi-human-male-female'
        person.iconColor = person.gender === 'f' ? 'pink darken-2' : person.gender === 'm' ? 'blue darken-2' : 'grey'

        // documents

        person.documentedby = []

        person.relations.filter(e => (e.label === 'Document') && (e.direction === 'to')).forEach(relation => {

            let node = documents.find(e => e.id === relation.id)
            if (node) { person.documentedby.push(node.id) }

        })

        person.numberOfDocuments = person.documentedby.length || 0
        person.numberOfDocumentsIcon = `mdi-numeric-${person.numberOfDocuments < 10 ? person.numberOfDocuments : '9-plus'}-box${person.numberOfDocuments === 0 ? '-outline' : '-multiple'}`

        // tags

        person.tags = person.relations.filter(relation => (relation.label === 'Tag') && (relation.direction === 'to')).map(e => e.id)

        // parents and children

        person.relations.filter(e => (e.label === 'Person')).forEach(relation => relation.direction === 'to' ? person.hasparents.push(relation.id) : person.haschildren.push(relation.id))

        // birth, death and marriage events

        person.relations.filter(e => (e.label === 'Event') && (e.direction === 'to')).forEach(relation => {

            let event = events.find(e => e.id === relation.id)

            if (['BIRTH', 'DEATH'].includes(event.type)) {

                let type = event.type.toLowerCase()
                let add  = false

                // dates

                if (event.day) {
                    add = true
                    person[`${type}Day`] = event.day
                }

                if (event.month) {
                    add = true
                    person[`${type}Month`] = event.month
                }

                if (event.year) {
                    add = true
                    person[`${type}Year`] = event.year
                }

                if (add) {
                    person[`${type}`] = getSortableDate(event.day, event.month, event.year)
                    person[`${type}long`] = getFormattedDate(event.day, event.month, event.year)
                }

                // locations

                let locationrelation = event.relations.find(e => (e.label === 'Location') && (e.direction === 'to'))
                if (locationrelation) {
                    let location = locations.find(e => e.id === locationrelation.id)
                    if (location && location.location) {
                        person[`${type}Location`] = location.location
                        person[`${type}LocationId`] = location.id
                    }
                }

            }

            if (['MARRIAGE'].includes(event.type)) { person.marriages += 1 }

        })

    })

    return store.dispatch('setDataForLabel', { label: 'Person', data: persons, processed: true })

}

// process Source labels

function processSources() {

    let sources   = store.getters.getSources
    let locations = store.getters.getLocations

    sources.forEach(source => {

        // resolve tags

        source.tags = []

        // resolve containedin

        source.relations.filter(e => (e.label === 'Source') && (e.direction === 'to')).forEach(relation => {

            let node = sources.find(e => e.id === relation.id)
            if (node) {
                source[`containedin`] = node.id
                source[`containedin-name`] = node.source
            }

        })

        // resolve storedin

        source.relations.filter(e => (e.label === 'Location') && (e.direction === 'to')).forEach(relation => {

            let node = locations.find(e => e.id === relation.id)
            if (node) {
                source[`storedin`] = node.id
                source[`storedin-name`] = node.location
            }

        })

    })

    return store.dispatch('setDataForLabel', { label: 'Source', data: sources, processed: true })

}

// process Tag labels

function processTags() {
    let tags = store.getters.getTags
    return store.dispatch('setDataForLabel', { label: 'Tag', data: tags, processed: true })
}



/* DELETE NODES */



export function deleteNodeWithLabelAndId(label, id) {
    return new Promise((resolve, reject) => {

        const token = store.getters.getAuthenticationToken
        const headers = { 'Authorization': `Bearer ${token}` }

        let url = `${process.env.VUE_APP_API_BASE_URL}/${label}/${id}`

        axios
        .delete(url, { "headers": headers })
        .then(result => {

            if (result.status !== 204) { reject(result.status) }

            refreshData()
            return resolve()

        })
        .catch(error => reject(error))

    })
}



/* UPSERT REQUESTS */



export function upsertNode(node, label) {
    return new Promise((resolve, reject) => {

        const token = store.getters.getAuthenticationToken
        const headers = { 'Authorization': `Bearer ${token}` }

        let url = `${process.env.VUE_APP_API_BASE_URL}/${label}`

        if (node.id) { url += `/${node.id}` }

        return axios
        .post(url, node, { "headers": headers })
        .then(() => resolve(refreshData()))
        .catch(error => reject(error))

    })
}
