module.exports = {
  pluginOptions: {
    electronBuilder: {
      appId: 'com.marvinzeising.houston',
      productName: 'Houston',
      outputDir: 'dist',
    },
  },
  configureWebpack: {
    devtool: 'source-map',
  },
}
