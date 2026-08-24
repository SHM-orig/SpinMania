export function haptic(ms = 12) {
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* unsupported */
  }
}

export function hapticPattern(pattern: number[]) {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* unsupported */
  }
}
