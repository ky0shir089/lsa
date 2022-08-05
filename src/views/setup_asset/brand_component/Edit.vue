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
            v-model="form.component_id"
            label="Komponen"
            :items="components"
            item-text="component_name"
            item-value="id"
            outlined
            dense
            hide-selected
            :rules="formRules"
          >
            <template v-slot:selection="data">
              {{ data.item.unit_name }} -
              {{ data.item.component_name }}
            </template>

            <template v-slot:item="data">
              {{ data.item.unit_name }} -
              {{ data.item.component_name }}
            </template>
          </v-autocomplete>

          <v-text-field
            v-model="form.brand_component_name"
            label="Nama Brand"
            outlined
            dense
            :rules="formRules"
          ></v-text-field>
        </v-form>

        <v-btn
          block
          color="primary"
          :loading="loading"
          :disabled="!valid"
          @click="update"
        >
          <v-icon left>mdi-content-save</v-icon>
          update
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "UpdateBrandComponent",
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
    components: [],
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
    async getComponent() {
      await this.axios
        .get("setup-asset/v1/component", {
          headers: {
            Authorization: "Bearer " + this.access_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.components = data;
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
    async getBrand() {
      await this.axios
        .get("setup-asset/v1/brand-component/" + this.id, {
          headers: {
            Authorization: "Bearer " + this.access_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.form = data;
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
      formData.set("component_id", this.form.component_id);
      formData.set(
        "brand_component_name",
        this.form.brand_component_name.toUpperCase()
      );

      await this.axios
        .post("setup-asset/v1/update-brand-component/" + this.id, formData, {
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
    await this.getComponent();
    await this.getBrand();
  },
};
</script>

<style>
</style>