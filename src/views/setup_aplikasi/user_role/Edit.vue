<template>
  <v-container fluid>
    <app-bar />

    <v-app-bar app color="primary" v-if="$vuetify.breakpoint.xs">
      <v-btn icon dark @click.stop="$router.go(-1)">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <v-row dense>
      <v-col cols="12" sm="6">
        <div class="text-h5 mb-4">{{ $route.name }}</div>

        <v-form ref="form" v-model="valid">
          <v-text-field
            v-model="form.name"
            label="User"
            outlined
            dense
            readonly
            :rules="formRules"
          ></v-text-field>

          <v-text-field
            v-model="form.role_name"
            label="Role"
            outlined
            dense
            readonly
            :rules="formRules"
          ></v-text-field>

          <v-autocomplete
            v-model="form.user_role_status"
            label="Status"
            :items="status"
            outlined
            dense
            hide-selected
            :rules="formRules"
          ></v-autocomplete>
        </v-form>

        <v-btn
          block
          color="primary"
          :loading="loading"
          :disabled="!valid"
          @click="update"
        >
          <v-icon left>mdi-content-save</v-icon>UPDATE
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "EditUserRole",
  props: {
    id: {
      required: true,
      type: String,
    },
  },
  components: {
    AppBar: () =>
      import(/* webpackChunkName: "alert" */ "@/components/AppBar.vue"),
  },
  data: () => ({
    valid: true,
    formRules: [(v) => !!v || "Field is required"],
    form: {},
    users: [],
    roles: [],
    status: ["ACTIVE", "INACTIVE"],
    loading: false,
  }),
  computed: {
    ...mapGetters({
      access_token: "token/token",
    }),
  },
  methods: {
    ...mapActions({
      setAlert: "alert/set",
    }),
    async getUsers() {
      await this.axios
        .get("user/v1/user", {
          headers: {
            Authorization: "Bearer " + this.access_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.users = data;
        });
    },
    async getRoles() {
      await this.axios
        .get("setup-aplikasi/v1/role", {
          headers: {
            Authorization: "Bearer " + this.access_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.roles = data;
        });
    },
    async getUserRoles() {
      await this.axios
        .get("setup-aplikasi/v1/user-role", {
          headers: {
            Authorization: "Bearer " + this.access_token,
          },
          params: {
            id: this.id,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.form = data[0];
        });
    },
    async update() {
      this.loading = true;

      let formData = new FormData();

      formData.set("id", this.id);
      formData.set("user_id", this.form.user_id);
      formData.set("role_id", this.form.role_id);
      formData.set("user_role_status", this.form.user_role_status);

      await this.axios
        .post("setup-aplikasi/v1/update-user-role", formData, {
          headers: {
            Authorization: "Bearer " + this.access_token,
          },
        })
        .then((response) => {
          let { data } = response;
          this.setAlert({
            status: true,
            color: "success",
            text: data.message,
          });
          this.$router.go(-1);
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
    await this.getUsers();
    await this.getRoles();
    await this.getUserRoles();
  },
};
</script>

<style>
</style>