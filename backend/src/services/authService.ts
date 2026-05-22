import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail } from "../dao/usersDao";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET environment variable");
}

export async function loginUser(email: string, password: string) {
  const user = await findUserByEmail(email);

  if (!user) {
    return null;
  }

  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  if (!isValidPassword) {
    return null;
  }

  const token = jwt.sign(
    {
      userId: user.id,
      tenantId: user.tenant_id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET as string,
    {
      expiresIn: "1h",
    }
  );

  return {
    token,
    user: {
      id: user.id,
      tenant_id: user.tenant_id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}
