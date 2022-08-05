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
                v-model="form.component_date"
                label="Tanggal"
                outlined
                dense
                append-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                :rules="formRules"
              ></v-text-field>
            </template>

            <v-date-picker
              v-model="form.component_date"
              @input="menu = false"
            ></v-date-picker>
          </v-menu>

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
            @change="getBrandComponent"
          ></v-autocomplete>

          <v-autocomplete
            v-model="form.brand_component_id"
            label="Brand"
            :items="brands"
            item-text="brand_component_name"
            item-value="id"
            outlined
            dense
            hide-selected
            :rules="formRules"
          ></v-autocomplete>

          <v-text-field
            v-model="form.component_type"
            label="Type"
            outlined
            dense
            :rules="formRules"
          ></v-text-field>

          <v-text-field
            v-model.lazy="form.component_price"
            label="Harga"
            v-money="money"
            ref="component_price"
            outlined
            dense
            :rules="formRules"
          ></v-text-field>

          <v-autocomplete
            v-model="form.room_id"
            :items="rooms"
            item-text="room_name"
            item-value="id"
            label="Lokasi"
            outlined
            dense
            hide-selected
            hide-details
            :rules="formRules"
          >
            <template v-slot:selection="data">
              {{ data.item.outlet_name }} -
              {{ data.item.room_name }}
            </template>

            <template v-slot:item="data">
              {{ data.item.outlet_name }} -
              {{ data.item.room_name }}
            </template>
          </v-autocomplete>
        </v-form>

        <br />

        <v-btn
          block
          color="primary"
          :loading="loading"
          :disabled="!valid"
          @click="buy"
        >
          <v-icon left>mdi-content-save</v-icon>
          Simpan
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { VMoney } from "v-money";

export default {
  name: "BuyComponent",
  directives: { money: VMoney },
  components: {
    AppBar: () =>
      import(/* webpackChunkName: "alert" */ "@/components/AppBar.vue"),
  },
  data: () => ({
    valid: true,
    form: {
      component_date: "",
      component_id: "",
      brand_component_id: "",
      component_type: "",
      component_price: "",
      room_id: "",
    },
    formRules: [(v) => !!v || "Field is required"],
    menu: false,
    components: [],
    brands: [],
    rooms: [],
    money: {
      precision: 0,
      masked: false,
    },
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
    async getBrandComponent() {
      await this.axios
        .get("setup-asset/v1/brand-component", {
          headers: {
            Authorization: "Bearer " + this.access_token,
          },
          params: {
            component_id: this.form.component_id,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.brands = data;
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
    async getRoom() {
      await this.axios
        .get("network/v1/room", {
          headers: {
            Authorization: "Bearer " + this.access_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.rooms = data;
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
    async buy() {
      let r = window.confirm("apakah anda yakin?");

      if (r) {
        this.loading = true;

        let formData = new FormData();
        formData.set("component_date", this.form.component_date);
        formData.set("component_id", this.form.component_id);
        formData.set("brand_component_id", this.form.brand_component_id);
        formData.set("component_type", this.form.component_type);
        formData.set(
          "component_price",
          this.form.component_price.replaceAll(",", "")
        );
        formData.set("room_id", this.form.room_id);
        formData.set("component_status", "LAYAK PAKAI");

        await this.axios
          .post("list-asset/v1/buy-component", formData, {
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
      }
    },
  },
  async created() {
    await this.getComponent();
    await this.getRoom();
  },
};
</script>

<style>
</style>