<template>
  <v-container fluid>
    <app-bar />

    <v-app-bar app color="primary" v-if="$vuetify.breakpoint.xs">
      <v-btn icon dark @click.stop="$router.go(-1)">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <v-stepper v-model="e1">
      <v-stepper-header>
        <v-stepper-step :complete="e1 > 1" step="1">Pilih Kategori</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="e1 > 2" step="2">Tambah Asset</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="e1 > 3" step="3">Tambah Spesifikasi</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step step="4">Summary</v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <pilih-kategori :formData="request" />
        </v-stepper-content>

        <v-stepper-content step="2">
          <tambah-asset :formData="request" />
        </v-stepper-content>

        <v-stepper-content step="3">
          <tambah-spesifikasi :formData="request" />
        </v-stepper-content>

        <v-stepper-content step="4">
          <v-simple-table>
            <template v-slot:default>
              <tbody>
                <tr>
                  <td>Kategori</td>
                  <td>{{ request.category.asset_id }} - {{ request.category.asset_name }}</td>
                </tr>

                <tr>
                  <td>Asset</td>
                  <td>
                    <v-simple-table dense>
                      <template v-slot:default>
                        <tbody>
                          <tr>
                            <td>Kode Asset</td>
                            <td>{{ request.asset_code }}</td>
                          </tr>

                          <tr>
                            <td>Sub Kode</td>
                            <td>{{ request.asset_sub_code }}</td>
                          </tr>

                          <tr>
                            <td>Nama Asset</td>
                            <td>{{ request.asset_dtl_name }}</td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </td>
                </tr>

                <tr>
                  <td>Spesifikasi</td>
                  <td>
                    <ul v-for="(item, index) in request.spec" :key="index">
                      <li>{{ item.spec_dtl_name }}</li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>

          <br />

          <div class="d-flex justify-space-between">
            <v-btn color="secondary" @click="back">Kembali</v-btn>

            <v-btn color="primary" :loading="loading" @click="store">Simpan</v-btn>
          </div>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "NewAsset",
  components: {
    AppBar: () => import(/* webpackChunkName: "alert" */ "@/components/AppBar.vue"),
    PilihKategori: () => import(/* webpackChunkName: "pilih-kategori" */ "@/components/PilihKategori.vue"),
    TambahAsset: () => import(/* webpackChunkName: "tambah-asset" */ "@/components/TambahAsset.vue"),
    TambahSpesifikasi: () => import(/* webpackChunkName: "tambah-spesifikasi" */ "@/components/TambahSpesifikasi.vue"),
  },
  data: () => ({
    e1: 1,
    request: {
      category: "",
      asset_code: "",
      asset_sub_code: "",
      asset_dtl_name: "",
      spec: [],
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
    next() {
      this.e1 += 1
    },
    back() {
      this.e1 -= 1
    },
    async store() {
      this.loading = true

      let formData = new FormData();

      formData.set("asset_code", this.request.asset_code);
      formData.set("asset_sub_code", this.request.asset_sub_code);
      formData.set("asset_dtl_name", this.request.asset_dtl_name.toUpperCase());
      formData.set("asset_id", this.request.category.asset_id);

      await this.axios
        .post("asset/v1/store-asset-dtl", formData, {
          headers: {
            Authorization: "Bearer " + this.access_token,
          },
        })
        .then((response) => {
          let { data } = response;
          this.store2(data.data.id)
        })
    },
    async store2(id) {
      let formData = new FormData();

      formData.set("asset_id", id);
      formData.set("specs", JSON.stringify(this.request.spec));

      await this.axios
        .post("asset/v1/store-asset-spec", formData, {
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
          this.loading = false
          this.$router.go(-1)
        })
    },
  },
  mounted() {
    this.$root.$on('next', this.next)
    this.$root.$on('back', this.back)
  },
}
</script>

<style>
</style>