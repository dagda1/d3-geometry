const env = process.env.NODE_ENV || 'development';
const config = {};

switch(env) {
case 'development':
  config.database = {
    host: '127.0.0.1',
    port: 3307,
    user: 'paulcowan',
    database: 'managers'
  };
};

module.exports.config = config;
