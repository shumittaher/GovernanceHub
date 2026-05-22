import { pool } from "../db";

export interface AdminRecord {
  id: number;
  tenant_id: number;
  tenant_name: string;
  name: string;
  email: string;
  role: string;
  created_at: Date;
}

export async function fetchAllAdmins(): Promise<AdminRecord[]> {
  const result = await pool.query(
    `SELECT u.id, u.tenant_id, t.name AS tenant_name, u.name, u.email, u.role, u.created_at
     FROM users u
     JOIN tenants t ON t.id = u.tenant_id
     WHERE u.role = 'admin'
     ORDER BY u.created_at DESC`
  );
  return result.rows;
}

export async function insertAdmin(
  tenantId: number,
  name: string,
  email: string,
  passwordHash: string
): Promise<AdminRecord> {
  const result = await pool.query(
    `INSERT INTO users (tenant_id, name, email, password_hash, role)
     VALUES ($1, $2, $3, $4, 'admin')
     RETURNING id, tenant_id, name, email, role, created_at`,
    [tenantId, name, email, passwordHash]
  );

  const row = result.rows[0];

  const tenantResult = await pool.query(
    `SELECT name FROM tenants WHERE id = $1`,
    [tenantId]
  );

  return { ...row, tenant_name: tenantResult.rows[0]?.name ?? "" };
}

export async function deleteAdminById(id: number): Promise<boolean> {
  const result = await pool.query(
    `DELETE FROM users WHERE id = $1 AND role = 'admin'`,
    [id]
  );
  return (result.rowCount ?? 0) > 0;
}
