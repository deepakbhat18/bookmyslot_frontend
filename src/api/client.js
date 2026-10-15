import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;

/**
 * Handle 401 responses gracefully by clearing stale session storage
 * and redirecting the user to /login (if not already on an auth page).
 */
export function handleUnauthorized() {
  sessionStorage.removeItem("USER_ID");
  sessionStorage.removeItem("ROLE");
  sessionStorage.removeItem("CLUB_ID");
  sessionStorage.removeItem("NAME");

  if (typeof window !== "undefined" && window.location) {
    const path = window.location.pathname;
    const isAuthPage =
      path === "/login" ||
      path === "/register" ||
      path === "/forgot-password" ||
      path === "/reset-password";

    if (!isAuthPage) {
      sessionStorage.setItem("AUTH_REDIRECT", path);
      window.location.href = "/login";
    }
  }
}

/**
 * Shared Fetch client configured for cross-origin session authentication.
 *
 * Guarantees:
 * 1. credentials: "include" on every request to transmit session cookies.
 * 2. Automatic URL normalization against API_BASE_URL.
 * 3. Safe response.json() wrapper that gracefully handles plain-text 401/error responses
 *    (e.g., "Login required") without throwing JSON parse SyntaxErrors.
 * 4. Automatic handling of 401 Unauthorized responses.
 */
export async function apiFetch(input, init = {}) {
  let url = typeof input === "string" ? input : (input?.url || "");

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    const cleanBase = API_BASE_URL.replace(/\/+$/, "");
    const cleanPath = url.replace(/^\/+/, "");
    url = `${cleanBase}/${cleanPath}`;
  }

  const options = {
    ...init,
    credentials: "include",
    headers: {
      ...(init.headers || {}),
    },
  };

  // Set default JSON Content-Type when body is a string or plain object (not FormData / Blob)
  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !(options.body instanceof Blob) &&
    !(options.body instanceof URLSearchParams)
  ) {
    const hasContentType = Object.keys(options.headers).some(
      (h) => h.toLowerCase() === "content-type"
    );
    if (!hasContentType) {
      options.headers["Content-Type"] = "application/json";
    }
  }

  const response = await fetch(url, options);

  // Wrap response.json() so callers never crash when the backend returns plain text (like "Login required")
  const originalJson = response.json.bind(response);
  response.json = async () => {
    try {
      return await originalJson();
    } catch {
      try {
        const text = await response.clone().text();
        return {
          success: false,
          message: text || (response.status === 401 ? "Login required" : "Request failed"),
          data: null,
        };
      } catch {
        return {
          success: false,
          message: response.statusText || (response.status === 401 ? "Login required" : "Request failed"),
          data: null,
        };
      }
    }
  };

  if (response.status === 401) {
    handleUnauthorized();
  }

  return response;
}

/**
 * Shared Axios instance configured with withCredentials: true
 * and automatic 401 interceptor handling.
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      handleUnauthorized();
    }
    return Promise.reject(error);
  }
);
