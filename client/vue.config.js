const Dotenv = require('dotenv-webpack');
const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new Dotenv({
        systemvars: true
      })
    ]
  },
  chainWebpack: config => {
    console.log('Webpack config:', config.toString());
  }
});
