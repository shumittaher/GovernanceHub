import bcrypt from "bcrypt";
import {
  fetchAllAdmins,
  insertAdmin,
  deleteAdminById,
  type AdminRecord,
} from "../dao/superadminDao";
import { getTenantById } from "../dao/tenantsDao";

const BCRYPT_ROUNDS = 10;

export async function listAdmins(): Promise<AdminRecord[]> {
  return fetchAllAdmins();
}

export async function createAdmin(
  tenantId: number,
  name: string,
  email: string,
  password: string
): Promise<AdminRecord> {
  const tenant = await getTenantById(tenantId);
  if (!tenant) {
    throw new Error("Tenant not found");
  }
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  return insertAdmin(tenantId, name, email, passwordHash);
}

export async function deleteAdmin(id: number): Promise<boolean> {
  return deleteAdminById(id);
}
