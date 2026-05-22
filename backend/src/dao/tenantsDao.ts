import { pool } from "../db";

export interface TenantRecord {
  id: number;
  name: string;
  created_at: Date;
}

export async function fetchAllTenants(): Promise<TenantRecord[]> {
  const result = await pool.query(
    `SELECT id, name, created_at FROM tenants ORDER BY created_at DESC`
  );
  return result.rows;
}

export async function insertTenant(name: string): Promise<TenantRecord> {
  const result = await pool.query(
    `INSERT INTO tenants (name) VALUES ($1) RETURNING id, name, created_at`,
    [name]
  );
  return result.rows[0];
}

export async function deleteTenantById(id: number): Promise<boolean> {
  const result = await pool.query(
    `DELETE FROM tenants WHERE id = $1`,
    [id]
  );
  return (result.rowCount ?? 0) > 0;
}
