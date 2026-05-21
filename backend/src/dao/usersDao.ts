import { pool } from "../db";

export interface UserRecord {
  id: number;
  tenant_id: number;
  name: string;
  email: string;
  password_hash: string;
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const result = await pool.query(
    `SELECT id, tenant_id, name, email, password_hash FROM users WHERE email = $1 LIMIT 1`,
    [email]
  );

  return result.rows[0] ?? null;
}

export async function insertUser(
  tenantId: number,
  name: string,
  email: string,
  passwordHash: string
): Promise<UserRecord> {
  const result = await pool.query(
    `INSERT INTO users (tenant_id, name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, tenant_id, name, email, password_hash`,
    [tenantId, name, email, passwordHash]
  );

  return result.rows[0];
}
