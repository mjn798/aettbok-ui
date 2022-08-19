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
                  <v-col cols="12"><v-text-field autocomplete="username" class="ma-2" hide-details label="Username" prepend-icon="mdi-email" v-model="username" /></v-col>
                  <v-col cols="12"><v-text-field autocomplete="current-password" class="ma-2" hide-details label="Password" prepend-icon="mdi-lock-outline" type="password" v-model="password" /></v-col>
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
import * as authentication from '../../scripts/authentication'

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

    login() {

      this.isLoading = true

      authentication.login(this.username, this.password)
      .then(() => console.debug('login:success', this.username))
      .catch(error => console.error('login:error', error))
      .finally(() => this.isLoading = false)

    },

  },

}
</script>