import {
  fetchAllTenants,
  insertTenant,
  deleteTenantById,
  type TenantRecord,
} from "../dao/tenantsDao";

export async function listTenants(): Promise<TenantRecord[]> {
  return fetchAllTenants();
}

export async function createTenant(name: string): Promise<TenantRecord> {
  return insertTenant(name);
}

export async function deleteTenant(id: number): Promise<boolean> {
  return deleteTenantById(id);
}
