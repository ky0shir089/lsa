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
            v-model="form.unit_id"
            label="Unit"
            :items="units"
            item-text="unit_name"
            item-value="id"
            outlined
            dense
            hide-selected
            :rules="formRules"
          ></v-autocomplete>

          <v-text-field
            v-model="form.brand_unit_name"
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
          @click="store"
        >
          <v-icon left>mdi-content-save</v-icon>
          SAVE
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "NewBrandUnit",
  components: {
    AppBar: () =>
      import(/* webpackChunkName: "alert" */ "@/components/AppBar.vue"),
  },
  data: () => ({
    valid: true,
    form: {
      unit_id: "",
      brand_unit_name: "",
    },
    formRules: [(v) => !!v || "Field is required"],
    units: [],
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
    async getUnit() {
      await this.axios
        .get("setup-asset/v1/unit", {
          headers: {
            Authorization: "Bearer " + this.access_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.units = data;
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
    async store() {
      this.loading = true;

      let formData = new FormData();
      formData.set("unit_id", this.form.unit_id);
      formData.set("brand_unit_name", this.form.brand_unit_name.toUpperCase());

      await this.axios
        .post("setup-asset/v1/store-brand-unit", formData, {
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
    await this.getUnit();
  },
};
</script>

<style>
</style>