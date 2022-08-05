<template>
  <v-container fluid>
    <v-card width="400" class="elevation-12 mx-auto">
      <v-toolbar color="primary" dark flat>
        <v-toolbar-title>{{ appName }} Login</v-toolbar-title>
      </v-toolbar>

      <v-card-text align="center">
        <v-form>
          <v-text-field
            v-model="npk"
            label="NPK"
            prepend-icon="mdi-account"
            type="text"
            outlined
          ></v-text-field>

          <v-text-field
            v-model="password"
            label="Password"
            prepend-icon="mdi-lock"
            :type="show ? 'text' : 'password'"
            outlined
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="show = !show"
            @keyup.enter="recaptcha"
          ></v-text-field>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-btn block color="primary" @click="recaptcha" :loading="loading">
          Login
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import Vue from "vue";
import { VueReCaptcha } from "vue-recaptcha-v3";
import { mapGetters, mapActions } from "vuex";

Vue.use(VueReCaptcha, { siteKey: "6LfbfIcfAAAAANZkcVo786BqMI2pKW_wlCacWZyT" });

export default {
  name: "my-login",
  data: () => ({
    npk: "",
    password: "",
    show: false,
    loading: false,
  }),
  computed: {
    ...mapGetters({
      guest: "auth/guest",
    }),
  },
  methods: {
    ...mapActions({
      setAlert: "alert/set",
      setAuth: "auth/set",
      setToken: "token/set",
    }),
    async recaptcha() {
      await this.$recaptchaLoaded();

      const token = await this.$recaptcha("login");

      this.siteverify(token);
    },
    async siteverify(token) {
      this.loading = true;

      let formData = new FormData();
      formData.set("token", token);

      await this.axios
        .post("/siteverify", formData)
        .then((response) => {
          let data = response.data;

          if (data.success && data.score > 0.5) {
            this.login();
          } else {
            this.setAlert({
              status: true,
              color: "error",
              text: data,
            });

            this.loading = false;
          }
        })
        .catch((error) => {
          let responses = error.response.data;
          this.setAlert({
            status: true,
            color: "error",
            text: responses.message,
          });
          this.loading = false;
        });
    },
    async login() {
      let formData = new FormData();
      formData.set("npk", this.npk);
      formData.set("password", this.password);

      await this.axios
        .post("/login", formData)
        .then((response) => {
          let { data } = response.data;
          this.setAuth(data);
          this.setToken(response.data.access_token);
          this.setAlert({
            status: true,
            color: "success",
            text: "Selamat Datang " + data.name,
          });

          if (data.chpass == "YES") {
            this.$router.push("/change-password");
          } else {
            location.href = "/";
          }
        })
        .catch((error) => {
          let responses = error.response.data;
          this.setAlert({
            status: true,
            color: "error",
            text: responses.message,
          });
          this.loading = false;
        });
    },
  },
  async created() {
    if (!this.guest) {
      this.$router.push("/");
    }
  },
};
</script>