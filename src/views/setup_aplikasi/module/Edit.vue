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
            v-model="form.module_name"
            label="Module Name"
            outlined
            dense
            :rules="formRules"
          ></v-text-field>

          <v-text-field
            v-model="form.module_icon"
            label="Module Icon"
            outlined
            dense
            :rules="formRules"
          ></v-text-field>

          <v-text-field
            v-model="form.module_seq"
            type="number"
            label="Module Seq"
            outlined
            dense
            min="1"
            max="99"
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
          UPDATE
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "EditModule",
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
    async getModules() {
      await this.axios
        .get("setup-aplikasi/v1/module/" + this.id, {
          headers: {
            Authorization: "Bearer " + this.access_token,
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
      // formData.set("id", this.form.id);
      formData.set("module_name", this.form.module_name.toUpperCase());
      formData.set("module_icon", this.form.module_icon);
      formData.set("module_seq", this.form.module_seq);

      await this.axios
        .post("setup-aplikasi/v1/update-module/" + this.form.id, formData, {
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
    await this.getModules();
  },
};
</script>

<style>
</style>