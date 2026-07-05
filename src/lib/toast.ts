// Appends a `toast` query param that <SuccessToast> picks up post-redirect
// and strips from the URL after showing.
export function withToast(path: string, message: string): string {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}toast=${encodeURIComponent(message)}`;
}
