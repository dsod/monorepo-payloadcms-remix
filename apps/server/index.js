const path = require('path');
const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const { createRequestHandler } = require('@remix-run/express');
const payload = require('payload');
const { dotenv } = require('shared');
dotenv.config();

let BUILD_DIR;
if (process.env.NODE_ENV === 'development') {
    BUILD_DIR = path.resolve(__dirname, '../web/build');
} else {
    BUILD_DIR = path.join(process.cwd(), 'build/web');
}
const MONGODB_USER = process.env.MONGODB_USER;
const MONGODB_DATABASE = process.env.MONGODB_DATABASE;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
const MONGODB_SERVER = process.env.MONGODB_SERVER;
const PAYLOADCMS_SECRET = process.env.PAYLOADCMS_SECRET;

const app = express();

payload.init({
    express: app,
    mongoURL: `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_SERVER}/${MONGODB_DATABASE}?retryWrites=true&w=majority`,
    secret: PAYLOADCMS_SECRET,
});

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable('x-powered-by');

// Remix fingerprints its assets so we can cache forever.
app.use(
    '/build',
    express.static('public/build', { immutable: true, maxAge: '1y' })
);

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static('public', { maxAge: '1h' }));

app.use(morgan('tiny'));

app.all(
    '*',
    process.env.NODE_ENV === 'development'
        ? (req, res, next) => {
              purgeRequireCache();

              return createRequestHandler({
                  build: require(BUILD_DIR),
                  mode: process.env.NODE_ENV,
                  getLoadContext(req, res) {
                      return {
                          payload: req.payload ?? {},
                          user: req.user ?? {},
                      };
                  },
              })(req, res, next);
          }
        : createRequestHandler({
              build: require(BUILD_DIR),
              mode: process.env.NODE_ENV,
              getLoadContext(req, res) {
                  return { payload: req.payload ?? {}, user: req.user ?? {} };
              },
          })
);
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
});

function purgeRequireCache() {
    // purge require cache on requests for "server side HMR" this won't let
    // you have in-memory objects between requests in development,
    // alternatively you can set up nodemon/pm2-dev to restart the server on
    // file changes, but then you'll have to reconnect to databases/etc on each
    // change. We prefer the DX of this, so we've included it for you by default
    for (let key in require.cache) {
        if (key.startsWith(BUILD_DIR)) {
            delete require.cache[key];
        }
    }
}
