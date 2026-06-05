import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "./index";
import { users } from "./schema";

async function main() {
    const hashedPassword = await bcrypt.hash("changeme123", 12);

    await db
        .insert(users)
        .values({
            email: "admin@yourclub.com",
            name: "Admin",
            password: hashedPassword,
            role: "admin"
        })
        .onConflictDoNothing();

    console.log("Admin user seeded — change the password after first login!");
    process.exit(0);
}

main();
