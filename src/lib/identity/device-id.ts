const STORAGE_KEY = "bipi_device_id";

// Stage 1 of the user pipeline: a Guest Profile is just this random,
// non-identifying string, generated once and kept in local storage.
// No name, phone, or email is ever collected to produce it.
export function getOrCreateDeviceId(): string {
  if (typeof window === "undefined") {
    throw new Error("getOrCreateDeviceId must run in the browser");
  }

  const existing = window.localStorage.getItem(STORAGE_KEY);
  if (existing) return existing;

  const deviceId = crypto.randomUUID();
  window.localStorage.setItem(STORAGE_KEY, deviceId);
  return deviceId;
}
