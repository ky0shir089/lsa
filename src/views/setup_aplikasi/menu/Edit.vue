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
          <v-autocomplete
            v-model="form.module_id"
            label="Module Name"
            :items="modules"
            item-text="module_name"
            item-value="id"
            outlined
            dense
            hide-selected
            :rules="formRules"
          ></v-autocomplete>

          <v-text-field
            v-model="form.menu_name"
            label="Menu Name"
            outlined
            dense
            :rules="formRules"
          ></v-text-field>

          <v-text-field
            v-model="form.menu_icon"
            label="Menu Icon"
            outlined
            dense
            :rules="formRules"
          ></v-text-field>

          <v-text-field
            v-model="form.menu_route"
            label="Menu Route"
            outlined
            dense
            :rules="formRules"
          ></v-text-field>

          <v-text-field
            v-model.number="form.menu_seq"
            type="number"
            label="Menu Seq"
            outlined
            dense
            :rules="formRules"
          ></v-text-field>

          <v-autocomplete
            v-model="form.menu_status"
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
          <v-icon left>mdi-content-save</v-icon>
          UPDATE
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "EditMenu",
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
    form: {},
    formRules: [(v) => !!v || "Field is required"],
    modules: [],
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
    async getModule() {
      await this.axios
        .get("setup-aplikasi/v1/module", {
          headers: {
            Authorization: "Bearer " + this.access_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.modules = data;
        })
        .catch((error) => {
          let responses = error.response.data;
          this.setAlert({
            status: true,
            color: "error",
            text: responses.message,
          });
        });
    },
    async getMenu() {
      await this.axios
        .get("setup-aplikasi/v1/menu/" + this.id, {
          headers: {
            Authorization: "Bearer " + this.access_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.form = data[0];
        })
        .catch((error) => {
          let responses = error.response.data;
          this.setAlert({
            status: true,
            color: "error",
            text: responses.message,
          });
        });
    },
    async update() {
      this.loading = true;

      let formData = new FormData();
      formData.set("menu_name", this.form.menu_name);
      formData.set("menu_icon", this.form.menu_icon);
      formData.set("menu_route", this.form.menu_route);
      formData.set("menu_seq", this.form.menu_seq);
      formData.set("menu_status", this.form.menu_status);
      formData.set("module_id", this.form.module_id);

      await this.axios
        .post("setup-aplikasi/v1/update-menu/" + this.form.id, formData, {
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
    await this.getModule();
    await this.getMenu();
  },
};
</script>

<style>
</style>