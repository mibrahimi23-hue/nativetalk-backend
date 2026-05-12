import { Platform } from "react-native";

function normalizeBaseUrl(raw) {
  if (!raw) return "";
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

export function getApiBaseUrl() {
  const explicit = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (explicit) return normalizeBaseUrl(explicit);

  if (Platform.OS === "android") {
    return "http://10.0.2.2:8000";
  }

  return "http://localhost:8000";
}

async function parseBody(res) {
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
  const text = await res.text();
  return text || null;
}

function buildQuery(params) {
  const search = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    search.append(key, String(value));
  });
  const encoded = search.toString();
  return encoded ? `?${encoded}` : "";
}

export class ApiClient {
  constructor({ getAccessToken, onUnauthorized } = {}) {
    this.baseUrl = getApiBaseUrl();
    this.getAccessToken = getAccessToken || (() => null);
    this.onUnauthorized = onUnauthorized || null;
  }

  setAuthHooks({ getAccessToken, onUnauthorized } = {}) {
    if (getAccessToken) this.getAccessToken = getAccessToken;
    if (onUnauthorized) this.onUnauthorized = onUnauthorized;
  }

  async request(path, options = {}, retry = true) {
    const {
      method = "GET",
      body,
      headers = {},
      auth = false,
      query,
    } = options;

    const authHeaders = {};
    if (auth) {
      const token = this.getAccessToken();
      if (token) {
        authHeaders.Authorization = `Bearer ${token}`;
      }
    }

    const hasBody = body !== undefined && body !== null;
    const isFormDataBody = typeof FormData !== "undefined" && body instanceof FormData;
    const hasJsonBody = hasBody && !isFormDataBody;
    const url = `${this.baseUrl}${path}${buildQuery(query)}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const res = await fetch(url, {
        method,
        headers: {
          ...(hasJsonBody ? { "Content-Type": "application/json" } : {}),
          ...authHeaders,
          ...headers,
        },
        body: hasJsonBody ? JSON.stringify(body) : hasBody ? body : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.status === 401 && auth && retry && this.onUnauthorized) {
        const refreshed = await this.onUnauthorized();
        if (refreshed) {
          return this.request(path, options, false);
        }
      }

      const payload = await parseBody(res);
      if (!res.ok) {
        const detail =
          typeof payload === "string"
            ? payload
            : payload?.detail || payload?.message || `Request failed (${res.status})`;
        const error = new Error(detail);
        error.status = res.status;
        error.payload = payload;
        throw error;
      }

      return payload;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - server not responding');
      }
      throw error;
    }
  }
}
