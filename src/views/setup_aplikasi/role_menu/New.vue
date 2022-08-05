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
            v-model="form.role_id"
            label="Role"
            :items="roles"
            item-text="role_name"
            item-value="id"
            outlined
            dense
            hide-selected
            :rules="formRules"
            @change="getListMenu"
          ></v-autocomplete>

          <v-autocomplete
            v-model="form.menu_id"
            label="Menu"
            :items="menus"
            item-text="menu_name"
            item-value="id"
            outlined
            dense
            small-chips
            multiple
            hide-selected
            clearable
            :rules="formRules"
          ></v-autocomplete>

          <v-autocomplete
            v-model="form.rolemenu_status"
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
          <v-icon left>mdi-content-save</v-icon> SAVE
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "NewRoleMenu",
  components: {
    AppBar: () =>
      import(/* webpackChunkName: "alert" */ "@/components/AppBar.vue"),
  },
  data: () => ({
    valid: true,
    form: {
      role_id: "",
      menu_id: [],
      rolemenu_status: "",
    },
    formRules: [(v) => !!v || "Field is required"],
    roles: [],
    menus: [],
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
    async getRole() {
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
    async getListMenu() {
      await this.axios
        .get("setup-aplikasi/v1/list-menu", {
          headers: {
            Authorization: "Bearer " + this.access_token,
          },
          params: {
            role_id: this.form.role_id,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.menus = data;
        });
    },
    async store() {
      this.loading = true;

      let formData = new FormData();

      formData.set("role_id", this.form.role_id);
      formData.set("menu_id", JSON.stringify(this.form.menu_id));
      formData.set("rolemenu_status", this.form.rolemenu_status);

      await this.axios
        .post("setup-aplikasi/v1/store-role-menu", formData, {
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
    await this.getRole();
  },
};
</script>

<style>
</style>