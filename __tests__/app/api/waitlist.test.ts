import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import fc from "fast-check";
import Database from "better-sqlite3";
import { createStore, type WaitlistStore } from "@/lib/db/waitlist";

const { state, getInMemoryStore } = vi.hoisted(() => {
  const state: { store: WaitlistStore | null } = { store: null };
  const refs: { db: Database.Database | null } = { db: null };

  function getInMemoryStore(): WaitlistStore {
    if (!state.store) {
      const db = new Database(":memory:");
      refs.db = db;
      state.store = createStore(db);
      state.store.init();
    }
    return state.store;
  }

  return { state, getInMemoryStore };
});

vi.mock("@/lib/db/waitlist", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/db/waitlist")>();
  return {
    ...actual,
    getDb: () => getInMemoryStore(),
  };
});

import { GET, POST } from "@/app/api/waitlist/route";

const SAVED_ENV: Record<string, string | undefined> = {};

beforeEach(() => {
  SAVED_ENV.WAITLIST_ENDPOINT_TOKEN = process.env.WAITLIST_ENDPOINT_TOKEN;
  SAVED_ENV.WAITLIST_ENDPOINT_URL = process.env.WAITLIST_ENDPOINT_URL;
  SAVED_ENV.WAITLIST_SOURCE = process.env.WAITLIST_SOURCE;
  state.store = null;
  delete process.env.WAITLIST_ENDPOINT_TOKEN;
  delete process.env.WAITLIST_ENDPOINT_URL;
  delete process.env.WAITLIST_SOURCE;
});

afterEach(() => {
  process.env.WAITLIST_ENDPOINT_TOKEN = SAVED_ENV.WAITLIST_ENDPOINT_TOKEN;
  process.env.WAITLIST_ENDPOINT_URL = SAVED_ENV.WAITLIST_ENDPOINT_URL;
  process.env.WAITLIST_SOURCE = SAVED_ENV.WAITLIST_SOURCE;
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function authedPostRequest(
  email: string,
  authHeader: string | undefined,
  extraHeaders: Record<string, string> = {},
): Request {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...extraHeaders,
  };
  if (authHeader !== undefined) headers.Authorization = authHeader;
  return new Request("http://localhost/api/waitlist", {
    method: "POST",
    headers,
    body: JSON.stringify({ email }),
  });
}

function authedGetRequest(authHeader: string | undefined): Request {
  const headers: Record<string, string> = {};
  if (authHeader !== undefined) headers.Authorization = authHeader;
  return new Request("http://localhost/api/waitlist", {
    method: "GET",
    headers,
  });
}

describe("waitlist route handler — POST auth", () => {
  // Feature: waitlist-sqlite-storage, Property 4: invalid token rejected on POST
  it("POST with invalid or absent Authorization returns 401", async () => {
    process.env.WAITLIST_ENDPOINT_TOKEN = "secret-token";
    process.env.WAITLIST_ENDPOINT_URL = "http://upstream.test/submit";

    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(),
        fc.option(
          fc
            .string({ minLength: 0, maxLength: 200 })
            .filter((s) => s !== "Bearer secret-token"),
          { nil: undefined },
        ),
        async (email, authHeader) => {
          state.store = null;
          const request = authedPostRequest(email, authHeader);
          const response = await POST(request);
          expect(response.status).toBe(401);
          const body = await response.json();
          expect(body).toEqual({ error: "Unauthorized" });
        },
      ),
      { numRuns: 100 },
    );
  });

  // Example 3.3: no token configured → no auth required
  it("POST without WAITLIST_ENDPOINT_TOKEN configured accepts requests with no Authorization", async () => {
    delete process.env.WAITLIST_ENDPOINT_TOKEN;
    process.env.WAITLIST_ENDPOINT_URL = "http://upstream.test/submit";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 200 })),
    );

    const request = authedPostRequest("user@example.com", undefined);
    const response = await POST(request);
    expect(response.status).toBe(200);
  });

  it("POST with correct Authorization returns 200 when upstream succeeds", async () => {
    process.env.WAITLIST_ENDPOINT_TOKEN = "secret-token";
    process.env.WAITLIST_ENDPOINT_URL = "http://upstream.test/submit";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 200 })),
    );

    const request = authedPostRequest(
      "user@example.com",
      "Bearer secret-token",
    );
    const response = await POST(request);
    expect(response.status).toBe(200);
  });
});

