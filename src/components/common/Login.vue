<template>
  <v-container style="max-width:fit-content;height:100%">
    <v-row no-gutters style="height:100%;align-content:center">
      <v-col>
        <v-card flat max-width="320">
          <v-card-text class="mb-4 text-h3 text-center">Ættbok</v-card-text>
        </v-card>
        <v-card max-width="320">
          <v-card-text>
            <v-container>
              <v-row no-gutters>
                <v-form>
                  <v-col cols="12"><v-text-field class="ma-2" hide-details label="Username" prepend-icon="mdi-email" v-model="username" /></v-col>
                  <v-col cols="12"><v-text-field class="ma-2" hide-details label="Password" prepend-icon="mdi-lock-outline" type="password" v-model="password" /></v-col>
                  <v-col cols="12">
                    <v-btn
                      :dark="!isDisabled"
                      :disabled="isDisabled"
                      :loading="isLoading"
                      @click="login"
                      block
                      class="ma-2"
                      color="primary"
                    >Login</v-btn>
                  </v-col>
                </v-form>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {

  name: 'Login',

  data: () => ({

    isLoading: false,

    username: 'neima@gmx.net', // null,
    password: 'test1234', // null,

  }),

  computed: {

    isDisabled() { return this.isLoading || !(this.username && this.password) }

  },

  methods: {

    ...mapActions({
      setAuthenticationToken: 'setAuthenticationToken',
    }),

    login() {

      this.isLoading = true

      const axios   = require('axios')
      const data    = { 'username': this.username, 'password': this.password }
      const headers = { 'Content-Type': 'application/json;charset=utf-8' }

      return axios
      .post('http://localhost:4000', data, { "headers": headers })
      .then(result => {

        if (result.status === 200 && result.data && result.data.accessToken) { this.setAuthenticationToken(result.data.accessToken) }

        return this.isLoading = false

      })
      .catch(() => {

        return this.isLoading = false

      })

    },

  },

}
</script>