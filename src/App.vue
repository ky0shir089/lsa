<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense nav>
        <v-list-item>
          <v-list-item-avatar color="white">
            <v-icon large>mdi-account-circle</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ user.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item color="blue" to="/">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-group
          v-for="item in menus"
          :key="item.id"
          :prepend-icon="item.module_icon"
          no-action
          color="red"
          v-model="item.active"
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>{{ item.module_name }}</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="subItem in item.menus"
            :key="subItem.id"
            :to="subItem.menu_route"
            color="blue"
          >
            <v-list-item-content>
              <v-list-item-title>{{ subItem.menu_name }}</v-list-item-title>
            </v-list-item-content>

            <v-list-item-icon>
              <v-icon left>{{ subItem.menu_icon }}</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list-group>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn block color="red" dark @click="signOut">
            <v-icon left>mdi-lock</v-icon>Keluar
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <alert />

    <v-main>
      <v-slide-y-transition>
        <router-view />
      </v-slide-y-transition>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
// import OneSignal from "onesignal-vue";

export default {
  name: "App",
  components: {
    Alert: () =>
      import(/* webpackChunkName: "alert" */ "@/components/Alert.vue"),
  },
  data: () => ({
    drawer: false,
    menus: [],
    onesignal_id: "",
  }),
  computed: {
    ...mapGetters({
      user: "auth/user",
      guest: "auth/guest",
      access_token: "token/token",
      nav: "nav/nav",
    }),
  },
  methods: {
    ...mapActions({
      setAlert: "alert/set",
      setAuth: "auth/set",
      setToken: "token/set",
      setNav: "nav/set",
    }),
    async navDrawer() {
      await this.axios
        .get("setup-aplikasi/v1/navigation", {
          headers: {
            Authorization: "Bearer " + this.access_token,
          },
          params: {
            user_id: this.user.id,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.menus = data;
          if (this.$route.name != "NotFound") {
            this.drawer = true;
          }
        });
    },
    oneSignal() {
      this.$OneSignal.on("subscriptionChange", function (isSubscribed) {
        console.log("The user's subscription state is now:", isSubscribed);
      });

      this.$OneSignal.getUserId().then((userId) => {
        console.log("OneSignal User ID:", userId);
        this.onesignal_id = userId;
      });
    },
    signOut() {
      let r = confirm("Apakah anda yakin akan keluar?");

      if (r == true) {
        this.drawer = false;
        this.setAuth({});
        this.setToken("");
        this.setAlert({
          status: true,
          color: "success",
          text: "Logout successfully",
        });
        this.$router.push("/login");
      }
    },
  },
  beforeCreate() {
    this.$OneSignal.showSlidedownPrompt();
  },
  async created() {
    this.oneSignal();

    if (!this.guest && this.user.chpass == "NO") {
      await this.navDrawer();

      let nav = [];
      this.menus.forEach((item) => {
        item.menus.forEach((subItem) => {
          nav.push(subItem.id);
        });
      });
      this.setNav(nav);
    }
  },
};
</script>