describe("waitlist route handler — POST storage before upstream", () => {
  // Feature: waitlist-sqlite-storage, Property 5: SQLite always written regardless of upstream outcome
  it("email is stored in SQLite for both upstream success and failure", async () => {
    process.env.WAITLIST_ENDPOINT_TOKEN = "secret-token";
    process.env.WAITLIST_ENDPOINT_URL = "http://upstream.test/submit";

    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(),
        fc.integer({ min: 200, max: 599 }),
        async (email, upstreamStatus) => {
          state.store = null;
          const store = getInMemoryStore();
          const upstreamSucceeds = upstreamStatus >= 200 && upstreamStatus < 300;
          vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue(
              new Response(null, { status: upstreamStatus }),
            ),
          );

          const request = authedPostRequest(
            email,
            "Bearer secret-token",
          );
          const response = await POST(request);

          const rows = store.getAllEmails();
          const found = rows.find(
            (r) => r.email === email.toLowerCase().trim(),
          );
          expect(found).toBeDefined();

          if (upstreamSucceeds) {
            expect(response.status).toBe(200);
          } else {
            expect(response.status).toBe(502);
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  // Feature: waitlist-sqlite-storage, Property 6: store without upstream returns 200
  it("POST without WAITLIST_ENDPOINT_URL stores email and returns 200", async () => {
    process.env.WAITLIST_ENDPOINT_TOKEN = "secret-token";
    delete process.env.WAITLIST_ENDPOINT_URL;

    await fc.assert(
      fc.asyncProperty(fc.emailAddress(), async (email) => {
        state.store = null;
        const store = getInMemoryStore();
        const request = authedPostRequest(
          email,
          "Bearer secret-token",
        );
        const response = await POST(request);
        expect(response.status).toBe(200);
        const body = await response.json();
        expect(body).toEqual({
          success: true,
          message: "Email added to waitlist",
        });
        const rows = store.getAllEmails();
        expect(
          rows.find((r) => r.email === email.toLowerCase().trim()),
        ).toBeDefined();
      }),
      { numRuns: 100 },
    );
  });

  // Example 4.1: insertEmail called before fetch
  it("insertEmail is called before fetch", async () => {
    process.env.WAITLIST_ENDPOINT_TOKEN = "secret-token";
    process.env.WAITLIST_ENDPOINT_URL = "http://upstream.test/submit";

    state.store = null;
    const store = getInMemoryStore();
    const callOrder: string[] = [];
    const realInsert = store.insertEmail.bind(store);
    store.insertEmail = (email: string, source: string): number | null => {
      callOrder.push("insert");
      return realInsert(email, source);
    };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(async () => {
        callOrder.push("fetch");
        return new Response(null, { status: 200 });
      }),
    );

    const request = authedPostRequest(
      "user@example.com",
      "Bearer secret-token",
    );
    await POST(request);
    expect(callOrder).toEqual(["insert", "fetch"]);
  });

  // Example 2.3: DB error during insert is logged, request continues
  it("handler logs and continues when DB insert throws", async () => {
    process.env.WAITLIST_ENDPOINT_TOKEN = "secret-token";
    process.env.WAITLIST_ENDPOINT_URL = "http://upstream.test/submit";
    const errorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    state.store = {
      init: () => undefined,
      insertEmail: (): number | null => {
        throw new Error("DB exploded");
      },
      getAllEmails: () => [],
    };

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 200 })),
    );

    const request = authedPostRequest(
      "user@example.com",
      "Bearer secret-token",
    );
    const response = await POST(request);
    expect(response.status).toBe(200);
    expect(errorSpy).toHaveBeenCalledWith(
      "Waitlist local store insert failed:",
      expect.any(Error),
    );
  });
});

describe("waitlist route handler — GET", () => {
  // Feature: waitlist-sqlite-storage, Property 7: GET returns all emails sorted by created_at ASC
  it("GET returns all inserted emails ordered by created_at ascending", async () => {
    process.env.WAITLIST_ENDPOINT_TOKEN = "secret-token";

    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.emailAddress(), { minLength: 1, maxLength: 10 }),
        async (emails) => {
          state.store = null;
          const store = getInMemoryStore();
          for (const email of emails) {
            store.insertEmail(email.toLowerCase().trim(), "test");
          }

          const request = authedGetRequest("Bearer secret-token");
          const response = await GET(request);
          expect(response.status).toBe(200);
          const body = await response.json();
          const expectedUnique = Array.from(
            new Set(emails.map((e) => e.toLowerCase().trim())),
          );
          expect(body.entries).toHaveLength(expectedUnique.length);

          for (let i = 1; i < body.entries.length; i++) {
            expect(
              body.entries[i].created_at >= body.entries[i - 1].created_at,
            ).toBe(true);
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  // Feature: waitlist-sqlite-storage, Property 8: invalid token rejected on GET
  it("GET with invalid or absent Authorization returns 401", async () => {
    process.env.WAITLIST_ENDPOINT_TOKEN = "secret-token";

    await fc.assert(
      fc.asyncProperty(
        fc.option(
          fc
            .string({ minLength: 0, maxLength: 200 })
            .filter((s) => s !== "Bearer secret-token"),
          { nil: undefined },
        ),
        async (authHeader) => {
          state.store = null;
          const request = authedGetRequest(authHeader);
          const response = await GET(request);
          expect(response.status).toBe(401);
          const body = await response.json();
          expect(body).toEqual({ error: "Unauthorized" });
        },
      ),
      { numRuns: 100 },
    );
  });

  // Example 5.3: empty DB returns []
  it("GET on empty store returns empty array", async () => {
    process.env.WAITLIST_ENDPOINT_TOKEN = "secret-token";
    state.store = null;
    getInMemoryStore();

    const request = authedGetRequest("Bearer secret-token");
    const response = await GET(request);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual({ entries: [] });
  });
});
