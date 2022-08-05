<template>
  <v-dialog v-model="dialog" width="700">
    <v-card>
      <v-toolbar color="primary" dark flat>
        <v-toolbar-title>List of Value</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-data-table
        :headers="headers"
        :items="masters"
        dense
        :items-per-page="10"
        hide-default-footer
      >
        <template v-slot:body.prepend>
          <tr>
            <td>
              <v-text-field
                v-model="search.kelurahan"
                outlined
                dense
                single-line
                hide-details
                @keyup.enter="getMaster"
              ></v-text-field>
            </td>

            <td>
              <v-text-field
                v-model="search.kecamatan"
                outlined
                dense
                single-line
                hide-details
                @keyup.enter="getMaster"
              ></v-text-field>
            </td>

            <td>
              <v-text-field
                v-model="search.kabupaten"
                outlined
                dense
                single-line
                hide-details
                @keyup.enter="getMaster"
              ></v-text-field>
            </td>

            <td>
              <v-text-field
                v-model="search.provinsi"
                outlined
                dense
                single-line
                hide-details
                @keyup.enter="getMaster"
              ></v-text-field>
            </td>

            <td>
              <v-text-field
                v-model="search.kodepos"
                outlined
                dense
                single-line
                hide-details
                @keyup.enter="getMaster"
              ></v-text-field>
            </td>
          </tr>
        </template>

        <template v-slot:item.action="{ item }">
          <v-icon small @click="doAction(item)">mdi-plus</v-icon>
        </template>
      </v-data-table>

      <br />

      <v-pagination
        v-model="page"
        :length="lengthPage"
        :total-visible="7"
        @input="getMaster"
      ></v-pagination>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "ListAddressDtl",
  data: () => ({
    headers: [
      { text: "Kelurahan", value: "kelurahan" },
      { text: "Kecamatan", value: "kecamatan" },
      { text: "Kabupaten", value: "kabupaten" },
      { text: "Provinsi", value: "provinsi" },
      { text: "Kode Pos", value: "kodepos" },
      { text: "Action", value: "action", sortable: false },
    ],
    masters: [],
    search: {
      kelurahan: "",
      kecamatan: "",
      kabupaten: "",
      provinsi: "",
      kodepos: "",
    },
    page: 1,
    lengthPage: 1,
    dialog: false,
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
    async getMaster() {
      if (this.search.length > 0) {
        this.page = 1;
      }

      await this.axios
        .get("network/v1/zipcode?page=" + this.page, {
          headers: {
            Authorization: "Bearer " + this.access_token,
          },
          params: {
            kelurahan: this.search.kelurahan,
            kecamatan: this.search.kecamatan,
            kabupaten: this.search.kabupaten,
            provinsi: this.search.provinsi,
            kodepos: this.search.kodepos,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.masters = data.data;
          this.page = data.current_page;
          this.lengthPage = data.last_page;
        });
    },
    open() {
      this.dialog = true;
    },
    close() {
      this.dialog = false;
    },
    doAction(item) {
      this.$root.$emit("select", item);
      this.dialog = false;
    },
  },
  async created() {
    await this.getMaster();
  },
};
</script>

<style>
</style>