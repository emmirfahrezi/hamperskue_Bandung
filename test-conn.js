const { Pool } = require('pg');
require('dotenv').config();

async function test() {
  console.log('Testing 6543...');
  const pool6543 = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  try {
    const res = await pool6543.query('SELECT 1 as val');
    console.log('6543 Success:', res.rows);
  } catch (e) {
    console.error('6543 Error:', e.message);
  } finally {
    await pool6543.end();
  }

  console.log('\nTesting 5432...');
  const pool5432 = new Pool({
    connectionString: process.env.DIRECT_URL,
    ssl: { rejectUnauthorized: false }
  });
  try {
    const res = await pool5432.query('SELECT 1 as val');
    console.log('5432 Success:', res.rows);
  } catch (e) {
    console.error('5432 Error:', e.message);
  } finally {
    await pool5432.end();
  }
}

test();
