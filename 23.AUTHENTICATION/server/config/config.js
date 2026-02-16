import dotenv from 'dotenv';
dotenv.config({quiet: true});

const config = {
  development: {
    username: process.env.LOCAL_DB_USERNAME,
    password: process.env.LOCAL_DB_PASSWORD,
    database: process.env.LOCAL_DB_NAME,
    host: process.env.LOCAL_DB_HOST,
    dialect: process.env.LOCAL_DB_DIALECT,
    logging: false,
    // "ssl": process.env.LOCAL_DB_SSL,
    // "dialectOptions": {
    //   "ssl": {
    //     "require": process.env.LOCAL_DB_SSLREQUIRE,
    //     "rejectUnauthorized": process.env.LOCAL_DB_SSLREJECTUNAUTHORIZED,
    //   },
    // },
  },

  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
    logging: false,
  },

  production: {
    username: process.env.PRODUCTION_DB_USERNAME,
    password: process.env.PRODUCTION_DB_PASSWORD,
    database: process.env.PRODUCTION_DB_NAME,
    host: process.env.PRODUCTION_DB_HOST,
    dialect: process.env.PRODUCTION_DB_DIALECT,
    logging: false,
    // "logging": process.env.PRODUCTION_DB_LOGGING,
    // "ssl": process.env.PRODUCTION_DB_SSL,
    // "dialectOptions": {
    //   "ssl": {
    //     "require": process.env.PRODUCTION_DB_SSLREQUIRE,
    //     "rejectUnauthorized": process.env.PRODUCTION_DB_SSLREJECTUNAUTHORIZED,
    //   },
    // },
  },
};

export default config;