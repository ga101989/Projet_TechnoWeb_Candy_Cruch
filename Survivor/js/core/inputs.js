export const keys = {};

export function setupKeyboardListeners() {
  window.addEventListener("keydown", e => keys[e.key] = true);
  window.addEventListener("keyup", e => keys[e.key] = false);
}
