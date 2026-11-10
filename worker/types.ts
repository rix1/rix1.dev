// The slice of the Workers runtime API this Worker uses. Kept by hand so the
// Deno-based repo doesn't need @cloudflare/workers-types.

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<{ results: T[] }>;
  run(): Promise<unknown>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch(statements: D1PreparedStatement[]): Promise<unknown[]>;
}

export interface Fetcher {
  fetch(request: Request): Promise<Response>;
}

export interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
}

export interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
}
