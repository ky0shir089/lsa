<template>
  <v-card flat>
    <v-card-title>List Informasi</v-card-title>

    <div v-if="unit.other_infos.length == 0">
      <v-container fluid>
        <v-form v-model="valid">
          <v-simple-table dense>
            <template v-slot:default>
              <thead>
                <tr>
                  <th>Spesifikasi</th>
                  <th>Detail</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(item, index) in otherInfos" :key="item.id">
                  <td>
                    {{ item.info_name }}
                  </td>

                  <td>
                    <v-text-field
                      v-model="form[index].info_detail"
                      outlined
                      dense
                      :rules="formRules"
                    ></v-text-field>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-form>
      </v-container>

      <v-card-actions>
        <v-btn
          block
          color="primary"
          :loading="loading"
          :disabled="!valid"
          @click="store"
          v-if="otherInfos.length > 0"
        >
          <v-icon left>mdi-content-save</v-icon>
          save
        </v-btn>
      </v-card-actions>
    </div>

    <div v-else>
      <v-simple-table dense>
        <template v-slot:default>
          <thead>
            <tr>
              <th>Spesifikasi</th>
              <th>Detail</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item in unit.other_infos" :key="item.id">
              <td>
                {{ item.info_name }}
              </td>

              <td>
                {{ item.info_detail }}
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </div>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "FormOtherInfo",
  props: ["unit"],
  data: () => ({
    valid: true,
    form: [],
    formRules: [(v) => !!v || "Field is required"],
    otherInfos: [],
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
    async getOtherInfo() {
      await this.axios
        .get("setup-asset/v1/other-info", {
          headers: {
            Authorization: "Bearer " + this.access_token,
          },
          params: {
            unit_id: this.unit.unit_id,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.otherInfos = data;
          this.otherInfos.forEach((item) => {
            this.form.push({
              info_id: item.id,
              info_detail: "",
            });
          });
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
      let r = window.confirm("apakah anda yakin?");

      if (r) {
        this.loading = true;

        let formData = new FormData();
        formData.set("unit_id", this.unit.id);
        formData.set("items", JSON.stringify(this.form));

        await this.axios
          .post("list-asset/v1/store-other-info", formData, {
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
            this.$parent.getMaster();
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
    if (this.unit.other_infos.length == 0) {
      await this.getOtherInfo();
    }
  },
};
</script>

<style>
</style>