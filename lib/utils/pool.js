const { Pool } = require('pg');
const dblog = require('./dblog.js');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSLMODE && { rejectUnauthorized: false },
});

// eslint-disable-next-line no-console
pool.on('connect', () => dblog('🐘 Postgres connected'));

module.exports = pool;
