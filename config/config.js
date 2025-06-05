module.exports = {
  "development": {
    "username": "root",
    "password": "4lf483t0",
    "database": "sclick",
    "host": "172.17.0.2",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": "alfabeto",
    "database": "sclick",
    "host": "172.17.0.2",
    "dialect": "mysql"
  },
  "production": {
    "use_env_variable": "DATABASE_URL",
    "dialect": "mysql",
    "dialectOptions": {
      "ssl": {
        "require": true,
        "rejectUnauthorized": false
      }
    }
  }
}
