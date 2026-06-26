import Database, { type Database as DatabaseInstance } from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

export interface EmailEntry {
  id: number;
  email: string;
  created_at: string;
  source: string | null;
}

export interface WaitlistStore {
  init(): void;
  insertEmail(email: string, source: string): number | null;
  getAllEmails(): EmailEntry[];
}

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS waitlist_emails (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    email      TEXT    NOT NULL UNIQUE,
    created_at TEXT    NOT NULL,
    source     TEXT
  );
`;

function resolveDbPath(): string {
  const configured = process.env.WAITLIST_DB_PATH?.trim();
  if (configured) return configured;
  return path.join(process.cwd(), "waitlist.db");
}

type InsertStmt = Database.Statement<[string, string, string]>;
type SelectAllStmt = Database.Statement<[], EmailEntry>;

function createStore(db: DatabaseInstance): WaitlistStore {
  let insertStmt: InsertStmt | null = null;
  let selectAllStmt: SelectAllStmt | null = null;

  function getInsertStmt() {
    if (!insertStmt) {
      insertStmt = db.prepare(
        "INSERT OR IGNORE INTO waitlist_emails (email, created_at, source) VALUES (?, ?, ?)",
      );
    }
    return insertStmt;
  }

  function getSelectAllStmt(): SelectAllStmt {
    if (!selectAllStmt) {
      selectAllStmt = db.prepare<[], EmailEntry>(
        "SELECT id, email, created_at, source FROM waitlist_emails ORDER BY created_at ASC, id ASC",
      );
    }
    return selectAllStmt;
  }

  return {
    init(): void {
      db.exec(SCHEMA);
    },
    insertEmail(email: string, source: string): number | null {
      const result = getInsertStmt().run(
        email,
        new Date().toISOString(),
        source,
      );
      if (result.changes === 0) return null;
      return Number(result.lastInsertRowid);
    },
    getAllEmails(): EmailEntry[] {
      return getSelectAllStmt().all();
    },
  };
}

let cachedDb: DatabaseInstance | null = null;
let cachedStore: WaitlistStore | null = null;

export function getDb(): WaitlistStore {
  if (cachedStore) return cachedStore;
  const dbPath = resolveDbPath();
  const dir = path.dirname(dbPath);
  if (dir && dir !== process.cwd() && !fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  cachedDb = new Database(dbPath);
  const store = createStore(cachedDb);
  store.init();
  cachedStore = store;
  return cachedStore;
}

export function resetDbForTesting(): void {
  if (cachedDb) {
    cachedDb.close();
  }
  cachedDb = null;
  cachedStore = null;
}

export { createStore };
