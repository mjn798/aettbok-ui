<template>
    <v-card>
        <v-card-title>Family</v-card-title>
        <v-container>
            <v-row>
                <v-col cols="12" sm="6">
                    <div class="caption my-4 text-uppercase">Parents & Siblings</div>
                    <person-quickcard
                        :id="parent.id"
                        :key="parent.id"
                        v-for="parent in getParents"
                    />
                    <person-quickcard
                        :id="sibling.id"
                        :key="sibling.id"
                        class="ml-8"
                        v-for="sibling in getSiblings.full"
                    />
                    <div class="caption my-4 text-uppercase" v-if="getSiblings.half.length">Halfsiblings</div>
                    <person-quickcard
                        :id="sibling.id"
                        :key="sibling.id"
                        class="ml-8"
                        v-for="sibling in getSiblings.half"
                    />
                </v-col>
                <v-col cols="12" sm="6">
                    <div class="caption my-4 text-uppercase">Partners & Children</div>
                    <div :key="entry.partner.id" v-for="entry in getPartnersAndChildren">
                        <person-quickcard :id="entry.partner.id" />
                        <person-quickcard
                            :id="child.id"
                            :key="child.id"
                            class="ml-8"
                            v-for="child in entry.children"
                        />
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

import PersonQuickCard from './PersonQuickCard.vue'

export default {

  name: 'PersonFamily',

  components: {
    'person-quickcard': PersonQuickCard,
  },

  computed: {

    ...mapGetters({
        getEvents: 'getEvents',
        getPerson: 'getPerson',
        getPersons: 'getPersons',
    }),

    selectedPerson() { return this.getPerson(this.$route.params.id) },

    getParents() { return this.getPersons.filter(e => this.selectedPerson.parents.includes(e.id)).sort((a, b) => (b.gender || '').localeCompare(a.gender || '')) },

    getPartnersAndChildren() {

        let structure = []

        // PARTNERS FROM MARRIAGE EVENTS
        // could be a marriage without children

        let events = this.getEvents.filter(e => (e.type === "MARRIAGE") && (e.attended.includes(this.selectedPerson.id)))

        events.forEach(e => {

            let partner = e.attended.filter(partner => partner !== this.selectedPerson.id)

            partner.forEach(x => {
                let p = structure.find(s => s.partner.id === x)
                if (!p) { return structure.push({ partner: this.getPerson(x), children: [] }) }
            })

        })

        // PARTNERS FROM CHILDREN'S PARENTS
        // could be a bastard child

        this.selectedPerson.children.forEach(e => {

            let child = this.getPerson(e)
            let partner = child.parents.filter(p => p !== this.selectedPerson.id)

            if (!partner.length) {
                let x = structure.find(s => s.partner.id === 'unknown')
                if (!x) {
                    return structure.push({ partner: { id: 'unknown'}, children: [child] })
                }
                return x.children.push(child)
            }

            return partner.forEach(p => {
                let x = structure.find(s => s.partner.id === p)
                if (!x) { return structure.push({ partner: this.getPerson(p), children: [child] }) }
                return x.children.push(child)
            })

        })

        structure.forEach(e => e.children = e.children.sort((a, b) => (a.birth || '').localeCompare(b.birth || '')))

        return structure.sort((a, b) => (a.partner.birth || '').localeCompare(b.partner.birth || ''))

    },

    getSiblings() {

        let siblingsFull = new Set()
        let siblingsHalf = new Set()

        this.selectedPerson.parents.forEach(e => {

            let parent = this.getPerson(e)

            if (parent.children) {

                parent.children.forEach(child => {

                    let sibling = this.getPerson(child)

                    let isFull = true
                    
                    sibling.parents.forEach(e => {
                        if (!this.selectedPerson.parents.includes(e)) { return isFull = false }
                    })

                    if (isFull) { return siblingsFull.add(this.getPerson(child)) }

                    return siblingsHalf.add(this.getPerson(child))

                })

            }

        })

        return {
            full: Array.from(siblingsFull).filter(e => e.id !== this.selectedPerson.id).sort((a, b) => (a.birth || '').localeCompare(b.birth || '')),
            half: Array.from(siblingsHalf).filter(e => e.id !== this.selectedPerson.id).sort((a, b) => (a.birth || '').localeCompare(b.birth || '')),
        }

    }

  },

}
</script>