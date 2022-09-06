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

    <v-row v-if="action">
      <v-col cols="6">
        <v-btn block color="primary" :loading="loading" @click="doApprove">
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

    <div v-if="signpad">
      <div class="d-flex justify-end mb-2">
        <v-btn color="pirmary" class="mx-2" @click="undo">
          <v-icon left>mdi-undo-variant</v-icon> Undo
        </v-btn>

        <v-btn color="pirmary" class="mx-2" @click="clear">
          <v-icon left>mdi-eraser</v-icon> Clear
        </v-btn>
      </div>

      <VueSignaturePad
        id="signature"
        width="100%"
        height="300px"
        ref="signaturePad"
      />

      <v-btn
        block
        color="primary"
        :loading="loading"
        class="mt-2"
        @click="approve_po"
      >
        <v-icon left>mdi-check-circle</v-icon>
        approve
      </v-btn>
    </div>

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
import Vue from "vue";
import VueSignaturePad from "vue-signature-pad";

Vue.use(VueSignaturePad);

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
    action: true,
    signpad: false,
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
    doApprove() {
      this.action = false;
      this.signpad = true;
    },
    async approve_po() {
      let r = confirm("Apakah anda yakin akan menyimpan data berikut?");

      if (r) {
        this.loading = true;

        let formData = new FormData();
        formData.set("id", this.id);
        formData.set("signature", this.$refs.signaturePad.saveSignature().data);

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
    undo() {
      this.$refs.signaturePad.undoSignature();
    },
    clear() {
      this.$refs.signaturePad.clearSignature();
    },
    save() {
      // const { isEmpty, data } = this.$refs.signaturePad.saveSignature();

      // alert("Open DevTools see the save data.");
      // console.log(isEmpty);
      // console.log(data);
      console.log(this.$refs.signaturePad.saveSignature().data);
    },
  },
  async created() {
    await this.getPo();
  },
};
</script>

<style>
#signature {
  border: double 3px transparent;
  border-radius: 5px;
  background-image: linear-gradient(white, white),
    radial-gradient(circle at top left, #4bc5e8, #9f6274);
  background-origin: border-box;
  background-clip: content-box, border-box;
}
</style>