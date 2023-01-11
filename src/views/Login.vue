<template>
  <v-container style="max-width:fit-content;height:100%">
    <v-row no-gutters style="height:100%;align-content:center">
      <v-col>
        <v-card :flat="isLoading" min-width="350" max-width="400">
          <div v-if="isLoading">
            <v-card-text class="text-center">
              <v-progress-circular
                :size="50"
                color="primary"
                indeterminate
              />
            </v-card-text>
          </div>
          <div v-else>
            <v-card-text>
              <v-tabs centered>
                <v-tab @click="action = 'login'">Login</v-tab>
                <v-tab @click="action = 'signup'">Sign up</v-tab>
              </v-tabs>
            </v-card-text>
            <v-card-text>
              <v-form>
                <v-text-field
                  autocomplete="email"
                  class="my-2"
                  dense
                  hide-details
                  label="Email"
                  outlined
                  prepend-inner-icon="mdi-email"
                  required
                  type="email"
                  v-model="email"
                />
                <v-text-field
                  autocomplete="current-password"
                  class="my-2"
                  dense
                  hide-details
                  label="Password"
                  outlined
                  prepend-inner-icon="mdi-key"
                  required
                  type="password"
                  v-model="password"
                />
                <v-btn
                  :dark="!isDisabled"
                  :disabled="isDisabled"
                  @click="loginsignup"
                  block
                  class="my-2"
                  color="primary"
                >
                  <span v-if="action === 'login'">Login</span>
                  <span v-if="action === 'signup'">Sign up</span>
                </v-btn>
              </v-form>
            </v-card-text>
            <v-divider />
            <v-card-text>
              <v-btn
                :dark="!isDisabled"
                @click="google"
                block
                class="my-2"
                color="primary"
              >
                <span>Login with Google</span>
              </v-btn>
            </v-card-text>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import * as authentication from '../scripts/authentication'

export default {

  name: 'Login',

  data: () => ({

    action: 'login',
    isLoading: false,

    email: null,
    password: null,

  }),

  computed: {

    isDisabled() { return this.isLoading || !(this.email && this.password) }

  },

  methods: {

    loginsignup() {

      this.isLoading = true

      if (this.action === 'login') {

        return authentication.login(this.email, this.password)
        .finally(() => {
          this.isLoading = false
          this.$router.push('/')
        })

      } else if (this.action === 'signup') {

        return authentication.createAccountWithEmailAndPassword(this.email, this.password)
        .finally(() => {
          this.isLoading = false
          this.$router.push('/')
        })

      }

    },

    google() {

      this.isLoading = true

      return authentication.loginWithGoogle()
      .finally(() => {
        this.isLoading = false
        this.$router.push('/')
      })

    },

  },

}
</script>