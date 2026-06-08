/**
 * Storage keys catalog to ensure consistency across the application.
 * All new localStorage / session keys must be declared here.
 */
export const STORAGE_KEYS = {
  SELECTED_STATE: "urban_hive_selected_state",
} as const

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS]

/**
 * Storage adapter abstraction.
 * This abstracts localStorage read/write operations so that migrating
 * to cookies (or any other persistence layer) only requires editing this file.
 */
export const storage = {
  /**
   * Retrieves a value from storage.
   */
  get(key: StorageKey): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(key)
  },

  /**
   * Sets a value in storage.
   */
  set(key: StorageKey, value: string): void {
    if (typeof window === "undefined") return
    localStorage.setItem(key, value)
  },

  /**
   * Removes a key from storage.
   */
  remove(key: StorageKey): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(key)
  },
}
