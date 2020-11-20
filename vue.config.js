module.exports = {
  baseUrl: './',
  devServer: {
    proxy: {
      '/api': {
        target: 'http://140.143.223.29:3000',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      },
      '/img': {
        target: 'http://127.0.0.1:80',
        changeOrigin: true
      }
    }
  }
};
