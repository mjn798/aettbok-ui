import store from '../store/index'



/* RELATIONSHIPS */



// extract a relationship with a single endpoint

function extractRelationSingle(relations, label, direction) {

    let relation = extractRelations(relations, label, direction)
    return (relation && relation.length === 1) ? relation[0] : null

}

// extract relationships with multiple endpoints

function extractRelations(relations, label, direction) {
    return relations
        .filter(relation => (relation.label === label) && (relation.direction === direction))
        .map(relation => {
            let node = getRelatedNodes(label).find(e => e.id === relation.id)
            if (node) { return node.id }
        })
}



/* LOCATIONS */



// recursively resolve location partof relations

function resolvePartOf(id, getFull = false, resolvedString = null) {


    /* check for given id's parent */


    // return if location does not exist or has no relations
    let location = store.getters.getLocation(id)
    if (!location && !location.relations) { return resolvedString }

    // return if location is not PARTOF another location - the location has no parent
    let partof = extractRelationSingle(location.relations, 'Location', 'to')
    if (!partof) { return resolvedString }

    // return if parent location does not exist
    let parentLocation = store.getters.getLocation(partof)
    if (!(parentLocation)) { return resolvedString }

    // return immediately if not resolving full location path
    if (!getFull) { return parentLocation.location }


    /* check for given id's grandparent */


    // if grandparent can be resolved, return it - otherwise return only the parent
    let grandparentLocation = resolvePartOf(parentLocation.id, getFull, resolvedString)
    return grandparentLocation ? `${parentLocation.location}, ${grandparentLocation}` : parentLocation.location

}



/* DATE FUNCTIONS */



// format date to locale with different options

function getFormattedDate(day, month, year, monthLength = 'short') {

    if (!day && !month && !year) { return null }

    let options = { }

    if (year) { options.year = 'numeric' } else { year = 0 }

    if (monthLength !== 'yearOnly') {

        if (month) { options.month = monthLength } else { month = 1 }
        if (day)   { options.day   = 'numeric' }   else { day   = 1 }

    } else {

        month = 1
        day = 1

    }

    return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString(undefined, options)

}

// get ISO date for easily sorting by year, month, day

function getSortableDate(day, month, year) { return `${year ? year.toString().padStart(4, 0) : '0000'}-${month ? month.toString().padStart(2, 0) : '00'}-${day ? day.toString().padStart(2, 0) : '00'}` }



/* SWITCHES */



// get nodes for label from store

function getRelatedNodes(label) {

    switch(label) {

        case 'Document':     return store.getters.getDocuments
        case 'Event':        return store.getters.getEvents
        case 'Location':     return store.getters.getLocations
        case 'LocationType': return store.getters.getLocationTypes
        case 'Person':       return store.getters.getPersons
        case 'Source':       return store.getters.getSources
        case 'Tag':          return store.getters.getTags

        default: return []

    }

}

// get formatted event type string

function getFormattedEventType(type) {

    switch(type) {

        case 'BIRTH':     return 'Birth'
        case 'DEATH':     return 'Death'
        case 'MARRIAGE':  return 'Marriage'
        case 'RESIDENCE': return 'Residence'
        case 'WORK':      return 'Work'

        default: return null

    }

}



/* LABEL PROCESSING */



// process Document label

export function processDocuments() {

    let documents = store.getters.getDocuments

    documents.forEach(document => {

        // relations

        document.persons   = extractRelations(document.relations, 'Person', 'from')
        document.sourcedby = extractRelationSingle(document.relations, 'Source', 'to')
        document.tags      = extractRelations(document.relations, 'Tag', 'to')

        // calculated attributes

        let source = store.getters.getSource(document.sourcedby)
        if (source) { document.sourcedbyString = source.source }

        document.tagLabel = `${document.sourcedbyString || ''} - ${document.index || ''}`.trim()

        // resolve date

        if (document.date) {

            let date = document.date.split('-')
            document.dateLong = getFormattedDate(date[2], date[1], date[0])
            document.dateFull = getFormattedDate(date[2], date[1], date[0], 'long')

        }

    })

    return store.dispatch('setDataForLabel', { label: 'Document', data: documents, processed: true })

}

// process Event labels

export function processEvents() {

    let events = store.getters.getEvents

    events.forEach(event => {

        // relations

        event.attended     = extractRelations(event.relations, 'Person', 'from')
        event.documentedby = extractRelations(event.relations, 'Document', 'to')
        event.tags         = extractRelations(event.relations, 'Tag', 'to')
        event.wasin        = extractRelationSingle(event.relations, 'Location', 'to')

        // calculated attributes

        let wasin = store.getters.getLocation(event.wasin)
        if (wasin) { event.wasinString = wasin.location }

        event.numberOfDocuments     = event.documentedby.length
        event.numberOfDocumentsIcon = `mdi-numeric-${event.numberOfDocuments < 10 ? event.numberOfDocuments : '9-plus'}-box${event.numberOfDocuments === 0 ? '-outline' : '-multiple'}`
        event.typeString            = getFormattedEventType(event.type)

        // resolve date

        if (event.day || event.month || event.year) {
            event.date = getSortableDate(event.day, event.month, event.year)
            event.dateLong = getFormattedDate(event.day, event. month, event.year)
            event.dateFull = getFormattedDate(event.day, event. month, event.year, 'long')
        }

        // resolve attendees

        if (event.attended.length) {

            // fullname needs to be resolved here directly, as the person might not be processed yet

            event.attendedString = event.attended.reduce((previousValue, currentValue) => {
                let person = store.getters.getPerson(currentValue)
                let fullname = `${person.firstname || ''} ${person.lastname || ''}`.trim()
                return person ? `${previousValue}${fullname}, ` : previousValue
            }, '')

            if (event.attendedString) { event.attendedString = event.attendedString.slice(0, -2) }

        }

    })

    return store.dispatch('setDataForLabel', { label: 'Event', data: events, processed: true })

}

