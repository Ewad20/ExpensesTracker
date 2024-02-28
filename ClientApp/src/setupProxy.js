const { createProxyMiddleware } = require('http-proxy-middleware');
const { env } = require('process');

let target;

if (env.DOCKER_HOST || env.DOCKER_CONTAINER_ID) {
  target = 'https://backend:7088';
} else {
  target = 'http://localhost:5007';
}

const context = [
  "/api/**",
];

const onError = (err, req, resp, target) => {
  console.error(`${err.message}`);
}

module.exports = function (app) {
  const appProxy = createProxyMiddleware(context, {
    proxyTimeout: 10000,
    target: target,
    onError: onError,
    secure: false,
    headers: {
      Connection: 'Keep-Alive'
    }
  });

  app.use(appProxy);
};
