export default {
  namespaced: true,
  state: {
    token: "",
  },
  mutations: {
    set: (state, payload) => {
      state.token = payload
    },
  },
  actions: {
    set: ({ commit }, payload) => {
      commit('set', payload)
    },
  },
  getters: {
    token: state => state.token,
  }
}