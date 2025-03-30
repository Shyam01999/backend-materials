require('dotenv').config()

module.exports = {
  "development": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": process.env.DB_DIALECT,
    "logging": false,
    // "ssl": process.env.DB_SSL,
    // "dialectOptions": {
    //   "ssl": {
    //     "require": process.env.DB_SSLREQUIRE,
    //     "rejectUnauthorized": process.env.DB_SSLREJECTUNAUTHORIZED,
    //   },
    // },
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": process.env.DB_DIALECT,
    // "logging": process.env.DB_LOGGING,
    // "ssl": process.env.DB_SSL,
    // "dialectOptions": {
    //   "ssl": {
    //     "require": process.env.DB_SSLREQUIRE,
    //     "rejectUnauthorized": process.env.DB_SSLREJECTUNAUTHORIZED,
    //   },
    // },
  }
}
