import store from '../store/index'
import { loadAllResources } from './aettbok'

// Firebase configuration

const firebase       = require('firebase/app')
const firebaseAuth   = require('firebase/auth')
const firebaseConfig = { apiKey: process.env.VUE_APP_FIREBASE_API_KEY, authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN, projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID, appId: process.env.VUE_APP_FIREBASE_APP_ID }

firebase.initializeApp(firebaseConfig)

// if authentication state changes, log the user information

firebaseAuth.getAuth().onAuthStateChanged(user => {

    if (user) { return console.debug('authentication:stateChange:existingUser', user.email) }
    return console.debug('authentication:stateChange:unknownUser')

})

// if access token changes, dispatch to store

firebaseAuth.getAuth().onIdTokenChanged(token => {

    if (!token) { return store.dispatch('setAccessToken', null) }

    token.getIdTokenResult()
    .then(result => {
        console.debug('authentication:tokenChange:receivedNewToken:expirationTime', result.expirationTime)
        store.dispatch('setAccessToken', result)
        loadAllResources()
    })
    .catch(error => {
        console.error('authentication:tokenChange:error', error)
        store.dispatch('setAccessToken', null)
    })

})

// get the current auth token or a refreshed one

export function getAuthToken() {
    return new Promise((resolve, reject) => {

        let auth = firebaseAuth.getAuth()

        auth.currentUser.getIdTokenResult()
        .then(result => resolve(result))
        .catch(error => {
            console.error('authentication:getAuthToken:error', error)
            reject(error)
        })
    
    })

}

// create a new user with username and password

export function createAccountWithEmailAndPassword(email, password) {
    return new Promise((resolve, reject) => {

        let auth = firebaseAuth.getAuth()

        return firebaseAuth.createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
            console.debug('authentication:createUserWithEmailAndPassword:success')
            return resolve()
        })
        .catch(error => {
            console.error('authentication:createUserWithEmailAndPassword:error', error)
            return reject()
        })

    })
}

// login with username and password

export function login(username, password) {
    return new Promise((resolve, reject) => {

        let auth = firebaseAuth.getAuth()

        // persist authentication in browser

        firebaseAuth.setPersistence(auth, firebaseAuth.browserLocalPersistence)
        .then(() => {

            firebaseAuth.signInWithEmailAndPassword(auth, username, password)
            .then(() => {
                console.debug('authentication:signInWithEmailAndPassword:success', username)
                return resolve()
            })
            .catch(error => {
                console.error('authentication:signInWithEmailAndPassword:error', username, error)
                return reject()
            })

        })
        .catch(error => {
            console.error('authentication:signInWithEmailAndPassword:setPersistence:error', error)
            return reject()
        })

    })
}

// login with Google Account

export function loginWithGoogle() {
    return new Promise((resolve, reject) => {

        let auth = firebaseAuth.getAuth()

        const googleProvider = new firebaseAuth.GoogleAuthProvider()

        // persist authentication in browser

        firebaseAuth.setPersistence(auth, firebaseAuth.browserLocalPersistence)
        .then(() => {

            firebaseAuth.signInWithPopup(auth, googleProvider)
            .then(() => {
                console.debug('authentication:signInWithGoogle:success')
                return resolve()
            })
            .catch(error => {
                console.error('authentication:signInWithGoogle:error', error)
                return reject()
            })

        })
        .catch(error => {
            console.error('authentication:signInWithGoogle:setPersistence:error', error)
            return reject()
        })

    })
}

// logout and delete access token in the store

export function logout() {
    return new Promise((resolve, reject) => {

        let auth = firebaseAuth.getAuth()

        firebaseAuth.signOut(auth)
        .then(() => {
            console.debug('authentication:logout:success')
            return resolve()
        })
        .catch(error => {
            console.error('authentication:logout:error', error)
            return reject()
        })
        .finally(() => store.dispatch('setAccessToken', null))

    })
}