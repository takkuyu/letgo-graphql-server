import knex from 'knex';

// Connect to Postgres db using knex.
const db = knex({
  client: "pg",
  connection: {
    host: "localhost",
    user: "takayahirose",
    password: "",
    database: "letgo"
  }
});

export default db;