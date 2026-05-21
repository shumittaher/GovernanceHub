import bcrypt from "bcrypt";
import { insertUser } from "../dao/usersDao";

const BCRYPT_ROUNDS = 10;

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

export interface CreatedUser {
  id: number;
  tenant_id: number;
  name: string;
  email: string;
}

export async function createUser(
  tenantId: number,
  input: CreateUserInput
): Promise<CreatedUser> {
  const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

  const user = await insertUser(tenantId, input.name, input.email, passwordHash);

  return {
    id: user.id,
    tenant_id: user.tenant_id,
    name: user.name,
    email: user.email,
  };
}
