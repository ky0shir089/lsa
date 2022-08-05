<template>
  <v-container fluid>
    <app-bar />

    <v-app-bar app color="primary" v-if="$vuetify.breakpoint.xs">
      <v-btn icon dark @click.stop="$router.go(-1)">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <v-row>
      <v-col cols="12" sm="6">
        <div class="text-h5 mb-4">{{ $route.name }}</div>

        <v-form ref="form" v-model="valid">
          <v-text-field
            v-model="form.npk"
            label="NPK"
            outlined
            dense
            readonly
            :rules="formRules"
          ></v-text-field>

          <v-text-field
            v-model="form.name"
            label="User Name"
            outlined
            dense
            readonly
            :rules="formRules"
          ></v-text-field>

          <v-autocomplete
            v-model="form.chpass"
            label="Reset Password"
            :items="resets"
            outlined
            dense
            hide-selected
            :rules="formRules"
          ></v-autocomplete>

          <v-autocomplete
            v-model="form.status"
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

      <v-col cols="12" sm="6">
        <v-list>
          <v-subheader class="d-flex align-center justify-space-between">
            Role
            <v-btn icon small color="green" @click="show = true">
              <v-icon> mdi-plus-circle </v-icon>
            </v-btn>
          </v-subheader>

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
            append-outer-icon="mdi-content-save"
            @click:append-outer="store_role"
            :rules="formRules"
            v-if="show"
          ></v-autocomplete>

          <v-list-item-group color="primary">
            <v-list-item v-for="item in form.user_roles" :key="item.id">
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.role_name }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "EditUser",
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
    form: {
      npk: "",
      name: "",
      chpass: "",
      status: "",
    },
    formRules: [(v) => !!v || "Field is required"],
    outlets: [],
    roles: [],
    resets: ["YES", "NO"],
    status: ["ACTIVE", "INACTIVE"],
    loading: false,
    show: false,
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
        .get("user/v1/user/" + this.id, {
          headers: {
            Authorization: "Bearer " + this.access_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.form = data[0];
        });
    },
    async getRoles() {
      await this.axios
        .get("setup-aplikasi/v1/list-role", {
          headers: {
            Authorization: "Bearer " + this.access_token,
          },
          params: {
            user_id: this.form.id,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.roles = data;
        });
    },
    async update() {
      this.loading = true;

      let formData = new FormData();

      formData.set("id", this.form.id);
      formData.set("chpass", this.form.chpass);
      formData.set("status", this.form.status);

      await this.axios
        .post("user/v1/update", formData, {
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
    async store_role() {
      let formData = new FormData();

      formData.set("user_id", this.form.id);
      formData.set("role_id", JSON.stringify(this.form.role_id));
      formData.set("user_role_status", "ACTIVE");

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
          this.show = false
          this.getUsers();
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
  },
};
</script>

<style>
</style>