import { afterEach, beforeEach, describe, expect, it } from "vitest";
import fc from "fast-check";
import Database from "better-sqlite3";
import { createStore, type EmailEntry, type WaitlistStore } from "@/lib/db/waitlist";

function makeStore(): { store: WaitlistStore; close: () => void } {
  const db = new Database(":memory:");
  const store = createStore(db);
  store.init();
  return { store, close: () => db.close() };
}

describe("SQLite_Store", () => {
  describe("init", () => {
    // Feature: waitlist-sqlite-storage, Property 1: init idempotency
    it("is idempotent for any call count >= 1", () => {
      fc.assert(
        fc.property(fc.integer({ min: 2, max: 10 }), (n) => {
          const db = new Database(":memory:");
          const store = createStore(db);
          for (let i = 0; i < n; i++) store.init();
          const cols = db
            .prepare("PRAGMA table_info('waitlist_emails')")
            .all() as Array<{ name: string }>;
          expect(cols.map((c) => c.name)).toEqual(
            expect.arrayContaining(["id", "email", "created_at", "source"]),
          );
          db.close();
        }),
        { numRuns: 100 },
      );
    });

    it("creates the waitlist_emails schema on a fresh DB", () => {
      const db = new Database(":memory:");
      const store = createStore(db);
      store.init();
      const cols = db
        .prepare("PRAGMA table_info('waitlist_emails')")
        .all() as Array<{ name: string; type: string; notnull: number; pk: number }>;
      const byName = Object.fromEntries(cols.map((c) => [c.name, c]));
      expect(byName.id.type).toBe("INTEGER");
      expect(byName.id.pk).toBe(1);
      expect(byName.email.type).toBe("TEXT");
      expect(byName.email.notnull).toBe(1);
      expect(byName.created_at.type).toBe("TEXT");
      expect(byName.created_at.notnull).toBe(1);
      expect(byName.source.type).toBe("TEXT");
      db.close();
    });

    it("preserves existing rows on re-init", () => {
      const db = new Database(":memory:");
      const store = createStore(db);
      store.init();
      store.insertEmail("a@example.com", "test");
      store.init();
      const rows = store.getAllEmails();
      expect(rows).toHaveLength(1);
      expect(rows[0].email).toBe("a@example.com");
      db.close();
    });
  });

  describe("insertEmail", () => {
    let store: WaitlistStore;
    let close: () => void;

    beforeEach(() => {
      const ctx = makeStore();
      store = ctx.store;
      close = ctx.close;
    });

    afterEach(() => close());

    // Feature: waitlist-sqlite-storage, Property 2: insert round-trip
    it("inserted email is retrievable with correct fields", () => {
      fc.assert(
        fc.property(
          fc.emailAddress(),
          fc.string({ minLength: 1, maxLength: 32 }),
          (email, source) => {
            const ctx = makeStore();
            try {
              const normalized = email.toLowerCase().trim();
              ctx.store.insertEmail(normalized, source);
              const rows = ctx.store.getAllEmails();
              const found = rows.find((r) => r.email === normalized);
              expect(found).toBeDefined();
              expect(found?.source).toBe(source);
              expect(found?.created_at).toMatch(
                /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
              );
              expect(typeof found?.id).toBe("number");
            } finally {
              ctx.close();
            }
          },
        ),
        { numRuns: 100 },
      );
    });

    // Feature: waitlist-sqlite-storage, Property 3: duplicate insert idempotency
    it("inserting the same email N times results in exactly 1 record", () => {
      fc.assert(
        fc.property(
          fc.emailAddress(),
          fc.integer({ min: 2, max: 10 }),
          (email, n) => {
            const ctx = makeStore();
            try {
              const normalized = email.toLowerCase().trim();
              for (let i = 0; i < n; i++) {
                expect(() =>
                  ctx.store.insertEmail(normalized, "test"),
                ).not.toThrow();
              }
              const rows = ctx.store.getAllEmails();
              expect(rows.filter((r) => r.email === normalized)).toHaveLength(1);
            } finally {
              ctx.close();
            }
          },
        ),
        { numRuns: 100 },
      );
    });

    it("returns null when inserting a duplicate and the existing id on first insert", () => {
      const first = store.insertEmail("first@example.com", "src");
      const second = store.insertEmail("first@example.com", "src");
      expect(typeof first).toBe("number");
      expect(second).toBeNull();
    });

    it("generates monotonically increasing ids for distinct emails", () => {
      const a = store.insertEmail("a@example.com", "src");
      const b = store.insertEmail("b@example.com", "src");
      const c = store.insertEmail("c@example.com", "src");
      expect(a).not.toBeNull();
      expect(b).not.toBeNull();
      expect(c).not.toBeNull();
      expect((b as number) > (a as number)).toBe(true);
      expect((c as number) > (b as number)).toBe(true);
    });
  });

  describe("getAllEmails", () => {
    let store: WaitlistStore;
    let close: () => void;

    beforeEach(() => {
      const ctx = makeStore();
      store = ctx.store;
      close = ctx.close;
    });

    afterEach(() => close());

    it("returns an empty array on a fresh store", () => {
      expect(store.getAllEmails()).toEqual([]);
    });

    it("returns all inserted entries ordered by created_at ascending", () => {
      const emails = [
        "first@example.com",
        "second@example.com",
        "third@example.com",
      ];
      for (const e of emails) store.insertEmail(e, "src");
      const rows = store.getAllEmails();
      expect(rows.map((r) => r.email)).toEqual(emails);
      const timestamps = rows.map((r) => r.created_at);
      const sorted = [...timestamps].sort();
      expect(timestamps).toEqual(sorted);
    });

    it("returns rows with all required fields and correct types", () => {
      store.insertEmail("user@example.com", "src");
      const [row] = store.getAllEmails() as EmailEntry[];
      expect(row).toMatchObject({
        email: "user@example.com",
        source: "src",
      });
      expect(typeof row.id).toBe("number");
      expect(typeof row.created_at).toBe("string");
    });
  });
});
