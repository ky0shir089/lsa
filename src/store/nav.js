export default {
  namespaced: true,
  state: {
    nav: [],
  },
  mutations: {
    set: (state, payload) => {
      state.nav = payload
    },
  },
  actions: {
    set: ({ commit }, payload) => {
      commit('set', payload)
    },
  },
  getters: {
    nav: state => state.nav,
  }
}