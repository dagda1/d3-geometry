const env = process.env.NODE_ENV || 'development';
const config = {};

switch(env) {
case 'development':
  config.database = {
    host: '127.0.0.1',
    port: 5432,
    user: 'paulcowan',
    database: 'managers'
  };

  config.site = {
    port: 5000
  };
};

module.exports.config = config;
