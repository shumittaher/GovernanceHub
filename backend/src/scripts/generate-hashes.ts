import bcrypt from "bcrypt";

const PASSWORD = "Password123!";
const SALT_ROUNDS = 10;

async function generateHash() {
  try {
    const hash = await bcrypt.hash(PASSWORD, SALT_ROUNDS);
    console.log("Generated bcrypt hash for development:");
    console.log(`Password: ${PASSWORD}`);
    console.log(`Hash: ${hash}`);
  } catch (error) {
    console.error("Error generating hash:", error);
    process.exit(1);
  }
}

generateHash();
