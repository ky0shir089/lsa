<template>
  <v-container fluid>
    <app-bar />

    <v-app-bar app color="primary" v-if="$vuetify.breakpoint.xs">
      <v-btn icon dark @click.stop="$router.go(-1)">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <div class="text-h5 mb-4">{{ $route.name }}</div>

    <po-data :po="po" />

    <br />

    <v-btn
      block
      color="primary"
      :loading="loading"
      @click="cetak_po"
      v-if="po.po_status == 'APPROVE'"
    >
      <v-icon left>mdi-printer</v-icon>
      download pdf
    </v-btn>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "ViewPo",
  props: {
    id: {
      required: true,
      type: String,
    },
  },
  components: {
    AppBar: () =>
      import(/* webpackChunkName: "alert" */ "@/components/AppBar.vue"),
    PoData: () =>
      import(/* webpackChunkName: "view-po" */ "@/components/POData.vue"),
  },
  data: () => ({
    po: {},
    loading: false,
    valid: true,
    formRules: [(v) => !!v || "Field is required"],
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
    async getPo() {
      await this.axios
        .get("setup-po/v1/purchase-order/" + this.id, {
          headers: {
            Authorization: "Bearer " + this.access_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.po = data.data[0];
        });
    },
    async cetak_po() {
      this.loading = true;

      let formData = new FormData();
      formData.set("data", JSON.stringify(this.po));

      await this.axios
        .post("/setup-po/v1/cetak-po", formData, {
          responseType: "arraybuffer",
          headers: {
            Authorization: "Bearer " + this.access_token,
          },
        })
        .then((response) => {
          let blob = new Blob([response.data], { type: "application/pdf" });
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = this.po.po_number.replaceAll("/", "_") + ".pdf";
          link.click();
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
  async created() {
    await this.getPo();
  },
};
</script>

<style>
</style>