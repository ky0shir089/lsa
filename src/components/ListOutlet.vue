<template>
  <v-dialog v-model="dialog" width="600">
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
        <template v-slot:top>
          <v-text-field
            v-model="search"
            label="Search"
            outlined
            dense
            append-icon="mdi-magnify"
            single-line
            hide-details
            class="ma-2"
            @keyup.enter="getMaster"
          ></v-text-field>
        </template>

        <template v-slot:item.action="{ item }">
          <v-icon small @click="doAction(item)">mdi-plus</v-icon>
        </template>
      </v-data-table>

      <br />

      <v-pagination v-model="page" :length="lengthPage" :total-visible="7" @input="getMaster"></v-pagination>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "ListOutlet",
  data: () => ({
    headers: [
      { text: "Kode Titik", value: "outlet_id" },
      { text: "Nama Titik", value: "outlet_name" },
      { text: "Cabang", value: "branch_name" },
      { text: "Company", value: "company_code" },
      { text: "Action", value: "action", sortable: false },
    ],
    masters: [],
    search: "",
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
        this.page = 1
      }

      await this.axios
        .get("network/v1/outlet?page=" + this.page, {
          headers: {
            Authorization: "Bearer " + this.access_token,
          },
          params: {
            status: "Y",
            outlet_name: this.search,
            order: "id",
            sort: "asc",
          }
        })
        .then((response) => {
          let { data } = response.data;
          this.masters = data.data;
          this.page = data.current_page
          this.lengthPage = data.last_page
        })
    },
    open() {
      this.dialog = true
    },
    doAction(item) {
      this.$parent.selectOutlet(item)
      this.dialog = false
    },
  },
  async created() {
    await this.getMaster();
  },
}
</script>

<style>
</style>