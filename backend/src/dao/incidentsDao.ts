import { pool } from "../db";

export async function fetchIncidents() {
  const result = await pool.query(
    `SELECT * FROM incidents ORDER BY created_at DESC`
  );
  return result.rows;
}
