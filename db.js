const mysql = require('mysql2/promise');
const config = require('./config');

// Create connection pool
const pool = mysql.createPool(config.db);

// Helper function to get database connection
async function getDBConnection() {
  try {
    const connection = await pool.getConnection();
    return connection;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}

// Helper function to execute query
async function query(sql, params = []) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Helper function to execute query with connection (for transactions)
async function queryWithConnection(connection, sql, params = []) {
  try {
    const [results] = await connection.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

module.exports = {
  pool,
  getDBConnection,
  query,
  queryWithConnection
};

