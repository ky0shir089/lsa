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
          <v-autocomplete
            v-model="form.user_id"
            label="User"
            :items="users"
            item-text="name"
            item-value="id"
            outlined
            dense
            hide-selected
            @change="getRoles"
            :rules="formRules"
          ></v-autocomplete>

          <v-autocomplete
            v-model="form.role_id"
            label="Role"
            :items="roles"
            item-text="role_name"
            item-value="id"
            outlined
            dense
            small-chips
            multiple
            hide-selected
            :rules="formRules2"
          ></v-autocomplete>

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
          @click="store"
        >
          <v-icon left>mdi-content-save</v-icon>SAVE
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "NewUserRole",
  components: {
    AppBar: () =>
      import(/* webpackChunkName: "alert" */ "@/components/AppBar.vue"),
  },
  data: () => ({
    valid: true,
    form: {
      user_id: "",
      role_id: [],
      user_role_status: "",
    },
    formRules: [(v) => !!v || "Field is required"],
    formRules2: [(v) => v.length > 0 || "Field is required"],
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
        .get("setup-aplikasi/v1/list-role", {
          headers: {
            Authorization: "Bearer " + this.access_token,
          },
          params: {
            user_id: this.form.user_id,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.roles = data;
        });
    },
    async store() {
      this.loading = true;

      let formData = new FormData();

      formData.set("user_id", this.form.user_id);
      formData.set("role_id", JSON.stringify(this.form.role_id));
      formData.set("user_role_status", this.form.user_role_status);

      await this.axios
        .post("setup-aplikasi/v1/store-user-role", formData, {
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
  },
};
</script>

<style>
</style>