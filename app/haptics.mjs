/** Optional tactile feedback; unsupported devices must remain fully usable. */
export function tapHaptic() {
  try {
    globalThis.navigator?.vibrate?.(15);
  } catch {
    // Browser or device policy may disable vibration.
  }
}
