const koa = require('koa');
const app = koa();

app.use(function *() {
  this.body = 'hello world';
});

app.listen(3000);
