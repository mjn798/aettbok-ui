import store from '../store/index'

// Firebase configuration

const firebase       = require('firebase/app')
const firebaseAuth   = require('firebase/auth')
const firebaseConfig = { apiKey: process.env.VUE_APP_FIREBASE_API_KEY, authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN, projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID, appId: process.env.VUE_APP_FIREBASE_APP_ID }

firebase.initializeApp(firebaseConfig)

// if authentication state changes, log the user information

firebaseAuth.getAuth().onAuthStateChanged(user => {

    if (user) { return  console.debug('authentication:stateChange:existingUser', user.email) }
    return console.debug('authentication:stateChange:user does not exist')

})

// if access token changes, persist it in firebaseUserToken

firebaseAuth.getAuth().onIdTokenChanged(token => {

    if (!token) { return store.dispatch('setAccessToken', null) }

    token.getIdTokenResult()
    .then(result => {
        console.debug('authentication:tokenChange:received new token:expirationTime', result.expirationTime)
        store.dispatch('setAccessToken', result)
    })
    .catch(error => console.error('authentication:tokenChange', error))

})

// create a new user with username and password

export function createAccountWithEmailAndPassword(email, password) {
    return new Promise((resolve, reject) => {

        console.debug('authentication:createAccount', email)

        let auth = firebaseAuth.getAuth()

        return firebaseAuth.createUserWithEmailAndPassword(auth, email, password)
        .then(credential => resolve(credential))
        .catch(error => reject(error))
    
    })
}

// login with username and password

export function login(username, password) {
    return new Promise((resolve, reject) => {

        console.debug('authentication:login')

        let auth = firebaseAuth.getAuth()

        // persist authentication in browser

        firebaseAuth.setPersistence(auth, firebaseAuth.browserLocalPersistence)
        .then(() => {

            firebaseAuth.signInWithEmailAndPassword(auth, username, password)
            .then(() => resolve(console.debug('authentication:success', username)))
            .catch(error => reject(error))

        })
        .catch(error => reject(error))

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
            .then(() => resolve(console.debug('authentication:success:GoogleAccount')))
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