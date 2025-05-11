const {DefinePlugin, ProvidePlugin} = require('webpack')
const path = require('path')
const fs = require('fs')

if(process.env.NODE_ENV === 'development') {
//  process.env.VUE_APP_DEPLOYMENTS = fs.readFileSync('./src/contract-sdk/deployments/baobab.json').toString()
} else {
//  process.env.VUE_APP_DEPLOYMENTS = fs.readFileSync('./src/contract-sdk/deployments/cypress.json').toString()
}


module.exports = {
  devServer: {
    https: {
      key: fs.readFileSync('../../localhost+4-key.pem'),
      cert: fs.readFileSync('../../localhost+4.pem'),
    },
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "./src/assets/scss/_style";
          @import "~bootstrap/scss/bootstrap";
        `
      }
    }
  },
  configureWebpack: {

    plugins: [
      new ProvidePlugin({
        Buffer: ['buffer', 'Buffer']
      }),
    ],
    resolve: {
      alias: {
        "@deployments": path.join(__dirname, 'deployments/'),
        //'@/*':path.join(__dirname,'src/'),
      },
      extensions: ['.ts', '.js'],
      fallback: {
        "buffer": require.resolve('buffer')
      }
    }
  },
  chainWebpack: config => {
    config.resolve.symlinks(false)

  },
  transpileDependencies: [

  ],
}
