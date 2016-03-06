const koa = require('koa');
const mount = require('koa-mount');
const serve = require('koa-static');
const logger = require('koa-logger');
const compress = require('koa-compress');
const cors = require('koa-cors');
const zlib = require('zlib');
const koaBody = require('koa-bodyparser');
const helmet = require('koa-helmet');
const config = require('./config.js').config;
const router = require('./routes/index');

const app = koa();

app.use(compress({
  filter: contentType => /text/i.test(contentType)
  , threshold: 2048
  , flush: zlib.Z_SYNC_FLUSH
}));

app.use(koaBody());
app.use(logger());
app.use(helmet());

app.use(mount('/api', cors()));

app.use(router.routes());

app.listen(config.site.port);

module.exports.app;
