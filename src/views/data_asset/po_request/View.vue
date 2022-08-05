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

    <v-row>
      <v-col cols="6">
        <v-btn block color="primary" :loading="loading" @click="approve_po">
          <v-icon left>mdi-check-circle</v-icon>
          approve
        </v-btn>
      </v-col>

      <v-col cols="6">
        <v-btn block color="error" :loading="loading" @click="dialog = true">
          <v-icon left>mdi-close-circle</v-icon>
          reject
        </v-btn>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" width="300">
      <v-card>
        <v-container fluid>
          <v-form v-model="valid">
            <v-textarea
              v-model="po_reject_reason"
              label="Alasan Reject"
              outlined
              dense
              auto-grow
              :rules="formRules"
            >
            </v-textarea>
          </v-form>
        </v-container>

        <v-card-actions>
          <v-btn
            block
            color="error"
            :loading="loading"
            :disabled="!valid"
            @click="reject_po"
          >
            <v-icon left>mdi-content-save</v-icon>
            Reject
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    dialog: false,
    valid: true,
    po_reject_reason: "",
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
    async approve_po() {
      let r = confirm("Apakah anda yakin akan menyimpan data berikut?");

      if (r) {
        this.loading = true;

        let formData = new FormData();
        formData.set("id", this.id);

        await this.axios
          .post("setup-po/v1/approve-po", formData, {
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
    async reject_po() {
      let r = confirm("Apakah anda yakin akan menyimpan data berikut?");

      if (r) {
        this.loading = true;

        let formData = new FormData();
        formData.set("id", this.id);
        formData.set("po_reject_reason", this.po_reject_reason);

        await this.axios
          .post("setup-po/v1/reject-po", formData, {
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
    await this.getPo();
  },
};
</script>

<style>
</style>