// process Location labels

export function processLocations() {

    let locations     = store.getters.getLocations

    locations.forEach(location => {

        // relations

        location.documentedby = extractRelations(location.relations, 'Document', 'to')
        location.locationtype = extractRelationSingle(location.relations, 'LocationType', 'to')
        location.partof       = extractRelationSingle(location.relations, 'Location', 'to')
        location.tags         = extractRelations(location.relations, 'Tag', 'to')

        // calculated attributes

        let locationtype = store.getters.getLocationType(location.locationtype)
        if (locationtype) { location.locationtypeString = locationtype.type }

        location.numberOfDocuments     = location.documentedby.length
        location.numberOfDocumentsIcon = `mdi-numeric-${location.numberOfDocuments < 10 ? location.numberOfDocuments : '9-plus'}-box${location.numberOfDocuments === 0 ? '-outline' : '-multiple'}`
        location.partofLocation        = resolvePartOf(location.id, false)
        location.partofResolved        = resolvePartOf(location.id, true)

    })

    return store.dispatch('setDataForLabel', { label: 'Location', data: locations, processed: true })

}

// process LocationType labels

export function processLocationTypes() { return store.dispatch('setDataForLabel', { label: 'LocationType', data: store.getters.getLocationTypes, processed: true }) }

// process Person labels

export function processPersons() {

    let persons = store.getters.getPersons

    persons.forEach(person => {

        // relations

        person.documentedby = extractRelations(person.relations, 'Document', 'to')
        person.events       = extractRelations(person.relations, 'Event', 'to')
        person.haschildren  = extractRelations(person.relations, 'Person', 'from')
        person.hasparents   = extractRelations(person.relations, 'Person', 'to')
        person.tags         = extractRelations(person.relations, 'Tag', 'to')

        // calculated attributes

        person.fullname              = `${person.firstname || ''} ${person.lastname || ''}`.trim()
        person.icon                  = person.gender === 'f' ? 'mdi-human-female' : person.gender === 'm' ? 'mdi-human-male' : 'mdi-human-male-female'
        person.iconColor             = person.gender === 'f' ? 'pink darken-2'    : person.gender === 'm' ? 'blue darken-2'  : 'grey'
        person.marriages             = 0
        person.numberOfDocuments     = person.documentedby.length
        person.numberOfDocumentsIcon = `mdi-numeric-${person.numberOfDocuments < 10 ? person.numberOfDocuments : '9-plus'}-box-${person.numberOfDocuments === 0 ? 'outline' : 'multiple'}`

        // event builder

        person.events.forEach(eventid => {

            let event = store.getters.getEvent(eventid)

            if (!event) { return }

            if (['MARRIAGE'].includes(event.type)) { person.marriages += 1 }

            if (['BIRTH', 'DEATH'].includes(event.type)) {

                // type

                let type = event.type.toLowerCase()

                // dates

                if (event.day)   { person[`${type}Day`]   = event.day   }
                if (event.month) { person[`${type}Month`] = event.month }
                if (event.year)  { person[`${type}Year`]  = event.year  }

                if (event.day || event.month || event.year) {
                    person[`${type}`]     = getSortableDate(event.day, event.month, event.year)
                    person[`${type}Long`] = getFormattedDate(event.day, event.month, event.year)
                    person[`${type}Full`] = getFormattedDate(event.day, event.month, event.year, 'long')
                }

                // locations

                let location = store.getters.getLocation(extractRelationSingle(event.relations, 'Location', 'to'))

                if (location) {
                    person[`${type}LocationString`] = location.location
                    person[`${type}Location`]       = location.id
                }

            }
        })

    })

    return store.dispatch('setDataForLabel', { label: 'Person', data: persons, processed: true })

}

// process Source labels

export function processSources() {

    let sources = store.getters.getSources

    sources.forEach(source => {

        // relations

        source.containedin = extractRelationSingle(source.relations, 'Source', 'to')
        source.storedin    = extractRelationSingle(source.relations, 'Location', 'to')
        source.tags        = extractRelations(source.relations, 'Tag', 'to')

        // calculated attributes

        let containedin = store.getters.getLocation(source.containedin)
        if (containedin) { source.containedinString = containedin.location }

        let storedin = store.getters.getLocation(source.storedin)
        if (storedin) { source.storedinString = storedin.location }

    })

    return store.dispatch('setDataForLabel', { label: 'Source', data: sources, processed: true })

}

// process Tag labels

export function processTags() { return store.dispatch('setDataForLabel', { label: 'Tag', data: store.getters.getTags, processed: true }) }
