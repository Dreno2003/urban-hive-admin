/**
 * Centralized API client (Axios).
 *
 * All HTTP requests to the backend should go through this module.
 * When the real API is ready, update `BASE_URL` — the rest of the
 * codebase remains untouched.
 */

import axios, { AxiosError, type AxiosRequestConfig } from "axios";

// ─── Configuration ──────────────────────────────────────────────────
// TODO: Replace with your real API base URL when ready.
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.example.com";

// ─── Types ──────────────────────────────────────────────────────────

export interface ApiError {
  /** Human-readable message suitable for toasts / inline errors. */
  message: string;
  /** Optional machine-readable code from the backend (e.g. "EMAIL_TAKEN"). */
  code?: string;
  /** Optional field-level validation errors from the backend. */
  fieldErrors?: Record<string, string>;
  /** The raw HTTP status code. */
  status: number;
}

// ─── Axios instance ─────────────────────────────────────────────────

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30_000, // 30 seconds
});

// ─── Response interceptor (error normalisation) ─────────────────────

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<Record<string, unknown>>) => {
    const data = error.response?.data;

    const apiError: ApiError = {
      message:
        (data?.message as string) ??
        (data?.error as string) ??
        error.message ??
        "An unexpected error occurred",
      code: data?.code as string | undefined,
      fieldErrors: (data?.fieldErrors ?? data?.errors) as
        | Record<string, string>
        | undefined,
      status: error.response?.status ?? 0,
    };

    return Promise.reject(apiError);
  },
);

// ─── Public convenience methods ─────────────────────────────────────

export const apiClient = {
  get<T>(url: string, config?: AxiosRequestConfig) {
    return api.get<T>(url, config).then((res) => res.data);
  },

  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return api.post<T>(url, data, config).then((res) => res.data);
  },

  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return api.put<T>(url, data, config).then((res) => res.data);
  },

  patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return api.patch<T>(url, data, config).then((res) => res.data);
  },

  delete<T>(url: string, config?: AxiosRequestConfig) {
    return api.delete<T>(url, config).then((res) => res.data);
  },
};
