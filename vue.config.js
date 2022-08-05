const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],

  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = "LSA";
        return args;
      })

    config
      .output
      .filename('[name].[fullhash].bundle.js')
  },
})
