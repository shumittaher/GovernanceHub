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
