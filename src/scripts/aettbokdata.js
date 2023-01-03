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
            let node = store.getters.getNodesForLabel(label).find(e => e.id === relation.id)
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

function resolveParts(id, parts = []) {

    // return if location does not exist or has no relations
    let location = store.getters.getLocation(id)
    if (!(location && location.relations)) { return parts }

    // return if no child locations are found
    let relations = extractRelations(location.relations, 'Location', 'from')
    if (!(relations && relations.length)) { return parts }

    relations.forEach(e => {

        let child = store.getters.getLocation(e)
        if (!child) { return }
        
        parts.push({ id: child.id, text: child.location })
        parts = resolveParts(e, parts)

    })

    return parts

}


/* DATE FUNCTIONS */



// convert day, month, year to different date options

function getAllDates(day, month, year, item, type = null) {

    if (!(day || month || year)) { return item }

    item[`date${type || ''}`] = getSortableDate(day, month, year)
    item[`date${type || ''}short`] = getFormattedDate(day, month, year)
    item[`date${type || ''}long`] = getFormattedDate(day, month, year, 'long')

    return item

}

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

// get date for easily sorting by year, month, day

function getSortableDate(day, month, year) { return `${year ? year.toString().padStart(4, 0) : '0000'}-${month ? month.toString().padStart(2, 0) : '00'}-${day ? day.toString().padStart(2, 0) : '00'}` }



/* SWITCHES */



// get formatted event type string

function getFormattedEventType(type) {

    switch(type) {

        case 'BAPTISM':    return 'Baptism'
        case 'BIRTH':      return 'Birth'
        case 'DEATH':      return 'Death'
        case 'DIVORCE':    return 'Divorce'
        case 'MARRIAGE':   return 'Marriage'
        case 'MILITARY':   return 'Military'
        case 'OCCUPATION': return 'Occupation'
        case 'RESIDENCE':  return 'Residence'

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

        document = getAllDates(document.day, document.month, document.year, document)

        let source = store.getters.getSource(document.sourcedby)
        if (source) { document.sourcedbytext = source.source }

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

        event = getAllDates(event.day, event.month, event.year, event)

        event.documentscount = event.documentedby.length
        event.typetext = getFormattedEventType(event.type)

        let wasin = store.getters.getLocation(event.wasin)
        if (wasin) { event.wasintext = wasin.location }

        // resolve attendees

        if (event.attended.length) {

            event.attended = event.attended.sort((a, b) => (store.getters.getPerson(b) || { gender: 'u'}).gender.localeCompare((store.getters.getPerson(a) || { gender: 'u' }).gender) )

            // fullname needs to be resolved here directly, as the person might not be processed yet

            event.attendedtext = event.attended.reduce((previousValue, currentValue) => {
                let person = store.getters.getPerson(currentValue)
                let fullname = `${person.firstname || ''} ${person.lastname || ''}`.trim()
                return person ? `${previousValue}${fullname}, ` : previousValue
            }, '')

            if (event.attendedtext) { event.attendedtext = event.attendedtext.slice(0, -2) }

        }

    })

    return store.dispatch('setDataForLabel', { label: 'Event', data: events, processed: true })

}

// process Location labels

export function processLocations() {

    let locations = store.getters.getLocations

    locations.forEach(location => {

        // relations

        location.documentedby = extractRelations(location.relations, 'Document', 'to')
        location.locationtype = extractRelationSingle(location.relations, 'LocationType', 'to')
        location.partof       = extractRelationSingle(location.relations, 'Location', 'to')
        location.tags         = extractRelations(location.relations, 'Tag', 'to')

        // calculated attributes

        location.partofresolved = resolvePartOf(location.id, true)
        location.partoftext = resolvePartOf(location.id, false)
        location.parts = resolveParts(location.id)

        let locationtype = store.getters.getLocationType(location.locationtype)
        if (locationtype) { location.locationtypetext = locationtype.type }

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

        person.documentscount = person.documentedby.length
        person.gendercolor = person.gender === 'm' ? 'blue darken-2' : person.gender === 'f' ? 'pink darken-2' : 'grey'
        person.marriages = 0

        // event builder

        person.events.forEach(eventid => {

            let event = store.getters.getEvent(eventid)

            if (!event) { return }

            let type = event.type.toLowerCase()

            if (['marriage'].includes(type)) { return person.marriages += 1 }

            if (['birth', 'death'].includes(type)) {

                // dates

                if (event.day) { person[`date${type}day`] = event.day }
                if (event.month) { person[`date${type}month`] = event.month }
                if (event.year) { person[`date${type}year`] = event.year }

                if (event.day || event.month || event.year) { person = getAllDates(event.day, event.month, event.year, person, type) }

                // locations

                let location = store.getters.getLocation(extractRelationSingle(event.relations, 'Location', 'to'))

                if (location) {
                    person[`${type}location`] = location.id
                    person[`${type}locationtext`] = location.location
                }

                return

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

        source.containedin  = extractRelationSingle(source.relations, 'Source', 'to')
        source.documentedby = extractRelations(source.relations, 'Document', 'from')
        source.storedin     = extractRelationSingle(source.relations, 'Location', 'to')
        source.tags         = extractRelations(source.relations, 'Tag', 'to')

        // calculated attributes

        source.documentscount = source.documentedby.length

        let containedin = store.getters.getSource(source.containedin)
        if (containedin && containedin.source) { source.containedintext = containedin.source }

        let storedin = store.getters.getLocation(source.storedin)
        if (storedin && storedin.location ) { source.storedintext = storedin.location }

    })

    return store.dispatch('setDataForLabel', { label: 'Source', data: sources, processed: true })

}

// process Tag labels

export function processTags() { return store.dispatch('setDataForLabel', { label: 'Tag', data: store.getters.getTags, processed: true }) }
