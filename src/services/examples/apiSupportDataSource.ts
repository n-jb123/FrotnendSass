import { SupportDataSource } from '../supportDataSource';

/**
 * Reference adapter for connecting the kit to a JSON API.
 *
 * The current UI contract is synchronous because the bundled demo uses an
 * in-memory repository. For a production integration, put TanStack Query,
 * SWR, or your own async state layer in front of this adapter and map the API
 * responses into the same domain models used by the features.
 */
export interface ApiClient {
  get<T>(path: string): Promise<T>;
  post<T>(path: string, body: unknown): Promise<T>;
  patch<T>(path: string, body: unknown): Promise<T>;
  delete(path: string): Promise<void>;
}

export const createFetchApiClient = (baseUrl: string, fetchImpl: typeof fetch = fetch): ApiClient => ({
  async get<T>(path: string) {
    const response = await fetchImpl(`${baseUrl}${path}`);
    if (!response.ok) throw new Error(`GET ${path} failed: ${response.status}`);
    return response.json() as Promise<T>;
  },
  async post<T>(path: string, body: unknown) {
    const response = await fetchImpl(`${baseUrl}${path}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`POST ${path} failed: ${response.status}`);
    return response.json() as Promise<T>;
  },
  async patch<T>(path: string, body: unknown) {
    const response = await fetchImpl(`${baseUrl}${path}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`PATCH ${path} failed: ${response.status}`);
    return response.json() as Promise<T>;
  },
  async delete(path) {
    const response = await fetchImpl(`${baseUrl}${path}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`DELETE ${path} failed: ${response.status}`);
  },
});

// Keep the import above visible to TypeScript-aware IDEs as a discoverability
// hint: SupportDataSource is the contract implemented by the bundled mock.
export type { SupportDataSource };
