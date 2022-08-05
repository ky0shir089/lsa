<template>
  <div>
    <v-app-bar app color="primary" dark dense v-if="isHome || $vuetify.breakpoint.smAndUp">
      <v-app-bar-nav-icon @click.stop="toggle"></v-app-bar-nav-icon>

      <v-toolbar-title>
        <a href="/" class="white--text">{{ appName }}</a>
      </v-toolbar-title>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  name: 'AppBar',
  data: () => ({
    drawer: false,
  }),
  computed: {
    isHome() {
      return this.$route.path === "/";
    },
  },
  methods: {
    toggle() {
      this.$root.$children[0].drawer = !this.$root.$children[0].drawer
    },
  }
}
</script>

<style>
a:link {
  text-decoration: none;
}
</style>
