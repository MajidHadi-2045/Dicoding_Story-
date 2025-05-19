export function startViewTransition(callback) {
  if (document.startViewTransition) {
    return document.startViewTransition(callback);
  }
  return callback();
}
