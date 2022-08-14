import store from '../store/index'

// Firebase configuration

const firebase       = require('firebase/app')
const firebaseAuth   = require('firebase/auth')
const firebaseConfig = { apiKey: process.env.VUE_APP_FIREBASE_API_KEY, authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN, projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID, appId: process.env.VUE_APP_FIREBASE_APP_ID }

firebase.initializeApp(firebaseConfig)

// if access token changes (i.e. login) persist it in store

firebaseAuth.getAuth().onAuthStateChanged(user => {
    if (user) {
        console.debug('authentication:existingUser', user.email)
        tokenRefresh()
        return store.dispatch('setAccessToken', user.accessToken)
    } else {
        console.warn('authentication:user does not exist')
    }
})



// login with username and password

export function login(username, password) {
    return new Promise((resolve, reject) => {

        console.debug('authentication:login')

        let auth = firebaseAuth.getAuth()

        // persist authentication in local browser

        firebaseAuth.setPersistence(auth, firebaseAuth.browserLocalPersistence)
        .then(() => {

            firebaseAuth.signInWithEmailAndPassword(auth, username, password)
            .then(() => resolve(console.debug('authentication:success', username)))
            .catch(error => reject(error))
        
        })
        .catch(error => reject(error))

    })
}

// logout from authentication session

export function logout() {
    return new Promise((resolve, reject) => {

        console.debug('authentication:logout')

        let auth = firebaseAuth.getAuth()

        firebaseAuth.signOut(auth)
        .then(() => resolve(console.debug('authentication:logout:success')))
        .catch(error => reject(error))

    })
}

// refresh Access Tokens on regular interval

function tokenRefresh() {

    // regularly check the access token for expiration and require a new one if needed

    return setTimeout(function() {
        firebaseAuth.getAuth().currentUser.getIdToken()
        store.dispatch('setAccessToken', firebaseAuth.getAuth().currentUser.accessToken)
        console.debug('authentication:tokenRefresh')
        return tokenRefresh()
    }, 4 * 60 * 1000)

}