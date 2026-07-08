import { DatabaseSync } from "node:sqlite";
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dbPath = join(root, "prisma", "dev.db");
const sqlPath = join(root, "prisma", "migrations", "000_init", "migration.sql");

mkdirSync(dirname(dbPath), { recursive: true });

const db = new DatabaseSync(dbPath);
const sql = readFileSync(sqlPath, "utf8");
db.exec(sql);
db.close();

console.log(`SQLite database initialized at ${dbPath}`);
