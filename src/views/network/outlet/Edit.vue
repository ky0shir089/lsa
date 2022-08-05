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
            v-model="form.branch_id"
            label="Nama Cabang"
            :items="branches"
            item-text="branch_name"
            item-value="id"
            outlined
            dense
            hide-selected
            :rules="formRules"
          ></v-autocomplete>

          <v-text-field
            v-model="form.outlet_code"
            label="Kode Titik"
            outlined
            dense
            :maxlength="5"
            :rules="formRules"
          ></v-text-field>

          <v-text-field
            v-model="form.outlet_name"
            label="Nama Titik"
            outlined
            dense
            :rules="formRules"
          ></v-text-field>

          <v-textarea
            v-model="form.outlet_address"
            label="Alamat Titik"
            outlined
            dense
            :rows="1"
            auto-grow
            :rules="formRules"
          ></v-textarea>

          <v-row dense>
            <v-col cols="6">
              <v-text-field
                v-model="form.kelurahan"
                label="Kelurahan"
                outlined
                dense
                readonly
                :rules="formRules"
              ></v-text-field>
            </v-col>

            <v-col cols="6">
              <v-text-field
                v-model="form.kecamatan"
                label="Kecamatan"
                outlined
                dense
                readonly
                :rules="formRules"
              ></v-text-field>
            </v-col>

            <v-col cols="4">
              <v-text-field
                v-model="form.kabupaten"
                label="Kabupaten"
                outlined
                dense
                readonly
                :rules="formRules"
              ></v-text-field>
            </v-col>

            <v-col cols="4">
              <v-text-field
                v-model="form.provinsi"
                label="Provinsi"
                outlined
                dense
                readonly
                :rules="formRules"
              ></v-text-field>
            </v-col>

            <v-col cols="3">
              <v-text-field
                v-model="form.kodepos"
                label="Kodepos"
                outlined
                dense
                readonly
                :rules="formRules"
              ></v-text-field>
            </v-col>

            <v-col cols="1">
              <v-btn icon @click="open">
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </v-col>
          </v-row>

          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="form.outlet_open"
                label="Tanggal Buka"
                append-icon="mdi-calendar"
                readonly
                outlined
                dense
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>

            <v-date-picker
              v-model="form.outlet_open"
              type="month"
              no-title
              scrollable
              @input="menu = false"
            >
            </v-date-picker>
          </v-menu>

          <v-autocomplete
            v-model="form.outlet_status"
            label="Status"
            :items="status"
            outlined
            dense
            hide-selected
            :rules="formRules"
          ></v-autocomplete>
        </v-form>

        <list-address-dtl ref="dialog" />

        <v-btn
          block
          color="primary"
          :loading="loading"
          :disabled="!valid"
          @click="update"
        >
          <v-icon left>mdi-content-save</v-icon>
          Update
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "EditOutlet",
  props: {
    id: {
      required: true,
      type: String,
    },
  },
  components: {
    AppBar: () =>
      import(/* webpackChunkName: "alert" */ "@/components/AppBar.vue"),
    ListAddressDtl: () =>
      import(
        /* webpackChunkName: "list-address-dtl" */ "@/components/ListAddressDtl.vue"
      ),
  },
  data: () => ({
    valid: true,
    form: {},
    formRules: [(v) => !!v || "Field is required"],
    branches: [],
    menu: false,
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
    async getBranch() {
      await this.axios
        .get("network/v1/branch", {
          headers: {
            Authorization: "Bearer " + this.access_token,
          },
          params: {
            status: "ACTIVE",
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.branches = data;
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
    async getMaster() {
      await this.axios
        .get("network/v1/outlet/" + this.id, {
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
    open() {
      this.$refs.dialog.open();
    },
    select(item) {
      this.form.zipcode_id = item.id;
      this.form.kelurahan = item.kelurahan;
      this.form.kecamatan = item.kecamatan;
      this.form.kabupaten = item.kabupaten;
      this.form.provinsi = item.provinsi;
      this.form.kodepos = item.kodepos;
    },
    async update() {
      this.loading = true;

      let formData = new FormData();
      formData.set("branch_id", this.form.branch_id);
      formData.set("outlet_code", this.form.outlet_code);
      formData.set("outlet_name", this.form.outlet_name.toUpperCase());
      formData.set("outlet_address", this.form.outlet_address);
      formData.set("zipcode_id", this.form.zipcode_id);
      formData.set("outlet_open", this.form.outlet_open);
      formData.set("outlet_status", this.form.outlet_status);

      await this.axios
        .post("network/v1/update-outlet/" + this.id, formData, {
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
    await this.getBranch();
    await this.getMaster();
  },
  mounted() {
    this.$root.$on("select", this.select);
  },
};
</script>

<style>
</style>