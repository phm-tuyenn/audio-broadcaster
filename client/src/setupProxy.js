const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports =  function(app) {
    app.use(createProxyMiddleware('http://127.0.0.1:9000/api',{changeOrigin: true})),
    app.use(createProxyMiddleware('http://127.0.0.1:8080/restart',{changeOrigin: true}))
}
