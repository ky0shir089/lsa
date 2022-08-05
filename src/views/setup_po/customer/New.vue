<template>
  <v-container fluid>
    <app-bar />

    <v-app-bar app color="primary" v-if="$vuetify.breakpoint.xs">
      <v-btn icon dark @click.stop="$router.go(-1)">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <form-customer :form="form" />
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "NewCustomer",
  components: {
    AppBar: () => import(/* webpackChunkName: "alert" */ "@/components/AppBar.vue"),
    FormCustomer: () => import(/* webpackChunkName: "form-customer" */ "@/components/FormCustomer.vue"),
  },
  data: () => ({
    form: {
      cust_type: "",
      cust_ktp: "",
      cust_name: "",
      cust_address: "",
      provinsi: "",
      kabupaten: "",
      kecamatan: "",
      kelurahan: [],
      kodepos: "",
      cust_hp: "",
      cust_hp2: "",
    }
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
    async store() {
      this.loading = true

      let formData = new FormData();

      formData.set("cust_type", this.form.cust_type);
      formData.set("cust_ktp", this.form.cust_ktp);
      formData.set("cust_name", this.form.cust_name);
      formData.set("cust_address", this.form.cust_address);
      formData.set("cust_address_dtl", this.form.kelurahan.id);
      formData.set("cust_hp", this.form.cust_hp);
      formData.set("cust_hp2", this.form.cust_hp2);

      await this.axios
        .post("asset/v1/store-customer", formData, {
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
          this.$router.go(-1)
        })
    },
  }
}
</script>

<style>
</style>