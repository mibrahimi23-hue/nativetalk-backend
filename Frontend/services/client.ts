import { Platform } from 'react-native';

function getBaseUrl(): string {
  const explicit = (process.env as Record<string, string | undefined>).EXPO_PUBLIC_API_BASE_URL;
  // On web always use localhost so browser-based testing works regardless of .env.local IP
  if (Platform.OS === 'web') return 'http://localhost:8000';
  if (explicit) return explicit.replace(/\/$/, '');
  if (Platform.OS === 'android') return 'http://10.0.2.2:8000';
  return 'http://localhost:8000';
}

function buildQuery(params?: Record<string, unknown>): string {
  if (!params) return '';
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') q.append(k, String(v));
  });
  const s = q.toString();
  return s ? `?${s}` : '';
}

async function parseBody(res: Response): Promise<unknown> {
  const ct = res.headers.get('content-type') ?? '';
  if (ct.includes('application/json')) return res.json();
  const t = await res.text();
  return t || null;
}

type Hooks = {
  getAccessToken: () => string | null;
  onUnauthorized: () => Promise<boolean>;
};

let hooks: Hooks = {
  getAccessToken: () => null,
  onUnauthorized: async () => false,
};

export function setClientHooks(h: Hooks) {
  hooks = h;
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  auth?: boolean;
  query?: Record<string, unknown>;
  headers?: Record<string, string>;
}

export async function request<T = unknown>(
  path: string,
  options: RequestOptions = {},
  retry = true,
): Promise<T> {
  const { method = 'GET', body, auth = false, query, headers = {} } = options;
  const url = `${getBaseUrl()}${path}${buildQuery(query)}`;

  const authHeaders: Record<string, string> = {};
  if (auth) {
    const token = hooks.getAccessToken();
    if (token) authHeaders['Authorization'] = `Bearer ${token}`;
  }

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  const hasJson = body !== undefined && body !== null && !isFormData;
  const contentHeaders: Record<string, string> = hasJson ? { 'Content-Type': 'application/json' } : {};

  const controller = new AbortController();
  const tid = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(url, {
      method,
      headers: { ...contentHeaders, ...authHeaders, ...headers },
      body: hasJson ? JSON.stringify(body) : (body as BodyInit | null | undefined),
      signal: controller.signal,
    });
    clearTimeout(tid);

    if (res.status === 401 && auth && retry) {
      const ok = await hooks.onUnauthorized();
      if (ok) return request<T>(path, options, false);
    }

    const payload = await parseBody(res);
    if (!res.ok) {
      const p = payload as Record<string, unknown> | string | null;
      const detail =
        typeof p === 'string' ? p : (p as Record<string, unknown>)?.detail || `HTTP ${res.status}`;
      const err = new Error(String(detail));
      (err as Error & { status: number }).status = res.status;
      throw err;
    }
    return payload as T;
  } catch (e) {
    clearTimeout(tid);
    if ((e as Error).name === 'AbortError') throw new Error('Request timed out');
    throw e;
  }
}
