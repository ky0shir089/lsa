<template>
  <v-container fluid>
    <v-card width="400" class="elevation-12 mx-auto">
      <v-toolbar color="primary" dark flat>
        <v-toolbar-title>Change Password</v-toolbar-title>
      </v-toolbar>

      <v-card-text align="center">
        <v-form v-model="valid">
          <v-text-field
            v-model="old"
            outlined
            label="Old Password"
            :type="show1 ? 'text' : 'password'"
            prepend-icon="mdi-lock"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="show1 = !show1"
            :rules="rules1"
          ></v-text-field>

          <v-text-field
            v-model="new1"
            outlined
            label="New Password"
            :type="show2 ? 'text' : 'password'"
            prepend-icon="mdi-lock"
            :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="show2 = !show2"
            :rules="rules1"
          ></v-text-field>

          <v-text-field
            v-model="new2"
            outlined
            label="Password Confirmation"
            :type="show3 ? 'text' : 'password'"
            prepend-icon="mdi-lock"
            :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="show3 = !show3"
            :rules="rules2"
          ></v-text-field>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-btn
          block
          color="primary"
          :loading="loading"
          :disabled="!valid"
          @click="doChange"
          >Login</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "change-passsword",
  data: () => ({
    valid: true,
    old: "",
    show1: false,
    rules1: [
      (v) => !!v || "field is required",
      (v) => v.length >= 8 || "Password minimal 8 karakter",
    ],
    new1: "",
    show2: false,
    new2: "",
    show3: false,
    min: 8,
    loading: false,
  }),
  computed: {
    ...mapGetters({
      user: "auth/user",
      access_token: "token/token",
    }),
    rules2() {
      const rules = [];

      if (this.min) {
        const rule = (v) =>
          (v || "").length >= this.min ||
          `Password minimal ${this.min} karakter`;

        rules.push(rule);
      }

      if (this.new1) {
        const rule = (v) => (!!v && v) === this.new1 || "Password tidak sama";

        rules.push(rule);
      }

      return rules;
    },
  },
  methods: {
    ...mapActions({
      setAlert: "alert/set",
      setAuth: "auth/set",
      setToken: "token/set",
    }),
    async doChange() {
      this.loading = true;

      let formData = new FormData();
      formData.set("id", this.user.id);
      formData.set("old", this.old);
      formData.set("password", this.new2);

      await this.axios
        .post("user/v1/change-password", formData, {
          headers: {
            Authorization: "Bearer " + this.access_token,
          },
        })
        .then(() => {
          this.login();
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
      formData.set("npk", this.user.npk);
      formData.set("password", this.new2);

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
          location.href = "/";
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
  beforeRouteLeave(to, from, next) {
    next(false);
  },
};
</script>