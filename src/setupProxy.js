const proxy = require('http-proxy-middleware');

function splatnetOnProxyRes(proxyRes, req, res) {
  Object.keys(proxyRes.headers).forEach(function(key) {
    res.append(key, proxyRes.headers[key]);
  });
  res.append('x-cookie', proxyRes.headers['set-cookie']);
}

function splatnetOnProxyReq(proxyReq, req, res) {
  if (req.headers['x-cookie'] !== undefined && req.headers['x-cookie'] !== null) {
    proxyReq.setHeader('cookie', req.headers['x-cookie']);
  }
}

module.exports = function(app) {
  app.use(
    '/splatoon2inkApi',
    proxy({
      target: 'https://splatoon2.ink',
      changeOrigin: true,
      pathRewrite: { '^/splatoon2inkApi': '' }
    })
  );
  app.use(
    '/splatnetApi',
    proxy({
      target: 'https://app.splatoon2.nintendo.net',
      changeOrigin: true,
      pathRewrite: { '^/splatnetApi': '' },
      onProxyRes: splatnetOnProxyRes,
      onProxyReq: splatnetOnProxyReq
    })
  );
  app.use(
    '/nintendoAccountsApi',
    proxy({
      target: 'https://accounts.nintendo.com',
      changeOrigin: true,
      pathRewrite: { '^/nintendoAccountsApi': '' }
    })
  );
  app.use(
    '/nintendoAccountsApiApi',
    proxy({
      target: 'https://api.accounts.nintendo.com',
      changeOrigin: true,
      pathRewrite: { '^/nintendoAccountsApiApi': '' }
    })
  );
  app.use(
    '/eliFesslerApi',
    proxy({
      target: 'https://elifessler.com',
      changeOrigin: true,
      pathRewrite: { '^/eliFesslerApi': '' },
      headers: { 'User-Agent': 'Takos/0.1.0' }
    })
  );
  app.use(
    '/flapgApi',
    proxy({
      target: 'https://flapg.com',
      changeOrigin: true,
      pathRewrite: { '^/flapgApi': '' }
    })
  );
  app.use(
    '/nintendoServiceApi',
    proxy({
      target: 'https://api-lp1.znc.srv.nintendo.net',
      changeOrigin: true,
      pathRewrite: { '^/nintendoServiceApi': '' }
    })
  );
};
